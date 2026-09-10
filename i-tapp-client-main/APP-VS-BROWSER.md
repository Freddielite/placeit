# App mode vs browser mode

> This is the developer reference. The client-facing summary is
> `PLACEIT-APP-UPDATE.html` — no file paths, no implementation detail, framed
> around what changed for users and what's outstanding.

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
| `deepLinks` | **native** | Email links open the app, not Chrome (see below) |
| `cameraCapture` | all | "Take photo" on uploads; real gate is the device |
| `haptics` | app | Plugin on native, Vibration API in an installed PWA |
| `keyboardHandling` | app | Soft-keyboard avoidance for a forms-heavy app |
| `bottomTabBar` | app | Fixed portal tab bar, mobile widths only |
| `offlineCache` | app | Persisted React Query cache |
| `darkMode` | everywhere | Light / dark / follow-system (see below) |
| `serviceWorker` | **all** | Must stay on in the browser or the PWA can't be installed |
| `installBanner` | browser | Only the website should advertise the app |

Two of these are scoped by something other than the runtime, and the runtime
scope is the loose outer bound rather than the real gate:

- **`cameraCapture` is gated by the DEVICE.** `canOfferCamera()` in
  `src/lib/camera.ts` shows the button when the Capacitor Camera plugin is
  live *or* `pointer: coarse` matches. A phone browser opens the camera
  through `<input capture>` perfectly well, and photographing an IT letter
  is just as useful on the website; a desktop has nothing to point at a
  document. Same shape of reasoning as `darkMode` being route-gated.
- **`deepLinks` is native-only, and a PWA is not being short-changed.**
  Chrome routes in-scope links into an installed PWA itself. There is
  nothing for us to do there. Only the wrapped shell has to be told.

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

Currently: `app`, `camera`, `haptics`, `keyboard`, `splash-screen`,
`status-bar`. `camera` is new — **run `cap sync`** or `getCameraPlugin()`
returns null and uploads silently fall back to the file picker.

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

## Dark mode

`ThemeProvider` is hand-rolled rather than next-themes, for one reason:
ordering. next-themes injects its own pre-paint script and we already have one
(the app-mode boot script) that has to run first and decides whether dark mode
is even available. Two competing pre-paint scripts race and the loser causes a
flash. next-themes stays in `package.json` only because `ui/sonner.tsx`
imported it — that import now points at our provider instead.

**How the palette flips.** Tailwind v4 compiles every colour utility to
`var(--color-*)`, so `.dark` in `globals.css` redefines those variables rather
than adding a `dark:` variant to ~1,700 utilities across 155 files. The neutral
ramp is deliberately **inverted** — `gray-50` becomes the darkest surface,
`gray-900` becomes near-white — so `bg-gray-50 text-gray-800` keeps its
contrast relationship instead of going dark-on-dark.

**Scope is now everywhere**, including the marketing site. It was `/portal`
only for two rounds because the public pages hardcoded their colour: the
background stayed light, the `text-gray-900` on it inverted to near-white, and
whole sections became unreadable.

The rule still holds: **the theme follows the surface, not the runtime.** A
page can only go dark if its colours resolve through variables. The marketing
site now does, via three changes:

- **`--accent-blue` / `--accent-green` / `--accent-violet`** (+ matching
  `-rgb` triples). Each public page drove all of its colour from one
  module-level constant (`const green = "#059669"`). Those are variables now,
  lifted under `.dark` because the originals fail contrast on `#12161c`.
- **`--surface-*`** for the opaque tinted section backgrounds
  (`bg-[#f0fdf4]` and friends).
- **Hex-alpha concatenation rewritten.** `` `${green}18` `` can't work once
  `green` is a `var()`, so every one became
  `` `rgba(${greenRgb}, 0.09)` ``. That's why the `-rgb` twins exist.

**17 accent tint families** (`bg-emerald-50` + `text-emerald-600` chips) are
remapped at 50/100/200 and 600/700. 400/500 are left alone - they're solid
fills that already carry white text.

**The `--white` split.** Remapping `--white` fixes ~600 `bg-white` cards for
free, but also catches ~250 foreground uses (`text-white` on a coloured
button, `border-white/30`, `bg-white/10` glows). Those rebind the variable
back to real white on the element itself, which preserves each utility's own
alpha. `--white` is the *card* colour, not the page background, so `bg-white`
cards keep their elevation.

Route list is `THEMEABLE_ROUTE_PREFIXES` in `src/lib/theme.ts`, duplicated in
the boot script. **If you add an area that hardcodes colour, narrow this list
rather than shipping it broken** - `["/portal"]` restores the previous
behaviour. Grep any new area for `-[#`, inline `style` colours and gradient
stops first.

