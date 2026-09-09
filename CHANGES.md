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

---

# What changed (session 4 - native features)

All four items from the shortlist, built on the session-3 switchboard. Every
new behaviour has an entry in `src/config/app-features.ts`.

## 1. Detection fix (the important one)

The shell loads getplaceit.com remotely, so `window.Capacitor` is injected
into a page Capacitor doesn't serve and may not exist when the boot script
runs. A bare Android WebView also doesn't report `display-mode: standalone`,
so there was no fallback - the store build could have classified itself as a
browser and silently disabled every app feature.

- `appendUserAgent: "PlaceItApp/1"` in `capacitor.config.json`
- `NATIVE_UA_MARKER` checked first in both `app-mode.ts` and the boot script

New `src/lib/capacitor-bridge.ts`: typed, dependency-free access to
`window.Capacitor.Plugins.*`. The Next app installs no `@capacitor/*`
packages. `hasBridge()` is what plugin callers check (the UA can say "native"
before the bridge lands); `whenBridgeReady()` polls briefly for the gap.

## 2. Android hardware back button (native)

`back-button-handler.tsx`. Priority order: close an open Radix overlay via a
synthetic Escape → close the custom sidenav/mobile-nav via their existing
window events → `router.back()` → at a root route, press-back-twice-to-exit
with a toast. Previously back exited the app from any screen.

## 3. Haptics (app)

`src/lib/haptics.ts` - Capacitor Haptics on native, Vibration API fallback in
an installed PWA, no-op in a browser and on iOS Safari. Wired to the
pull-to-refresh arm/trigger points and tab bar taps.

## 4. Pull-to-refresh now refetches instead of reloading

Was `window.location.reload()`: re-downloaded the bundle, flashed white, lost
scroll position, cleared every client cache. Now `router.refresh()` plus
`queryClient.invalidateQueries({ refetchType: "active" })`, with a 450ms
minimum on the indicator so a cached refetch doesn't read as a flicker.

Required hoisting the `QueryClient` out of `ReactQueryProvider`'s `useState`
into `src/lib/query-client.ts` so non-React code can reach the same instance.
`gcTime` raised to 24h - the offline cache is worthless if entries are
collected before a cold start.

## 5. Bottom tab bar (app, mobile widths)

