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

/** Writes the class and the chrome colour. Safe to call repeatedly. */
export function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, resolved === "dark");
  root.style.colorScheme = resolved;

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (meta) meta.setAttribute("content", THEME_CHROME_COLOR[resolved]);
}
