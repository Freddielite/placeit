# What changed (session 2 - fixes and app-feel polish)

Building on the first pass against `i-tapp-client-main` (the correct repo).
Everything below was verified with a real `npm run build` - exit 0, all 69
routes compiled, TypeScript clean - before packaging.

## 1. Fixed: old/broken logo showing everywhere

Root cause found: `src/components/logo.tsx` pointed at `new-logo.svg`, which
has a broken solid-black background box baked into the file (bad Canva
export - visible the moment you render it). This `Logo` component is used
almost everywhere: site header/footer, auth pages, portal header/sidenav,
company dashboard welcome banner, onboarding (all three roles), signup
success screen, get-started page.

Fix: pointed it at the clean `logo.svg` wordmark instead, with `h-auto
w-auto` classes added so the aspect ratio scales correctly no matter what
width class each page passes in (dimensions changed from a 150x150 square
to the wordmark's real 180x46 ratio).

## 2. Fixed: pixelated splash/icon

Traced the actual cause: the little person/circle graphic embedded in
`logo.svg` is an auto-traced/AI-vectorized image (Canva's "trace image"
export), not real vector art - it inherits blur/blockiness at any size no
matter the file format. Confirmed by rendering it at 8x.

Fix: built a clean typographic monogram from scratch - a bold "P" on a
rounded blue square, pure vector, guaranteed crisp. New file:
`public/brand-icon.svg`. Regenerated every icon size from it:
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- Android launcher icon + splash in `placeit-mobile/` (regenerated via
  `capacitor-assets`)

The animated web splash (`app-splash.tsx`) and pull-to-refresh indicator
both now use this monogram too.

## 3. Widened native-only scope to cover installed PWAs

You installed via Chrome's "Install app," not a compiled APK through
Android Studio - so anything scoped to native-Capacitor-only (text-select
lock, etc.) wasn't doing anything for you. `native-app-detector.tsx` now
checks `isInstalledApp()` (native app OR installed PWA) instead of native
only. This is why text-selection is now actually locked in your test
environment.

## 4. Pull-to-refresh: content now actually shifts down

Previously the logo indicator just floated above the page as an overlay -
the page itself never moved. Rewrote `pull-to-refresh.tsx` to wrap
`children` and push the actual content down via `margin-top` as you pull.

Deliberately NOT using a CSS `transform` for this: a `transform` on a
wrapper creates a new containing block for any `position:fixed` descendant
- would have broken every fixed header/modal/sidenav elsewhere in the app.
Margin doesn't have that problem.

## 5. Page transitions: fixed the "still looks like a browser" issue

Two real bugs, not just a tuning issue:
- `mode="wait"` on `AnimatePresence` forces the outgoing page to fully
  finish animating out before the incoming page starts - that's the dead
  gap that read as "stuck." Switched to `mode="popLayout"`, which lets both
  overlap smoothly with no layout jump.
- Duration cut from 220ms to 140ms, and the motion changed from a vertical
  slide (reads as a webpage scrolling) to a subtle scale+fade (reads as a
  native screen transition).

## 6. Removed the top loading bar entirely

`Next13ProgressBar` and its `Suspense` wrapper removed from
`app-provider.tsx`. See #7 for what replaces it on the pages that actually
need loading feedback.

## 7. Skeleton loaders (replacing spinners) on the highest-traffic pages

Important finding: most of this app's pages fetch data client-side via
React Query, not via Next.js server components - meaning a route-level
`loading.tsx` file would only cover the (near-instant) moment before the
client component mounts, not the actual data-loading window. The real fix
had to be inside each component, replacing its internal spinner branch.

Done, with skeletons matched to each page's real layout (not generic
placeholders):
- Company dashboard (`dashboard/_molecules/index.tsx`) - stat-box row +
  applicant list rows
- Corps "Find PPA" listing (`find-ppa/_molecules/index.tsx`) - card grid
  matching `PPACard`'s actual layout