`components/layouts/protected/app-tab-bar.tsx`, mounted in all three role
layouts inside `<AppOnly>`. Per-role tabs, `lucide-react` icons (iconsax's
export names couldn't be verified without node_modules), 56px targets, hidden
at `lg` and while the keyboard is open. Body padding is handled in CSS via
`--app-tabbar-height` so list ends don't sit behind it. Header and sidenav
are untouched.

## 6. Keyboard handling (app)

`Keyboard` plugin with `resize: "body"`, plus `keyboard-handler.tsx` for the
two things resize alone doesn't cover: publishing `--keyboard-height` so
fixed UI moves out of the way, and scrolling the focused field into view.
Installed PWAs get a `visualViewport` version of the same thing.

## 7. Offline cache (app)

`src/lib/query-persist.ts` - built on React Query's own `dehydrate`/`hydrate`,
so **no new dependencies and no lockfile change**. Debounced writes, flush on
backgrounding, 24h expiry, keyed to `NEXT_PUBLIC_BUILD_ID`.

The offline screen now has two forms: a slim bar when there's cached data
behind it, the full-screen takeover only when there genuinely isn't. It also
stopped trusting `navigator.onLine`, which reports true on captive portals -
it now confirms with a real HEAD request.

**Privacy:** this writes API responses to localStorage in plaintext.
Mitigated by a `DO_NOT_PERSIST` key denylist and `clearPersistedCache()` in
`useLogout`. Read the "Offline cache" section of `APP-VS-BROWSER.md` before
shipping, and set `NEXT_PUBLIC_BUILD_ID` in your build.

## Also spotted (not fixed)

`companyNavLinks` in `src/constants/index.ts` points at
`/portal/space/add-new-space` and `/portal/candidates/accepted`. Neither route
exists. Predates this work; left alone because the fix is a product decision.

## Verified

Same caveat as session 3: `npm install` will not complete in this sandbox, so
there is **no full `npm run build`**. Every new and modified file was
type-checked in isolation under `--strict` with TypeScript 5.9 and is clean
apart from expected unresolved-import noise. Run a real build, and test on a
device - the back button, haptics and keyboard paths cannot be exercised in a
desktop browser even with `?appmode=1`.

After pulling: `cd placeit-mobile && npm install && npx cap sync android`.

---

# What changed (session 5 - dark mode + reader docs)

## Dark mode

`darkMode` scope: `app`. Light / dark / follow-system.

**Why not next-themes** (it's already in package.json): it injects its own
pre-paint script, and we already have one that must run first and decides
whether dark mode is available at all. Two racing pre-paint scripts means one
loses and you get a flash. `theme-provider.tsx` is ~110 lines and hooks into
the boot script we already own. next-themes stays installed because
`ui/sonner.tsx` imported it - that import now points at our provider, which
also fixes a live bug: no next-themes provider was ever mounted, so sonner had
been silently falling back to "system" forever.

**How the palette flips without touching 155 files.** Tailwind v4 compiles
every colour utility to `var(--color-*)`. So `.dark` in globals.css redefines
those variables instead of adding a `dark:` variant to ~1,700 utilities. The
neutral ramp is inverted - gray-50 becomes the darkest surface, gray-900
becomes near-white - so existing `bg-gray-50 text-gray-800` pairs keep their
contrast rather than going dark-on-dark. Pale status tints (red-50, green-50
and friends) are darkened too, or every subtle chip becomes a floodlight.

**Not covered:** the 57 arbitrary values like `bg-[#F0F0F5]`. Those never
touch a variable. Shell ones are converted (portal backgrounds, tab bar,
headers, splash); page-level ones aren't. Combined with the marketing site's
hand-picked colours, that's why the scope is `app` rather than `all`.

Also done:
- Theme resolved in the same boot-script pass as the mode, so a dark cold
  start never flashes light. `<html suppressHydrationWarning>` added.
- Native status bar style + colour follow the theme (`getStatusBarPlugin()`,
  already sitting unused in the bridge helper). Note the inversion: the
  plugin's "style" is the *content* colour, so a dark UI needs LIGHT.
- `<meta name="theme-color">` updated at runtime.
- `ThemedToastContainer` - react-toastify was mounted OUTSIDE AppProvider, so
  it would have read the default light context. Moved inside ThemeProvider.
- `<ThemeToggle />` (three-way segmented) and `<ThemeToggleButton />` (single
  cycling button). The button is mounted in both portal headers inside
  `<AppOnly>`.

## Docs

`PLACEIT-APP-UPDATE.html` - a client-facing progress summary, styled to match
the site (Montserrat/Open Sans, #477dc0, the site's card treatments).
Self-contained single file, own dark mode toggle, print stylesheet included.

Written for the client, not for developers: no file paths, no library names,
no implementation detail. Structured as what changed for users, why the
website was deliberately left alone, what needs sign-off before launch, a
recommended roadmap, and what's needed from them.

`APP-VS-BROWSER.md` remains the developer reference and points at the client
doc.

## Verified

Same caveat: no full `npm run build` (npm won't install here). All modified
files type-checked in isolation under `--strict`, clean. The HTML was parsed
for tag balance. Dark mode needs a real visual pass on a device - a palette
remap gets you a correct base, not a finished design.

---

# What changed (session 6 - dark mode fix)

## The bug

The screenshots were all **marketing pages**: homepage testimonials,
who-is-it-for cards, stats band, the NYSC landing hero. Not the portal.

Scoping dark mode by *runtime* was the mistake. Installing the PWA drops the
user on the marketing homepage, so "app mode" was true there, and the dark
palette got painted onto pages that were never built for one.

The specific failure: those pages set backgrounds by hand - arbitrary
`bg-[#f0f3ff]`, inline `style={{ background: slide.bg }}`, gradient stops.
None of those touch a CSS variable, so they stayed light. The `text-gray-900`
sitting on top of them DID flip, to near-white. White text on a mint
background. That's "Before Camp Ends" and the "Real Stories" heading being
invisible, and the washed-out corps/company cards.

The remap was doing exactly what it was built to do. It was pointed at the
wrong pages.

## The fix

**The theme now follows the surface, not the runtime.** A page only goes dark
if its colours come from tokens.

- `THEMEABLE_ROUTE_PREFIXES` in `src/lib/theme.ts` - currently `/portal` only.
- `applyTheme(theme, active)` takes an active flag; `ThemeProvider` watches
  `usePathname()` and repaints on navigation.
- The boot script has the same route check, so there's still no flash.
- The preference is still remembered outside the portal, just not painted.

Marketing, auth and public pages are light regardless of the setting. All four
screenshots are fixed by this alone.

## Also fixed

Portal surfaces that had the same latent problem:
- `bg-[#f5f5f5]` (opportunity cards), `bg-[#F9FBFF]` (sort, application
  search x2), `bg-gray-200 text-[#333]` (company onboarding facts) -> tokens.
- `border-[#C9C9DA]` and `text-[#3D3C42]` -> `border-border`, `text-foreground`.
- **The logo was invisible on the dark portal header** (dark navy wordmark on
  a dark surface). `dark:brightness-0 dark:invert` as a stopgap - a real
  light-on-dark asset would be better.

The portal now has zero hardcoded colour values.

## New: `.theme-light` escape hatch

Wrap any subtree that must keep its light design inside a dark screen - brand
banner, illustration with a baked background, embed - and the light palette is
restored for that subtree only.

## Rule for anyone widening the scope later

Before adding a route prefix, grep that area for `-[#`, inline `style`
colours and gradient stops. If it has them, it needs a hand pass or a
`.theme-light` wrapper first. This is now written into globals.css and
APP-VS-BROWSER.md at the point where someone would make the change.

## Known rough edge

Logging out goes to `/signin`, outside the themeable set, so the app flips to
light at that moment. Fixable by designing dark auth screens, or by adding
`/signin` to the prefix list once they've been checked.

## Docs

Client HTML updated: dark mode is now described as covering the signed-in
area, and the roadmap item for public pages says plainly that it needs design
input rather than just development time.

---

# What changed (session 7 - the toggle was unreachable)

## Why it wasn't there

Two reasons, both mine.

**It was inside the avatar popover, in a `hidden md:flex` container.** The
portal header's actions row is desktop-only; on a phone only the hamburger
shows. So on the device these screenshots came from, the toggle did not exist.

**The `darkMode` scope was `app`.** Route scoping (session 6) is what actually
protects the marketing pages, so the runtime gate was buying nothing - but it
was hiding the toggle from anyone testing the portal in a normal browser tab.

## Fixed

- `darkMode` scope is now `all`. Protection is entirely by route.
- `<ThemeToggleButton />` promoted to a first-class header control, rendered
  at every breakpoint (next to the hamburger on mobile, next to notifications
  on desktop). No longer buried in a popover.
- `<ThemeToggle />` (three-way: Light / Dark / Auto) added to the mobile nav
  sheet under an "Appearance" heading.
- Company portal header toggle unwrapped from `<AppOnly>`.

## Also

The mobile nav sheet had its own hardcoded light surfaces, which would have
been a white sheet sliding over a dark app: `bg-white` -> `bg-background`,
`bg-gray-50` -> `bg-muted`, `hover:bg-gray-100` -> `hover:bg-muted`, bare
`border` -> `border-border`.

Dark mode now also works in the portal on desktop web, not just in the app.