**`.theme-light`** (globals.css) restores the light palette for one subtree
inside a dark screen - for a brand banner, an illustration with a baked
background, or an embed.

Deliberately still light: the WhatsApp mockup's outgoing chat bubble
(`#dcf8c6`) and the WhatsApp brand green, since that block is a replica of
someone else's UI. Its text is pinned dark so it stays readable.

Theme is resolved in the same boot script pass as the mode, so a dark cold
start never shows a light frame first. On native, the status bar style and
colour follow the theme via `getStatusBarPlugin()`.

**Scope is `all`, not `app`.** The runtime gate bought nothing once route
scoping existed (the marketing site is protected either way) and it hid the
toggle from anyone using the portal in a normal browser tab. Route scoping is
the only gate that matters.

**Where the toggle lives.** `<ThemeToggleButton />` (single cycling button) in
the portal header, at every breakpoint — this matters, because the header's
actions row is `hidden md:flex`, so anything placed there alone is unreachable
on a phone. `<ThemeToggle />` (three-way segmented control) also sits in the
mobile nav sheet under "Appearance", since "follow my phone" is the option
most people want and a cycling button can't express it. Both return `null`
outside the themeable routes.

## Deep links (App Links)

Tapping a verification or password-reset link from an email used to open
Chrome — on a phone that already had PlaceIT installed, with the user
already signed in there. Two sessions, two cookie jars, and a verification
that looks like it didn't work.

Four pieces, and it only works when all four line up:

1. **`AndroidManifest.xml`** — an `autoVerify` intent filter for
   `https://www.getplaceit.com` with `pathPrefix="/account"`, plus an
   unverified `placeit://` scheme as a fallback and test hook.
2. **`src/app/.well-known/assetlinks.json/route.ts`** — the Digital Asset
   Links file Android fetches to confirm this domain vouches for the app.
3. **`src/lib/deep-links.ts`** — URL → in-app path, with an allowlist.
4. **`src/components/providers/deep-link-handler.tsx`** — listens and
   navigates.

**You must set `ANDROID_APP_FINGERPRINTS` in the deploy environment.** It's
the SHA-256 of the *app signing* key (Play Console → Setup → App signing),
not the upload key — Play re-signs your upload, so the upload key's
fingerprint is not what lands on the device. Comma-separate to include the
debug key too. Until it's set the route 404s deliberately: a file with a
placeholder fingerprint is worse than no file, because Android caches a
verification failure and retries on its own schedule.

**One host, on purpose.** Verification is all-or-nothing across every host
an `autoVerify` filter declares. Adding the apex `getplaceit.com` alongside
`www` fails the whole filter if the apex 301s to www, because the file has
to be served with no redirect. Add the apex only after confirming it serves
`/.well-known/assetlinks.json` directly.

**Paths are scoped to `/account`** — where the emailed links land. That list
lives in two places that must agree: `pathPrefix` in the manifest decides
what Android hands over, and `ALLOWED_PATH_PREFIXES` in `deep-links.ts`
decides what the app acts on. The allowlist is a security boundary, not
tidiness: any installed app can fire `placeit://` at us and that scheme has
no verification behind it, so an unbounded list would let a hostile app drop
someone on an arbitrary screen of a logged-in session.

**Cold vs warm start.** `getLaunchUrl()` covers the launch intent;
`appUrlOpen` covers a link tapped while the app is already running
(`singleTask` reuses the activity rather than stacking a second one). Both
are checked and deduped, since platforms differ on whether the launch URL
also fires the event. On a cold start the shell has already begun loading
the homepage before we redirect — that's covered rather than fixed: the
1.7s splash outlasts the redirect, so the user sees splash → the
verification screen.

Test without waiting on DNS or a store build:

```
adb shell am start -a android.intent.action.VIEW -d "placeit://account/verify?token=test"
adb shell pm get-app-links com.wyntek.placeit    # should say "verified"
curl -sI https://www.getplaceit.com/.well-known/assetlinks.json
```

That last one must be `200`, `application/json`, and **no 3xx hop**.

## Camera capture on uploads

`src/components/file-upload-thing.tsx` is the single component behind all
eight upload fields — student IT letter and CV, corps call-up / CV /
relocation letters, company logo and banner, and the offer attachment — so
the camera lands everywhere at once.

Two implementations, chosen at runtime:

- **native** — `@capacitor/camera` via `captureWithNativeCamera()`. The shell
  loads a remote origin, so a page-driven `<input capture>` there is at the
  mercy of the WebView's file-chooser wiring and permission delegation. The
  plugin is the path that reliably works.
- **web** — `<input type="file" accept="image/*" capture="environment">`.
  Mobile browsers open the camera; desktop ignores `capture`, which is why
  the button is hidden on `pointer: fine`.

