// ---------------------------------------------------------------------------
// Theme (light / dark / follow-system).
//
// Hand-rolled rather than next-themes, for one reason: ordering. next-themes
// injects its own pre-paint script, and we already have one (the app-mode
// boot script in layout.tsx) that has to run first and decides whether dark
// mode is even available. Two competing pre-paint scripts race, and the loser
// causes a flash. One script, one owner.
//
// next-themes stays in package.json - components/ui/sonner.tsx imports it.
// ---------------------------------------------------------------------------

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "placeit:theme";
export const DARK_CLASS = "dark";

/**
 * Dark mode applies to these route prefixes ONLY.
 *
 * Scoping it by runtime (app vs website) was wrong. Someone who installs the
 * PWA lands on the marketing homepage, so "app mode" put a dark palette on
 * pages that were never built for one - and those pages are full of hardcoded
 * light backgrounds (`bg-emerald-50`, inline `style={{ background: slide.bg }}`,
 * gradient stops). The background stayed light while the text on it inverted
 * to near-white. White on mint. Unreadable.
 *
 * The theme has to follow the SURFACE, not the runtime. The portal is built
 * from design tokens and remaps cleanly; the marketing site, auth screens and
 * public pages stay light until someone has designed a dark version of them.
 */
export const THEMEABLE_ROUTE_PREFIXES = ["/portal"];

export function isThemeableRoute(pathname: string): boolean {
  return THEMEABLE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

/** Surface colours behind the status bar / browser chrome, per theme. */
export const THEME_CHROME_COLOR: Record<ResolvedTheme, string> = {
  light: "#ffffff",
  dark: "#12161c",
};

export function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Private mode / storage disabled.
  }
  return "system";
}

export function storePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Non-fatal - the theme just won't survive a restart.
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolvePreference(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return systemPrefersDark() ? "dark" : "light";
  return preference;
}

/**
 * Writes the class and the chrome colour. Safe to call repeatedly.
 *
 * `active` is false on routes outside the themeable set - the preference is
 * remembered, it just isn't painted there.
 */
export function applyTheme(resolved: ResolvedTheme, active = true) {
  const root = document.documentElement;
  const dark = active && resolved === "dark";

  root.classList.toggle(DARK_CLASS, dark);
  root.style.colorScheme = dark ? "dark" : "light";

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (meta) {
    meta.setAttribute("content", THEME_CHROME_COLOR[dark ? "dark" : "light"]);
  }
}
