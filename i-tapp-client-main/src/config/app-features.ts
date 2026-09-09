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