Output has to satisfy `fileSchema` (`src/schemas/company.schema.ts`): a
`File`, ≤10MB, of an accepted MIME type. The plugin options guarantee it —
JPEG at quality 80, max 1600px, which is 200–600KB for a photographed A4
page and still legible.

The web path can't ask the camera for anything: `<input capture>` hands back
whatever the camera app saved, routinely 4–9MB and sometimes over the cap.
`downscaleImage()` re-encodes it to the same budget, so both paths behave
alike. It returns the original file untouched on any failure — every step
(`createImageBitmap`, canvas, `toBlob`) can be missing or throw depending on
the browser, and a file the user can see rejected beats a silent black
square. `correctOrientation` matters more than it sounds:
phones record rotation in EXIF rather than rotating pixels, so without it a
portrait photo of an IT letter arrives sideways. The web path needs the same
thing by a different name — `imageOrientation: "from-image"` when decoding,
or the canvas draws raw sensor pixels and undoes the point of the exercise.

`captureWithNativeCamera()` returns a reason, not just null, because the
plugin reports a cancel by throwing and a denied permission the same way.
A cancel deserves silence; a denial can't be fixed from inside the app, so
the caller toasts. Collapsing the two leaves someone tapping a button that
does nothing forever after one accidental Deny.

`onChange` widened from `(val: File) => void` to accept `undefined` so the
field can be cleared — needed for Retake, and compatible with every existing
call site since they all pass react-hook-form's `field.onChange`.

Android needs `CAMERA` declared in the manifest (that's what lets the plugin
request it at runtime) and `uses-feature ... required="false"` so the Play
Store doesn't filter the app off camera-less devices. No media/storage
permission: we only ever call `source: "CAMERA"`, never the gallery picker.

**`cap sync` after pulling this** — the plugin is new in
`placeit-mobile/package.json` and won't be in the bridge until you do.

## Install banner

`src/components/get-the-app-banner.tsx` fills the `installBanner` slot that
had a scope and a `<BrowserOnly>` wrapper but no component.

Chrome/Edge on Android fire `beforeinstallprompt`; `preventDefault()`
suppresses the browser's own mini-infobar and hands us a deferred event we
can fire from a real button. It is single-use and needs a user gesture.
iOS Safari has no equivalent and no programmatic install at all, so there
the button expands Share → Add to Home Screen instructions instead. Chrome
and Firefox on iOS are excluded: they're Safari underneath but can't install
at all, so those instructions would be wrong.

Set `NEXT_PUBLIC_ANDROID_STORE_URL` once the Play listing is live and
Android visitors get sent there instead — a store install is the better
outcome, and it's the build that actually gets the native-scoped features.
Unset, it falls back to the PWA install prompt, so there's no dead link now.

Dismissal is remembered for 14 days; installing (by any route, including
Chrome's own menu) stops it permanently. It waits 4s before appearing —
asking someone to install before they've read anything is how banners get
reflexively dismissed. Mobile widths only, and `globals.css` pads the body
while `[data-install-banner]` is present so the banner never covers the last
row of a form.

## Not done yet

- **Push notifications.** The highest-value app-only feature left: application
  viewed, employer responded, new PPA matching your course. Needs FCM plus
  backend token registration.
- **Status bar colour** per route — the plugin is configured in
  `capacitor.config.json` but nothing drives it at runtime.
  `getStatusBarPlugin()` is ready in the bridge helper.
- **Splash on cold start only** — it currently replays its full 1.7s on every
  resume from background.

## Unrelated bug spotted

Three, now.

**Sonner toasts don't render.** `<Toaster />` from `src/components/ui/sonner.tsx`
isn't mounted anywhere, but `src/app/(auth)/account/activate/index.tsx` and
`src/app/(superuser)/(admin)/admin/company/new/index.tsx` both call
`toast` from `sonner`. Those messages — including "Account activated
successfully!" on the activate screen — go nowhere. `react-toastify` is the
one with a live container (`<ThemedToastContainer />` in `AppProvider`), so
new code should use that until someone picks one. Worth noting that the
activate screen is now a deep-link destination, so its silent success
message is more visible a gap than it was.

`src/app/(auth)/account/verify/index.tsx` links to `/resend-verification`
twice, but the route is `/account/resend-verification` — both 404. It's the
page someone lands on when a verification link has expired, which is now
also the page a deep link lands on, so it's worth a look. Left alone as it
predates this work and is a one-line href change either way.

`companyNavLinks` in `src/constants/index.ts` points at
`/portal/space/add-new-space` and `/portal/candidates/accepted`. Neither route
exists — the real ones are `/portal/opportunities` and
`/portal/candidates/[studentId]`. Left alone since it predates this work and
fixing it is a product decision, but those links 404 today. The new tab bar
uses the real paths.