Student "Find IT Space" already had a proper matching skeleton
(`Results`'s `SkeletonCard`) - nothing to fix there.

**Not yet done** (same pattern, straightforward to extend): company
opportunity detail page, student "my-application," corps
"my-applications" still show the generic spinner. Same approach (matched
`Skeleton` composition, shadcn's `Skeleton` primitive already in the
project) would apply.

## Verified

Full `npm run build`, exit 0, all 69 routes compiled, TypeScript clean, zero
errors introduced. Only Google Fonts and env vars were stubbed for the
sandbox test itself (network restriction here, not a bug) and both were
reverted/removed before packaging - the delivered code has real font
imports and no `.env.local`.

---

# What changed (session 3 - app vs browser separation)

Split the "feels like an app" behaviours out of the website. Previously
some were gated on `isInstalledApp()`, some were global, and the CSS
comments disagreed with the code about which was which.

## New: one switchboard

`src/config/app-features.ts` - every app-feel feature with a scope of
`all | app | native | browser | off`. This is the only file you edit to
change what runs where. Full reference in `APP-VS-BROWSER.md`.

## New: one detector

`src/lib/app-mode.ts` replaces `src/lib/is-installed-app.ts` (deleted).
Resolves a single `AppMode` of `native | pwa | browser`. Hardened beyond
the old check: adds `display-mode: fullscreen` and `minimal-ui`, iOS
Safari's `navigator.standalone`, and the Android TWA `android-app://`
referrer - the old version missed installed apps on all three.

Adds `?appmode=1` to force app mode in a desktop browser for testing
(sticks for the session, `?appmode=0` clears).

## New: one provider

`src/components/providers/app-mode-provider.tsx` - `useAppMode()`,
`useFeature("x")`, `<AppOnly>`, `<BrowserOnly>`. Components no longer
sniff `window.Capacitor` themselves.

The boot script in `layout.tsx` now writes `is-app-mode` /
`is-browser-mode` / `is-native-app` onto `<html>` before first paint, and
the provider reads that class in its `useState` initialiser - so the first
client render is already correct and nothing remounts.

## Moved to app-only

- **Pull-to-refresh** - was running on the website too. Gated together
  with the `overscroll-behavior-y: contain` CSS that suppresses Chrome's
  own pull-to-refresh, so browser users get the native gesture back
  rather than losing both.
- **Page transitions** - was running everywhere; added ~250ms to every
  click on the website. Browser navigations are now instant.
- **`-webkit-tap-highlight-color: transparent`** - was global.
- **`env(safe-area-inset-*)` body padding** - was global.
- **Pinch-zoom block** - was in the static `viewport` export, so
  `user-scalable=no` shipped on the public site (WCAG 1.4.4 failure,
  Lighthouse penalty). The metadata now ships the accessible viewport and
  `AppShellEffects` tightens the tag at runtime only in app mode.
- **Text-selection lock** - unchanged in effect, but the CSS selector
  moved from `.is-native-app` to `html.is-app-mode` so it matches what
  the code actually did (the old comment claimed native-only).

## Unchanged on purpose

- **Service worker** stays registered in the browser - without it the PWA
  isn't installable, which is how users reach app mode at all.
- **Splash and offline screen** were already app-only; just rewired
  through the shared gate.

## Structural note

`AppProvider` renders the same element tree in both modes - the app-only
wrappers switch off internally instead of being conditionally mounted.
Conditional mounting would tear down and rebuild the whole page tree the
moment the mode resolves, losing scroll position, form state and
in-flight React Query renders.

## Verified

`npm install` could not complete in this sandbox (the registry proxy
hangs), so unlike session 2 this was **not** validated with a full
`npm run build`. The changed files were type-checked in isolation with
`tsc --noResolve` and are clean apart from the expected
unresolved-import noise. Please run a real `npm run build` before
shipping.
