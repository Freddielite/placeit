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
