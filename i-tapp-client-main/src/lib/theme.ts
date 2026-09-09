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
 * Route prefixes dark mode applies to. `"/"` means everywhere.
 *
 * This gate exists because the theme has to follow the SURFACE, not the
 * runtime. A page can only go dark if its colours resolve through variables;
 * a page with hardcoded light backgrounds will keep them while the text on
 * top inverts to near-white, and become unreadable.
 *
 * The marketing site was excluded for exactly that reason until its accents
 * and tinted section backgrounds were moved onto `--accent-*` / `--surface-*`
 * variables. Now that they are, everything is in scope.
 *
 * If a new area is added that hardcodes colour, narrow this list rather than
 * shipping it broken: `["/portal"]` restores the previous behaviour.
 */
export const THEMEABLE_ROUTE_PREFIXES = ["/"];

export function isThemeableRoute(pathname: string): boolean {
  return THEMEABLE_ROUTE_PREFIXES.some(
    (prefix) =>
      prefix === "/" || pathname === prefix || pathname.startsWith(prefix + "/")
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
