// ---------------------------------------------------------------------------
// THE SWITCHBOARD
//
// One place that decides which "feels like an app" features are on in which
// runtime. Flip a value here and the whole app follows - no hunting through
// components. See src/lib/app-mode.ts for how the mode itself is detected.
//
//   app     - native Capacitor shell AND installed PWA
//   browser - normal browser tab (the public website)
//   all     - everywhere
//   native  - the compiled store build only, never the installed PWA
//   off     - disabled everywhere
// ---------------------------------------------------------------------------

import type { AppMode } from "@/lib/app-mode";

export type FeatureScope = "all" | "app" | "native" | "browser" | "off";

export const APP_FEATURES = {
  /** Custom drag-down-to-reload gesture with the logo indicator. */
  pullToRefresh: "app",

  /** Animated fade+scale crossfade between routes. */
  pageTransitions: "app",

  /** Branded splash overlay on cold start. */
  splashScreen: "app",

  /** Full-screen "you're offline" takeover with a Retry button. */
  offlineScreen: "app",

  /** Long-press text selection disabled outside inputs. */
  textSelectionLock: "app",

  /** Suppress the browser's own overscroll bounce / native pull-to-refresh. */
  overscrollLock: "app",

  /** Block pinch-zoom (an a11y regression on the web - keep it off there). */
  disableZoom: "app",

  /** Kill the grey tap flash on links and buttons. */
  noTapHighlight: "app",

  /** Pad content past notches / home indicator via env(safe-area-inset-*). */
  safeAreaInsets: "app",

  /** Android hardware back button -> in-app navigation instead of exit. */
  hardwareBackButton: "native",

  /**
   * App Links / custom-scheme URLs routed to an in-app screen instead of
   * the browser - verification and password-reset emails, mainly.
   *
   * Native only, and not because a PWA doesn't deserve it: Chrome already
   * routes in-scope links into an installed PWA itself, so there is nothing
   * for us to do there. Only the wrapped shell has to be told, via the
   * Capacitor App plugin. See src/lib/deep-links.ts.
   */
  deepLinks: "native",

  /**
   * "Take photo" alongside "choose file" on document uploads.
   *
   * Scope is "all" because the meaningful gate is the DEVICE, not the
   * runtime - the same reasoning as darkMode being route-gated. A phone
   * browser can open the camera through <input capture> perfectly well and
   * photographing an IT letter is just as useful on the website; a desktop
   * has nothing to point at a document. canOfferCamera() in src/lib/camera.ts
   * makes that call at runtime. Set this to "app" to restrict it to the
   * installed app, or "off" to go back to file-picker-only everywhere.
   */
  cameraCapture: "all",

  /** Vibration feedback on refresh, tab taps, form results. */
  haptics: "app",

  /** Soft-keyboard avoidance: --keyboard-height, focused-field scroll. */
  keyboardHandling: "app",

  /** Fixed bottom tab bar in the portal (mobile widths only). */
  bottomTabBar: "app",

  /** Persist the React Query cache so last-seen data survives going offline. */
  offlineCache: "app",

  /**
   * Light / dark / follow-system.
   *
   * Scope is "all" because the meaningful gate is by ROUTE, not runtime:
   * THEMEABLE_ROUTE_PREFIXES in src/lib/theme.ts limits dark mode to /portal,
   * whose colours all come from tokens. Gating by runtime as well bought
   * nothing (the marketing site is protected either way) and hid the toggle
   * from anyone using the portal in a normal browser tab.
   */
  darkMode: "all",

  /** Service worker - must stay on in the browser or the PWA isn't installable. */
  serviceWorker: "all",

  /** "Get the PlaceIT app" install prompt - only makes sense on the website. */
  installBanner: "browser",
} as const satisfies Record<string, FeatureScope>;

export type AppFeature = keyof typeof APP_FEATURES;

export function isFeatureEnabled(feature: AppFeature, mode: AppMode): boolean {
  switch (APP_FEATURES[feature] as FeatureScope) {
    case "all":
      return true;
    case "app":
      return mode !== "browser";
    case "native":
      return mode === "native";
    case "browser":
      return mode === "browser";
    case "off":
    default:
      return false;
  }
}
