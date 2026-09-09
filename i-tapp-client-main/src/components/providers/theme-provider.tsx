"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  readStoredPreference,
  resolvePreference,
  storePreference,
  THEME_CHROME_COLOR,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import { getStatusBarPlugin, whenBridgeReady } from "@/lib/capacitor-bridge";
import { useAppMode, useFeature } from "./app-mode-provider";

type ThemeContextValue = {
  /** What the user chose: light, dark, or follow-system. */
  preference: ThemePreference;
  /** What that actually resolves to right now. */
  theme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
  /** False on the website, where the theme is forced light. */
  available: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: "light",
  theme: "light",
  setPreference: () => {},
  available: false,
});

// APP-EXCLUSIVE (scope: `darkMode` in config/app-features.ts).
//
// Scoped to the app because the marketing site is built from ~155 files of
// hardcoded light colours, and a half-converted dark website is worse than a
// light one. The portal - where people actually spend time - is covered by
// the palette remap in globals.css. Flip the scope to "all" once the site
// pages have been audited.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const enabled = useFeature("darkMode");
  const { isNative } = useAppMode();

  // Initialised from what the boot script already resolved, so the first
  // render agrees with the DOM and nothing flashes.
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "light";
    return readStoredPreference();
  });

  const theme: ResolvedTheme = useMemo(() => {
    if (!enabled) return "light";
    if (typeof window === "undefined") return "light";
    return resolvePreference(preference);
  }, [enabled, preference]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Native status bar. The bar sits above the webview, so it stays white
  // over a dark app unless we tell it otherwise. Note the inversion: the
  // plugin's "style" describes the *content* colour, so a dark UI needs
  // LIGHT text.
  useEffect(() => {
    if (!isNative) return;
    return whenBridgeReady(() => {
      const statusBar = getStatusBarPlugin();
      if (!statusBar) return;
      void statusBar.setStyle({ style: theme === "dark" ? "LIGHT" : "DARK" });
      void statusBar.setBackgroundColor({ color: THEME_CHROME_COLOR[theme] });
    });
  }, [isNative, theme]);

  // Follow the OS while the preference is "system".
  useEffect(() => {
    if (!enabled || preference !== "system") return;
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(query.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [enabled, preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    storePreference(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference, available: enabled }),
    [preference, theme, setPreference, enabled]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
