// ---------------------------------------------------------------------------
// Thin, dependency-free access to Capacitor plugins.
//
// The native shell loads getplaceit.com remotely, so plugin JS is injected as
// `window.Capacitor.Plugins.*` by the bridge - the Next app deliberately does
// NOT npm-install @capacitor/app etc. Installing them here would add build
// weight for code that only ever runs inside the shell, and the packages
// throw "not implemented" when the bridge is absent anyway.
//
// Every accessor returns null off-native, so callers can no-op safely.
// Plugins must be installed in placeit-mobile/package.json and `cap sync`'d
// or the bridge won't expose them.
// ---------------------------------------------------------------------------

type PluginListener = { remove: () => void } | Promise<{ remove: () => void }>;

type CapacitorAppPlugin = {
  addListener(
    event: "backButton",
    fn: (info: { canGoBack: boolean }) => void
  ): PluginListener;
  addListener(
    event: "appStateChange",
    fn: (state: { isActive: boolean }) => void
  ): PluginListener;
  exitApp(): Promise<void>;
};

type CapacitorHapticsPlugin = {
  impact(opts: { style: "LIGHT" | "MEDIUM" | "HEAVY" }): Promise<void>;
  notification(opts: {
    type: "SUCCESS" | "WARNING" | "ERROR";
  }): Promise<void>;
  selectionChanged(): Promise<void>;
};

type CapacitorKeyboardPlugin = {
  addListener(
    event: "keyboardWillShow" | "keyboardDidShow",
    fn: (info: { keyboardHeight: number }) => void
  ): PluginListener;
  addListener(
    event: "keyboardWillHide" | "keyboardDidHide",
    fn: () => void
  ): PluginListener;
  setAccessoryBarVisible?(opts: { isVisible: boolean }): Promise<void>;
};

type CapacitorStatusBarPlugin = {
  setStyle(opts: { style: "DARK" | "LIGHT" }): Promise<void>;
  setBackgroundColor(opts: { color: string }): Promise<void>;
};

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: {
    App?: CapacitorAppPlugin;
    Haptics?: CapacitorHapticsPlugin;
    Keyboard?: CapacitorKeyboardPlugin;
    StatusBar?: CapacitorStatusBarPlugin;
  };
};

function bridge(): CapacitorGlobal | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor ?? null;
}

/**
 * True only when the plugin bridge is actually live. Distinct from
 * `isNativeApp()` in app-mode.ts, which trusts the user-agent marker: the UA
 * can say "native" a moment before the bridge finishes injecting. Anything
 * that calls a plugin must check THIS, not the mode.
 */
export function hasBridge(): boolean {
  const cap = bridge();
  return Boolean(cap?.isNativePlatform?.() && cap.Plugins);
}

export function getAppPlugin() {
  return hasBridge() ? bridge()!.Plugins!.App ?? null : null;
}

export function getHapticsPlugin() {
  return hasBridge() ? bridge()!.Plugins!.Haptics ?? null : null;
}

export function getKeyboardPlugin() {
  return hasBridge() ? bridge()!.Plugins!.Keyboard ?? null : null;
}

export function getStatusBarPlugin() {
  return hasBridge() ? bridge()!.Plugins!.StatusBar ?? null : null;
}

/**
 * The bridge can land after React has mounted. Polls briefly, then gives up
 * rather than leaking a timer for the life of the session.
 */
export function whenBridgeReady(fn: () => void, timeoutMs = 5000): () => void {
  if (hasBridge()) {
    fn();
    return () => {};
  }

  const started = Date.now();
  const id = window.setInterval(() => {
    if (hasBridge()) {
      window.clearInterval(id);
      fn();
    } else if (Date.now() - started > timeoutMs) {
      window.clearInterval(id);
    }
  }, 150);

  return () => window.clearInterval(id);
}

/**
 * Normalises the sync/async return of Capacitor's addListener - it resolves
 * to a handle on native, but the overload signatures differ per plugin, so
 * callers keep it loosely typed rather than importing plugin types.
 */
export async function removeListener(handle: unknown) {
  if (!handle) return;
  try {
    const resolved = (await handle) as { remove?: () => void } | null;
    resolved?.remove?.();
  } catch {
    // Listener was never attached, or the bridge is gone. Nothing to do.
  }
}
