# What changed

This is against the correct repo (`i-tapp-client-main`, the real live
codebase behind getplaceit.com) - the earlier zip built against a wrong/old
repo was discarded per your request.

## 1. i-tapp-client-main/ (edited)

**Page transitions**
- `src/components/providers/page-transition.tsx` - new, Framer Motion,
  keyed on route
- `src/components/providers/app-provider.tsx` - wired it in, alongside all
  the pieces below
- `framer-motion` added to `package.json`

**Store readiness**
- `src/app/manifest.ts` - new. PWA manifest: name "PlaceIT", icons, theme
  color `#477dc0` (pulled from your actual `--primary` CSS variable, not a
  guess)
- `public/sw.js` - new. Hand-written service worker, NOT `next-pwa` -
  this repo builds with `next build --turbopack`, and `next-pwa` is a
  webpack-only plugin that silently won't run under Turbopack. This is a
  small, direct static file instead: install/activate/fetch handlers, basic
  same-origin caching. Registered via `native-app-detector.tsx` in
  production only.

**Animated splash**
- `src/components/providers/app-splash.tsx` - new. Uses `logo.svg` (the
  "PlaceIT" wordmark is genuine vector, confirmed by rendering it at 8x -
  no blur). Fades/scales in over 550ms, holds, fades out around 1.7s total.
  Shown only in the installed app (native Capacitor shell or installed
  PWA) - never in a plain browser tab.

**Custom pull-to-refresh**
- `src/components/providers/pull-to-refresh.tsx` - new. Pull down from the
  top of any page, the logo pulses/scales as you pull (not a 360° spin -
  it's a wide wordmark, spinning text looks wrong), release past threshold
  and it reloads the page. App-only, same scoping as the splash.

**Offline screen**
- `src/components/providers/offline-screen.tsx` - new. Dark full-screen
  state, brand blue accent, "PlaceIT" copy, Retry button. App-only.

**Zoom lock + text-selection lock**
- `src/app/layout.tsx` - added a `viewport` export (`maximumScale: 1`,
  `userScalable: false`, safe-area support)
- `src/app/globals.css` - added: overscroll containment (no pull-to-refresh
  bounce), tap-highlight removal, safe-area padding, and a `.is-native-app`
  scoped rule that disables text selection everywhere except real
  `input`/`textarea`/`contenteditable` elements. This is **native-app-only**
  (not installed PWA) - matches what you asked for originally.
- `src/components/providers/native-app-detector.tsx` - new. Adds the
  `.is-native-app` class on mount when running in Capacitor, and registers
  the service worker in production.
- `src/lib/is-installed-app.ts` - new. Shared detection helpers
  (`isInstalledApp()` = native app or installed PWA, `isNativeApp()` =
  native app only) used by the splash/pull-to-refresh/offline-screen/
  text-select logic above.

## 2. placeit-mobile/ (new folder)

Capacitor Android project wrapping `https://www.getplaceit.com` live.
Package id `com.wyntek.placeit`. Icons/splash generated from the "PlaceIT"
wordmark. `MainActivity.java` patched to disable native WebView pinch/
double-tap zoom (the web-side viewport meta doesn't always override
Android's own WebView zoom controls). Full build/publish steps in its own
README.

## Verified

Ran a real `npm run build` against this repo and got a clean exit before
packaging - all routes compiled, `manifest.webmanifest` generated, no
errors introduced by any of the above. Two things had to be stubbed to get
a build running in this sandbox specifically (network restrictions here,
not bugs):
- Google Fonts fetch (`fonts.googleapis.com` isn't reachable in this
  sandbox) - reverted immediately after testing, real font imports are
  back in the delivered code
- Backend/env vars (`NEXT_PUBLIC_APP_BACKEND_API_URL`,
  `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_NAME`,
  `NEXT_PUBLIC_APP_SITE_URL`) - this repo hard-throws during build if any
  of these are missing (see `src/utils/index.ts`). Worth confirming all
  four are set on Vercel, not just the backend URL - I only knew about the
  backend one going in.

## Known limitation - launcher icon

No clean square icon-only mark exists in the source assets - the little
person/circle graphic in `logo.svg` is actually a low-res embedded raster,
not vector (same root asset as the old blurry icon set). The Android
launcher icon was generated from the full wordmark centered on a square
instead, which works but isn't ideal (launcher icons are usually icon-only
for legibility at small sizes). Splash and any large in-app use of the logo
are fine - only the tiny-scale launcher icon case is affected. See
`placeit-mobile/README.md` for how to swap in a proper mark later.

## Before you deploy

- Confirm `com.wyntek.placeit` in `placeit-mobile/capacitor.config.json` -
  permanent once published to either store.
- Deploy the updated `i-tapp-client-main` to production first so the
  manifest + service worker are live before running PWABuilder.
