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

---

# What changed (session 8 - accent tints)

Auditing why the marketing site can't go dark turned up a live bug in the
portal: the dark palette only covered red/green/blue/yellow/amber at 50/100.
The portal uses 170+ tint utilities across emerald, violet, purple, orange,
indigo, sky and the 200 steps - none of which were overridden, so every one of
those chips and callouts was still rendering near-white on the dark UI.

Now covers 17 hue families at 50/100/200 (surfaces) and 600/700 (accent text
lifted so it stays legible on those surfaces). 400/500 left alone - they're
solid fills that already carry white text.

Marketing site still out of scope. See the note in APP-VS-BROWSER.md.

---

# What changed (session 9 - dark mode across the marketing site)

The public pages turned out to be far more mechanical than the first look
suggested. Each one drove ALL of its colour from a single module-level
constant - `const green = "#059669"` in nysc, `violet` in companies, `blue` in
students - and the hero's three slides did the same through a data object.
83 usages, but only 6 source values.

## What was converted

- **`--accent-blue` / `--accent-green` / `--accent-violet`** plus matching
  `-rgb` triples, with lifted values under `.dark` (the originals fail
  contrast on `#12161c`). The persona colour-coding survives the theme.
- **`--surface-*`** for the opaque tinted section backgrounds:
  `bg-[#f7f8fc]`, `bg-[#f0fdf4]`, `bg-[#faf5ff]`, `bg-[#f0f3ff]`,
  `bg-[#f0f2f5]`, `bg-[#faf8ff99]`.
- **Hex-alpha concatenation rewritten.** `${green}18` can't work once `green`
  is a `var()`, so all 19 became `rgba(${greenRgb}, 0.09)` etc. That's what
  the `-rgb` twins are for.
- **hero.tsx** slide data onto variables; `StudentVisual`/`CorpsVisual`/
  `CompanyVisual` now take `accentRgb` alongside `accent` for the same reason.
- **Toggle added to the public header** (desktop and mobile) and an
  "Appearance" section in the public mobile menu.
- `THEMEABLE_ROUTE_PREFIXES` widened to `["/"]`.

## Two bugs found on the way

**`text-white` was broken app-wide.** Remapping `--white` to fix ~600
`bg-white` cards also caught 187 `text-white`, 44 `bg-white/N` and 26
`border-white` - every white label on a coloured button had turned dark.
Fixed by rebinding the variable back to real white on those elements, which
preserves each utility's own alpha (`text-white/80` stays 80%). Checked first
that no element combines solid `bg-white` with `text-white`; the 6 overlaps
are all translucent.

`--white` is now the CARD colour rather than the page background, so
`bg-white` cards sit above the page instead of vanishing into it.

**The site logo had `mix-blend-multiply`**, which renders as solid black on a
dark header. Now `dark:mix-blend-normal`.

## Left light on purpose

The WhatsApp mockup's outgoing bubble (`#dcf8c6`) and the WhatsApp brand
green - that block is a replica of someone else's UI. Its text is pinned dark
so it stays readable against the fixed green.

## Verified

Type-checked clean. CSS hex validated. No `npm run build` (npm still won't
install here), and dark mode across ~48 site files has not been seen rendered
- that review is yours. The homepage hero and the three persona landing pages
are where to look first.

---

# What changed (session 10 - fill colours vs type colours)

Everything wrong in the latest screenshots came from one mistake: a single
variable was doing two incompatible jobs.

A brand colour used as a SOLID FILL under white text has to stay dark enough
for that text to read. The same colour used as TYPE on the page has to be
light enough to read against the background. In light mode one value does
both. In dark mode it can't, and I'd lifted everything for the type case -
which is why "Get Started Free" was white on pastel and the stats band was a
bright blue slab.

## The split

- `--primary` in dark is now **deepened** to `#3d6ca8`, not lifted. White text
  on it is ~4.9:1, and a full-bleed band recedes instead of glowing.
  `--primary-foreground` back to white.
- `--accent-blue/green/violet` keep their brand value in dark - they're CTA
  fills. New `--accent-*-text` variants lift, and every `color:` usage now
  points at those. The `-rgb` triples stay at brand value since they only
  feed low-alpha washes where hue is all that matters.
- A rebinding rule lifts `text-primary` / `border-primary` / `ring-primary`
  on the element, excluding `text-primary-foreground`. Same technique as the
  white utilities.

## Light-on-light elements

`bg-white/70` got forced back to real white by the foreground rule, but the
text on it kept inverting. Those are surfaces, not glows, so they now use
surface tokens:

- Hero secondary CTA ("Browse Opportunities") - was invisible.
- Inactive persona pills ("Corps Member", "Company") - were invisible.
- Opportunity detail modal close button.

## Not in dark mode at all

- **Sticky mobile CTA bar** - a white bar pinned over a dark page.
  `bg-white/95` -> `bg-background/95`.
- **Stats band wave SVG** - hardcoded `text-[#f7f8fc]` to match the section
  below it. Now tracks `--surface-blue`, so it follows.

## Verified

Type-checked clean. Still no `npm run build`. The hero, the persona tabs and
the stats band are the three to re-check on device.

---

# What changed (session 11 - the two pages the sweep missed)

Two screenshots, two halves of the same mistake. The inversion trick only
works on colours that mean something to the theme. Anywhere a colour is a
literal design decision, it sits still while the utilities on top of it move.

## `/get-started` - never converted

It lives outside `(site)`, so session 9's sweep didn't reach it, and it drives
its entire design from a raw `<style>` block: `#F8F9FC` page, `#fff` cards,
`#E5E8EF` borders, three pastel role accents. None of that flips. The
`text-gray-900` on top does. The tell is the `?` in "Who are you?" - it's
`text-gray-300`, which inverts to near-black, so it rendered solid while the
heading beside it washed out.

Converted the same way as the site pages: surfaces onto `--card` / `--border`
/ `--surface-blue`, and the three roles onto the existing persona tokens -
they ARE the same three personas, student blue / corps green / company violet.

- Fills use `--accent-*`, type uses `--accent-*-text`. Same split as session 10.
- Tints are `rgba(var(--*-rgb), a)` washes, not pastel hexes. A wash works on a
  white card and a dark one; `#EFF6FF` only works on the first.
- `role.color + "30"` for the hover shadow had to become a pre-mixed rgba.
  Hex-alpha concatenation can't survive the value becoming a `var()` - the same
  trap as the 19 usages in session 9.
- Body copy `gray-400` -> `gray-500`. The ramp is mirrored, so 400 was landing
  around 2.5:1 on the card in BOTH themes. That one was never dark-only.

**The missing logo** is the same bug one layer up. `Logo` carries
`dark:brightness-0 dark:invert`, so it goes white; the header was
`bg-white/80`, which the foreground rule pins to real white. White on white.
Header is `bg-background/80` now. The comment in `logo.tsx` still claimed the
dark class was portal-only - it hasn't been since `THEMEABLE_ROUTE_PREFIXES`
widened to `["/"]`, and that stale assumption is what let this ship.

## Dark islands - the inverse case

A panel that is deliberately DARK in light mode inverts into a near-white slab
while its `text-white` stays white. Screenshot 2 is the homepage BulkApply
panel doing exactly that. Its paragraph read fine, which is the fingerprint:
`text-gray-400` inverted to a dark grey and stayed legible on the flipped
background.

## New: `.theme-static`

`.theme-light` already restored the light palette for a subtree, but the name
only describes half the job and nobody would think to put it on a near-black
CTA panel. `.theme-static` is the same restore under a name that fits: these
colours are literal design values, don't re-map them.

Both were also missing `--color-gray-950` and the whole slate ramp, so
`.theme-light` couldn't have fixed these even if you'd reached for it.
`color-scheme: light` stays on `.theme-light` only - a pinned-dark panel is
still on a dark page.

Applied to four places:

- homepage BulkApply panel (screenshot 2)
- the matching spotlight band on `/nysc` - identical bug, not yet reported
- the mock browser chrome in `for-companies` - reads as a title bar only while
  it's dark
- the portrait scrim in `about-us/team` - inverted, a darkening pass becomes a
  40% white wash that fogs the photos

## Verified

