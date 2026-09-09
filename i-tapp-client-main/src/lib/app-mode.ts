// ---------------------------------------------------------------------------
// Single source of truth for "am I running as the app, or as a website?"
//
// Three runtime modes:
//   native  - wrapped Capacitor shell (Play Store / App Store build)
//   pwa     - installed to the home screen via Chrome/Safari "Install app"
//   browser - a normal browser tab (getplaceit.com)
//
// `native` and `pwa` together are "app mode". Everything app-exclusive
// (pull-to-refresh, splash, page transitions, text-select lock, no-zoom,
// offline screen) keys off app mode. `browser` keeps stock browser
// behaviour so the website still behaves like a website.
//
// NOTE: the same detection is duplicated as an inline boot script in
// app/layout.tsx (APP_MODE_BOOT_SCRIPT below) so the <html> class is set
// before first paint. Keep the two in sync - the boot script is the one
// that runs first; this module reads what it wrote.
// ---------------------------------------------------------------------------

export type AppMode = "native" | "pwa" | "browser";

export const APP_MODE_CLASS = "is-app-mode"; // native OR installed PWA
export const NATIVE_CLASS = "is-native-app"; // native Capacitor only
export const BROWSER_CLASS = "is-browser-mode"; // plain browser tab

/** Query param / storage key for forcing app mode in a desktop browser while developing. */
export const APP_MODE_OVERRIDE_KEY = "placeit:force-app-mode";

function isNativeShell(): boolean {
  const w = window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  };
  return Boolean(
    w.Capacitor &&
      typeof w.Capacitor.isNativePlatform === "function" &&
      w.Capacitor.isNativePlatform()
  );
}

function isStandaloneDisplay(): boolean {
  // Chrome/Edge/Android installed PWA, plus TWA (android-app:// referrer)
  // and iOS Safari's legacy navigator.standalone.
  const displayModes = ["standalone", "fullscreen", "minimal-ui"];
  const matchesDisplayMode =
    typeof window.matchMedia === "function" &&
    displayModes.some((mode) =>
      window.matchMedia(`(display-mode: ${mode})`).matches
    );

  const iosStandalone =
    (navigator as unknown as { standalone?: boolean }).standalone === true;

  const isTwa =
    typeof document !== "undefined" &&
    document.referrer.startsWith("android-app://");

  return matchesDisplayMode || iosStandalone || isTwa;
}

function hasDevOverride(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("appmode");
    if (param === "1" || param === "true") {
      sessionStorage.setItem(APP_MODE_OVERRIDE_KEY, "1");
      return true;
    }
    if (param === "0" || param === "false") {
      sessionStorage.removeItem(APP_MODE_OVERRIDE_KEY);
      return false;
    }
    return sessionStorage.getItem(APP_MODE_OVERRIDE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Resolve the current runtime mode. Returns "browser" during SSR. */
export function detectAppMode(): AppMode {
  if (typeof window === "undefined") return "browser";
  if (isNativeShell()) return "native";
  if (isStandaloneDisplay() || hasDevOverride()) return "pwa";
  return "browser";
}

/** Native shell OR installed PWA - the gate for app-exclusive features. */
export function isAppMode(): boolean {
  return detectAppMode() !== "browser";
}

/** Strictly the wrapped Capacitor build (excludes installed PWA). */
export function isNativeApp(): boolean {
  return detectAppMode() === "native";
}

/**
 * Reads the mode off the <html> class the boot script already set. Safe to
 * call in a useState initialiser during the first client render, so the
 * first render is already correct and nothing has to remount.
 */
export function readAppModeFromDocument(): AppMode {
  if (typeof document === "undefined") return "browser";
  const root = document.documentElement.classList;
  if (root.contains(NATIVE_CLASS)) return "native";
  if (root.contains(APP_MODE_CLASS)) return "pwa";
  if (root.contains(BROWSER_CLASS)) return "browser";
  // Boot script didn't run (shouldn't happen) - fall back to live detection.
  return detectAppMode();
}

/** Write the resolved mode onto <html> so CSS can gate on it. */
export function applyAppModeClasses(mode: AppMode) {
  const root = document.documentElement.classList;
  root.toggle(NATIVE_CLASS, mode === "native");
  root.toggle(APP_MODE_CLASS, mode !== "browser");
  root.toggle(BROWSER_CLASS, mode === "browser");
}
