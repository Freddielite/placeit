// Shared check for "installed app" context - used to gate features that
// should only show up when running as the actual app (native Capacitor
// shell or an installed PWA), not during a normal browser tab visit.
export function isInstalledApp(): boolean {
  if (typeof window === "undefined") return false;

  const w = window as any;

  const isNativeApp =
    w.Capacitor &&
    typeof w.Capacitor.isNativePlatform === "function" &&
    w.Capacitor.isNativePlatform();

  const isInstalledPwa =
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches;

  return Boolean(isNativeApp || isInstalledPwa);
}

// Native-app-only check (excludes installed PWA) - used for behaviors that
// should be scoped strictly to the wrapped native app, e.g. text-selection
// locking.
export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return Boolean(
    w.Capacitor &&
      typeof w.Capacitor.isNativePlatform === "function" &&
      w.Capacitor.isNativePlatform()
  );
}
