# App mode vs browser mode

PlaceIT ships as three things off one codebase:

| Runtime | What it is | Mode |
|---|---|---|
| Native | The Capacitor build in `placeit-mobile/` (Play Store / App Store) | `native` |
| Installed PWA | Chrome/Safari "Install app" from getplaceit.com | `pwa` |
| Website | A normal browser tab | `browser` |

`native` and `pwa` together are **app mode**. Everything that exists to make
PlaceIT stop feeling like a web page is scoped to app mode; the website keeps
stock browser behaviour.

## The three files that matter

1. **`src/config/app-features.ts`** — the switchboard. One line per feature,
   one of `all | app | native | browser | off`. Change a scope here and the
   whole app follows. Start here.
2. **`src/lib/app-mode.ts`** — how the mode is detected (Capacitor,
   `display-mode`, iOS `navigator.standalone`, TWA referrer, dev override).
3. **`src/app/layout.tsx`** — an inline boot script that runs the same
   detection *before first paint* and writes the mode onto `<html>`. This is
   why there's no flash of app chrome on the website (or vice versa).

The boot script and `app-mode.ts` implement the same logic twice, on purpose —
the script has to be inline and dependency-free to beat the first paint.
**If you change one, change the other.**

## Current split

| Feature | Scope | Why |
|---|---|---|
| `pullToRefresh` | app | Drag-to-refetch with the logo indicator |
| `pageTransitions` | app | Fade+scale crossfade; adds ~250ms to every web click |
| `splashScreen` | app | 1.7s of branding is an app convention, a bounce risk on web |
| `offlineScreen` | app | The browser already has its own offline page |
| `textSelectionLock` | app | Long-press select is expected on a web page |
| `overscrollLock` | app | Suppresses the browser's own pull-to-refresh |
| `disableZoom` | app | `user-scalable=no` fails WCAG 1.4.4 on the web |
| `noTapHighlight` | app | The grey tap flash is a "this is a browser" tell |
| `safeAreaInsets` | app | Notch/home-indicator padding |
| `hardwareBackButton` | **native** | Android back → in-app nav instead of exiting |
| `haptics` | app | Plugin on native, Vibration API in an installed PWA |
| `keyboardHandling` | app | Soft-keyboard avoidance for a forms-heavy app |
| `bottomTabBar` | app | Fixed portal tab bar, mobile widths only |
| `offlineCache` | app | Persisted React Query cache |
| `serviceWorker` | **all** | Must stay on in the browser or the PWA can't be installed |
| `installBanner` | browser | Only the website should advertise the app |

### Native detection does not depend on the Capacitor bridge

The shell loads `getplaceit.com` remotely rather than from bundled files, so
`window.Capacitor` is injected into a page Capacitor doesn't serve and is not
guaranteed to exist when the boot script runs. A bare Android WebView also
does **not** report `display-mode: standalone`, so there'd be no fallback —
the store build would call itself a browser and switch every app feature off.

The primary signal is therefore the user-agent marker `PlaceItApp`, set by
`appendUserAgent` in `capacitor.config.json`. It's on the WebView before the
first request and readable synchronously. **If you change that string, change
`NATIVE_UA_MARKER` in `app-mode.ts` and the literal in the boot script.**

Separately: anything that *calls* a plugin must check `hasBridge()` from
`src/lib/capacitor-bridge.ts`, not the mode. The UA can say "native" a moment
before the bridge finishes injecting. `whenBridgeReady()` handles the wait.

### Two pairings you can't break independently

- **`pullToRefresh` + `overscrollLock`.** The CSS lock is what removes
  Chrome's native pull-to-refresh. Enable the lock without the custom
  gesture and users get *no* refresh gesture at all. Both are app-scoped;
  keep them together.
- **`splashScreen` + the `app-boot` class.** `html.app-boot body` is
  `visibility: hidden`. The boot script only adds it in app mode, and
  `AppSplash` removes it the moment its overlay mounts. There's a 4s
  failsafe timer in the script — don't remove it, it's the only thing
  standing between a JS error and a permanently blank screen.

## How components ask

