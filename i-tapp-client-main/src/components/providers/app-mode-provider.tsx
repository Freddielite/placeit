"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyAppModeClasses,
  detectAppMode,
  readAppModeFromDocument,
  type AppMode,
} from "@/lib/app-mode";
import {
  isFeatureEnabled,
  type AppFeature,
} from "@/config/app-features";

type AppModeContextValue = {
  mode: AppMode;
  isApp: boolean;
  isNative: boolean;
  isBrowser: boolean;
  /** False during SSR and the very first paint on a cold browser load. */
  hydrated: boolean;
  feature: (name: AppFeature) => boolean;
};

const AppModeContext = createContext<AppModeContextValue>({
  mode: "browser",
  isApp: false,
  isNative: false,
  isBrowser: true,
  hydrated: false,
  feature: () => false,
});

export function AppModeProvider({ children }: { children: ReactNode }) {
  // Initialiser reads the class the boot script wrote before first paint, so
  // the first client render already knows the mode - no flash of the wrong
  // chrome, no post-mount remount of the page tree.
  const [mode, setMode] = useState<AppMode>(() => readAppModeFromDocument());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = detectAppMode();
      applyAppModeClasses(next);
      setMode(next);
    };

    sync();
    setHydrated(true);

    // A user can install mid-session, or the window can move between
    // standalone and browser display modes. Keep up.
    if (typeof window.matchMedia !== "function") return;
    const standalone = window.matchMedia("(display-mode: standalone)");
    standalone.addEventListener("change", sync);
    return () => standalone.removeEventListener("change", sync);
  }, []);

  const value = useMemo<AppModeContextValue>(
    () => ({
      mode,
      isApp: mode !== "browser",
      isNative: mode === "native",
      isBrowser: mode === "browser",
      hydrated,
      feature: (name: AppFeature) => isFeatureEnabled(name, mode),
    }),
    [mode, hydrated]
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
}

/** `const { isApp, feature } = useAppMode()` */
export function useAppMode() {
  return useContext(AppModeContext);
}

/** `useFeature("pullToRefresh")` -> boolean */
export function useFeature(name: AppFeature) {
  return useAppMode().feature(name);
}

/** Render children only in the installed app (native shell or PWA). */
export function AppOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isApp, hydrated } = useAppMode();
  if (!hydrated) return <>{fallback}</>;
  return <>{isApp ? children : fallback}</>;
}

/** Render children only on the public website. */
export function BrowserOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isBrowser, hydrated } = useAppMode();
  if (!hydrated) return <>{fallback}</>;
  return <>{isBrowser ? children : fallback}</>;
}