Type-checked: 36 errors remain, all `TS7016`/`TS7006` cascading from `zustand`
and `vaul` declarations missing in a partial install (npm's `@sentry/cli`
postinstall can't reach its CDN here; `--ignore-scripts` gets you a tree).
None in any touched file. Still no `npm run build`.

Not seen rendered. `/get-started` in dark and the `/nysc` spotlight band are
the two to look at - the second is a fix for a bug nobody has screenshotted
yet, so it's the more likely of the two to be wrong.

---

# What changed (session 12 - audit for the same bug class)

Swept the whole of `src` for every way a colour can sit still while the
utilities on top of it move. Four patterns, 19 files. The biggest find is not
on the marketing site.

## `bg-black` scrims - 17 of them, all inverted

`--black` is remapped to `#e9edf2` so `text-black` becomes light type. That is
right. It also catches every `bg-black/N` OVERLAY: the dialog, drawer, sheet
and alert-dialog backdrops, the mobile sidebar and filter-panel scrims, both
avatar-crop overlays, the admin student drawer.

A backdrop is a darkening pass by definition. Inverted, `bg-black/80` is a
near-opaque WHITE sheet over the app - so in dark mode every modal in the
portal and the admin area dropped a white curtain behind itself.

This is session 9's `text-white` bug in the other direction, and it takes the
same fix: rebind `--black` to real black on the surface utilities, leaving
`text-black` alone because that one should invert. Checked first that no
element combines a black surface with `text-black`, and that no `text-black`
element sits inside one of the three overlays that wrap content rather than
sitting empty.

**Also found while there:** `components/ui/modal.tsx`, the company signup
success modal and the admin student drawer still use `bg-opacity-50`, which
Tailwind v4 removed. Those backdrops have been fully opaque black in BOTH
themes since the v4 upgrade - nothing to do with dark mode. Converted to
slash-alpha.

## Dark islands the first pass missed - 4

Three tooltips (`bg-gray-900 text-white`) in the admin side-nav and two
find-it-space panels, plus the offer banner scrim (`from-gray-900/60`). Same
`theme-static` treatment. The tooltips were the worst of these: white text on
a near-white bubble, so hovering produced a blank rectangle.

## Light-on-light - 2

- `about-us/details.tsx` - the "CAC Verified Platform" badge over the team
  photo is `bg-white/95`, pinned to real white, with `text-gray-900` on it
  that inverts to near-white. Invisible. Now `bg-background/95`, the same fix
  session 10 applied to the sticky mobile CTA bar.
- `opportunities/_molecules/index.tsx` - `border-[#F5F5F5]` row divider, a
  near-white hairline on a dark card. Now `border-border`.

## Textures and blend modes - 6

- `Logo` still had a bare `mix-blend-multiply` in the student and corps
  onboarding screens. Session 9 fixed the site header and missed these two,
  which are in the portal - where dark mode has been live longest. Multiply
  against a dark panel renders the wordmark as a solid black block.
- Two dot-grid backdrops with baked colours: `#e5e7eb` on the notifications
  page (a field of bright specks on a dark background) and `#000` on the
  opportunity detail hero (texture disappears entirely). Now `var(--border)`
  and `currentColor`.
- `app/demo/tour` hardcoded `bg-[#F0F0F5]` on three full-screen containers.
  Not linked from anywhere, but it's inside the `["/"]` scope, so it would
  have washed out exactly like `/get-started`. Now `--surface-neutral`.

## Looked at and left alone

- `footer.tsx` `bg-[#0d1117] text-white`. An arbitrary hex is a literal, so it
  does not invert - the footer is correctly dark in both themes already.
- The WhatsApp mockup. Still deliberately pinned, per session 9.
- `marquee.tsx` `from-white` edge fades. Its container is `bg-white`, so
  fade and background remap together and stay matched.
- `offline-screen.tsx` `stroke="#477dc0"` and the recharts `fill="#6366f1"`.
  Brand-value graphics, legible on both backgrounds.

## Verified

Type-checked: 36 errors, unchanged from before this pass and all
`TS7016`/`TS7006` from `zustand`/`vaul` declarations missing in a partial
install. None in any touched file. CSS braces and comments balanced. Still no
`npm run build`.

Not seen rendered. Open any modal in the portal in dark mode first - that is
the fix with the widest blast radius and the easiest to confirm.

---

# What changed (session 13 - signup success modal + required-field errors)

## Welcome modal

All three signups fired a toast and redirected in the same tick, so the
confirmation was gone before it registered. Now each one flips a `showSuccess`
flag and `SignupSuccessModal` does the rest.

`src/components/signup-success-modal.tsx` - shared by all three. Holds for 3s
with a filling progress bar, then `router.replace`s to the login page.

**The redirect had to move INTO the modal.** Leaving `router.replace` in
`onSuccess` alongside the modal changes the route immediately and unmounts the
modal before it can be read - the exact behaviour being replaced. Each form's
`onSuccess` is now just `setShowSuccess(true)`, which made the local `router`
dead in all three files; removed, along with the success toasts (the modal
carries that message now). Error toasts stay.

Copy differs per category because the flows do:

- student - account created, kindly log in -> `/signin`
- corps - account created, verify your email, then log in -> `/signin`
- company - account created, kindly log in -> `/company/signin`

**Open question on the company wording.** The orphaned modal this replaces said
company accounts go for manual review and get activated later. Nothing on the
client confirms that - `companySignup` just POSTs to `/auth/signup/company` and
the old code redirected straight to `/company/signin`, implying immediate
login. I used the neutral "kindly log in" for now. If the backend really does
gate companies behind approval, that one string needs changing.

Deleted `app/(auth)/company/signup/_molecules/success.tsx` - a half-built
version of this modal, imported nowhere (only inside commented-out lines in
`company-info-2.tsx`).

## Required-field errors

The reported symptom was "no error message". The actual cause was the submit
button:

```
company-info-1  disabled={!form.formState.isValid || isExecuting}
corps/index     disabled={!form.formState.isValid || isExecuting}
signup-info     disabled={!isDirty || !isValid}
school-info     disabled={!isValid || !isDirty || isExecuting}
```

A disabled button cannot fire submit, and react-hook-form only shows a field's
error once that field has been touched. Skip a box entirely and it is never
touched, so there is no message AND no working button - nothing to tell you
why. Buttons are now `disabled={isExecuting}` only. Clicking runs
`handleSubmit`, which validates every field at once and renders each message.
Submission is still blocked while invalid - that is react-hook-form's own
behaviour, not something added.

**Schemas** (`schemas/auth.schema.ts`) - every required field now leads with
`.min(1, REQUIRED)`, so an empty box always reads "This is a required field".
Format rules sit after it and keep their specific messages for a box that has
been filled in wrongly. Verified both directions:

```
empty        -> email/phone/firstName/lastName/password: This is a required field
filled wrong -> Please enter a valid email address / Phone number is too short
                / Password must be at least 6 characters
```

`z.email()` had to become `z.string().min(1, REQUIRED).pipe(z.email(...))`.
Called directly on `""` it reports a format error, which is the wrong thing to
say about a box nobody filled. Two fields were also falling back to Zod's raw
"Too small: expected string to have >=1 characters" - `school` (an unselected
dropdown) and student `confirmPassword`.

**`src/components/form-error-summary.tsx`** - new. On a failed submit it names
the fields needing attention above the form. Per-field messages alone are easy
to miss when the first error is below the fold; react-hook-form's
focus-first-error only helps if you notice the focus move. Takes a `labels`
map so it reads "Company Name" rather than the schema's `name`.

## Verified

Type-checked: 36 errors, unchanged and all pre-existing `zustand`/`vaul`
declaration noise. None in any touched file. Schema messages exercised
directly against Zod for empty / malformed / valid input.

Not seen rendered - no `npm run build`. Worth checking the 3s hold feels right
on a real connection, and that the student modal sits correctly since that form
is inside the multi-step wizard rather than a page of its own.

---

# Session 3 — the three outstanding items

The three things on the "What's Been Built" list: links that open the app,
camera upload for CVs and documents, and the "Get the app" prompt for
website visitors. All three were already sketched in `APP-VS-BROWSER.md`
under "Not done yet", so the intended shape was mostly settled — the
`installBanner` feature key and its `<BrowserOnly>` wrapper had been sitting
in the registry waiting for a component since the app/browser split went in.

Verified with a real `npm run build`: compiled clean, TypeScript clean, all
71 routes generated. (Google Fonts is unreachable from this sandbox, so the
two `next/font/google` calls were temporarily stubbed to let the build run
and then reverted — `git diff` on `layout.tsx`, `types/index.ts` and
`utils/fonts.ts` should be empty.)

## 1. Links that open the app

Tapping a verification or password-reset link from an email opened Chrome,
even on a phone with PlaceIT installed and signed in. Two sessions, two
cookie jars, and a verification that appears not to have worked.

Four pieces, all four required:

- **`AndroidManifest.xml`** — an `autoVerify` intent filter for
  `https://www.getplaceit.com/account/*`, plus an unverified `placeit://`
  scheme as a fallback and test hook.
- **`src/app/.well-known/assetlinks.json/route.ts`** — the Digital Asset
  Links file Android fetches to confirm the domain vouches for the app.
- **`src/lib/deep-links.ts`** — turns an incoming URL into an in-app path,
  against an allowlist.
- **`src/components/providers/deep-link-handler.tsx`** — listens for the
  link and navigates the existing webview to it.

**One thing is needed from you before this works.** Set
`ANDROID_APP_FINGERPRINTS` in the deployment environment to the SHA-256
fingerprint of the app signing key — Play Console → Release → Setup → App
signing. It has to be the *app signing* key, not the upload key: Play
re-signs your upload, so the upload key's fingerprint isn't what ends up on
the device. Comma-separate to include your debug key as well.

Until it's set, that route returns 404 on purpose. A file containing a
placeholder would be worse than a missing one, because Android caches a
verification *failure* and retries on its own schedule — you'd be debugging
a response that had already poisoned itself.

**Why only `www.getplaceit.com` and not the apex.** App Links verification
is all-or-nothing across every host declared in one filter, and the file
must be served with no redirect. If `getplaceit.com` 301s to `www` — the
usual setup — including it would fail verification for `www` too, and the
whole feature would silently do nothing. The apex can be added once it's
confirmed to serve the file directly.

**Why only `/account` and not the whole domain.** That's where the emailed
links land. Claiming every URL would pull shared links, marketing pages and
Google results into the app, which is a product decision nobody has made.
It's also a security boundary: any installed app can fire a `placeit://`
link at us, and that scheme has no domain verification behind it, so an
unbounded list would let a hostile app drop someone on an arbitrary screen
of a logged-in session.

One nicety: on a cold start the shell has already begun loading the homepage
by the time we redirect. Rather than fight it, the existing 1.7s splash
covers it — what you see is splash, then the verification screen, never a
flash of the homepage.

## 2. Camera upload for CVs and documents

Cheaper than expected: all eight upload fields — student IT letter and CV,
corps call-up / CV / relocation letters, company logo and banner, and the
offer attachment — already go through one shared component
(`src/components/file-upload-thing.tsx`). Adding the camera there covers
every one of them.

Two implementations of the same button, picked at runtime. The native shell
uses the Capacitor Camera plugin; a phone browser or installed PWA uses
`<input type="file" capture="environment">`, which opens the camera on
Android and iOS. The native path isn't redundant: the shell loads
getplaceit.com remotely, so a page-driven camera input there depends on the
WebView's file-chooser and permission delegation, and the plugin is the
route that reliably works.

The button is hidden on desktop, where `capture` is ignored and it would
just be a second, identical file dialog.

Details that matter in practice:

- **Photos come out of the plugin as JPEG at quality 80, max 1600px** —
  200-600KB for a photographed A4 page, comfortably inside the existing
  10MB limit, and still legible enough to read a CV off.
- **`correctOrientation` is on.** Phones record rotation in EXIF rather than
  rotating the pixels, so without it a portrait photo of an IT letter
  arrives sideways and whoever opens it has to tilt their head.
- **Photos aren't saved to the camera roll.** Nobody wants their IT letter
  in their gallery.
- **Camera files get renamed.** They arrive as "image.jpg" or with no name
  at all, which is unhelpful next to three other uploads in the same form.
- **There's now a preview and a Remove/Retake control**, because the first
  thing anyone does after photographing a document is check it's readable.

The component's `onChange` widened to accept `undefined` so the field can be
cleared. Every existing call site passes react-hook-form's `field.onChange`,
which already accepts anything, so nothing else changed.

**Run `cap sync` in `placeit-mobile/`** after pulling — `@capacitor/camera`
is new in its `package.json` and won't reach the bridge until you do.
Without it nothing breaks; the camera button just won't appear in the native
build and the file picker carries on as before.

## 3. "Get the app" prompt for website visitors

`src/components/get-the-app-banner.tsx`. A compact bar at the bottom of the
screen on phones, on the website only — the feature registry already scoped
it that way, so it can't appear inside the app itself.

Chrome and Safari share no common ground here, so there are two paths.
Chrome on Android fires an event we can capture and replay from our own
button, which gives a real one-tap install (and suppresses Chrome's own
mini-infobar so there aren't two prompts competing). iOS Safari has no
programmatic install at all, so there the button expands a short "tap Share,
then Add to Home Screen" instruction instead. Chrome and Firefox on iOS are
deliberately excluded — they're Safari underneath but can't install at all,
so those instructions would be wrong.

**Optional, for later:** set `NEXT_PUBLIC_ANDROID_STORE_URL` once the Play
listing is live and Android visitors get sent there instead. A store install
is the better outcome — it's the build that actually gets the native
features. Leaving it unset is fine; the banner falls back to the PWA install
prompt, so there's no dead link in the meantime.

Behaviour is deliberately restrained: it waits 4 seconds before appearing
(asking someone to install before they've read anything is how banners get
reflexively dismissed), a dismissal is remembered for 14 days, and
installing by any route — including Chrome's own menu — stops it for good.
The page also gains padding while it's showing, so it never covers the last
field of a form.

## Second broken link spotted

Same category as the `companyNavLinks` note from last session, so flagging
rather than fixing. `src/app/(auth)/account/verify/index.tsx` links twice to
`/resend-verification`, but the route is `/account/resend-verification` —
both 404 today. It's the page someone lands on when a verification link has
expired, which is now also where a deep link lands, so it's worth a minute.