```tsx
import { useAppMode, useFeature, AppOnly, BrowserOnly }
  from "@/components/providers/app-mode-provider";

const enabled = useFeature("pullToRefresh");     // boolean
const { isApp, isNative, isBrowser } = useAppMode();

<AppOnly><HapticButton /></AppOnly>
<BrowserOnly><GetTheAppBanner /></BrowserOnly>
```

Components should never sniff `window.Capacitor` or `display-mode`
themselves — that's how the two definitions of "app" drifted apart last time.

### Tree stability

`AppProvider` renders the **same element tree in both modes**. The app-only
wrappers (`PullToRefresh`, `PageTransition`) switch themselves off internally
rather than being conditionally mounted. If you swap them for
`{isApp && <Wrapper>}`, the entire page tree unmounts and remounts the moment
the mode resolves — losing scroll position, form state and in-flight React
Query renders. Gate the *behaviour*, not the *mounting*.

## Testing browser mode vs app mode

- **App mode in a desktop browser:** append `?appmode=1` to any URL. It sticks
  for the session (`sessionStorage`). `?appmode=0` clears it.
- **Real browser mode:** a normal tab, no query param.
- **Real PWA:** Chrome → Install app → launch from the home screen.
- **Native:** `cd placeit-mobile && npx cap run android`.

Quick check that gating works: open devtools and look at `<html class>`.
You should see exactly one of `is-app-mode` / `is-browser-mode`, plus
`is-native-app` only inside the Capacitor build.

## Adding something app-exclusive

1. Add a key to `APP_FEATURES` with its scope.
2. In the component: `const on = useFeature("yourFeature");` and no-op when
   false — don't return `null` if it wraps content.
3. If it's CSS, put the rule under `html.is-app-mode` in `globals.css`.
4. Note the scope in the table above.

## Plugins

The Next app does **not** npm-install `@capacitor/*`. Plugin JS is reached
through `window.Capacitor.Plugins.*` via `src/lib/capacitor-bridge.ts`, which
returns `null` off-native so every caller no-ops safely. Plugins are declared
in `placeit-mobile/package.json` and need a `cap sync` after any change.

Currently: `app`, `haptics`, `keyboard`, `splash-screen`, `status-bar`.

## Offline cache — read before shipping

`src/lib/query-persist.ts` writes successful React Query responses to
`localStorage` in plaintext. On a shared phone that's the previous user's
profile and applications sitting on disk. Three mitigations are in place:

- `DO_NOT_PERSIST` — query-key prefixes that are never written. Add to it if
  a query returns anything more sensitive than what's already covered.
- `clearPersistedCache()` runs in `useLogout` alongside `queryClient.clear()`.
- Snapshots expire after 24h and are keyed to `NEXT_PUBLIC_BUILD_ID`, so a
  deploy that changes an API shape invalidates them rather than crashing on
  stale data. **Set that env var in your build** or every deploy shares the
  `"dev"` key and stale-shape crashes become possible.

## Not done yet

- **Push notifications.** The highest-value app-only feature left: application
  viewed, employer responded, new PPA matching your course. Needs FCM plus
  backend token registration.
- **Deep links / App Links.** `AndroidManifest.xml` still has no intent
  filters beyond LAUNCHER, so verification and password-reset emails open the
  browser rather than the app. Needs `assetlinks.json` on the domain.
- **Status bar colour** per route — the plugin is configured in
  `capacitor.config.json` but nothing drives it at runtime.
  `getStatusBarPlugin()` is ready in the bridge helper.
- **Native camera / file picker** for CV upload.
- **Splash on cold start only** — it currently replays its full 1.7s on every
  resume from background.
- **`installBanner`** is declared in the registry but has no component yet;
  the `browser` scope and `<BrowserOnly>` wrapper are ready for it.

## Unrelated bug spotted

`companyNavLinks` in `src/constants/index.ts` points at
`/portal/space/add-new-space` and `/portal/candidates/accepted`. Neither route
exists — the real ones are `/portal/opportunities` and
`/portal/candidates/[studentId]`. Left alone since it predates this work and
fixing it is a product decision, but those links 404 today. The new tab bar
uses the real paths.
