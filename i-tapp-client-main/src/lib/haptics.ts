// Haptic feedback. Native uses the Capacitor Haptics plugin; installed PWAs
// fall back to the Vibration API (Android Chrome only - iOS Safari has no
// equivalent, so it silently no-ops there). Never throws, never blocks.

import { getHapticsPlugin } from "./capacitor-bridge";
import { isFeatureEnabled } from "@/config/app-features";
import { detectAppMode } from "./app-mode";

export type HapticKind = "light" | "medium" | "heavy" | "success" | "error" | "select";

const VIBRATION_FALLBACK: Record<HapticKind, number | number[]> = {
  light: 8,
  medium: 16,
  heavy: 28,
  select: 5,
  success: [12, 40, 12],
  error: [24, 60, 24],
};

// Not a hook - haptics fire from event handlers and non-React code, so the
// mode is resolved on the spot rather than read from context.
function enabled(): boolean {
  return isFeatureEnabled("haptics", detectAppMode());
}

export function haptic(kind: HapticKind = "light") {
  if (typeof window === "undefined" || !enabled()) return;

  const plugin = getHapticsPlugin();
  if (plugin) {
    try {
      if (kind === "success") {
        void plugin.notification({ type: "SUCCESS" });
      } else if (kind === "error") {
        void plugin.notification({ type: "ERROR" });
      } else if (kind === "select") {
        void plugin.selectionChanged();
      } else {
        void plugin.impact({
          style: kind.toUpperCase() as "LIGHT" | "MEDIUM" | "HEAVY",
        });
      }
      return;
    } catch {
      // Fall through to the web fallback.
    }
  }

  try {
    navigator.vibrate?.(VIBRATION_FALLBACK[kind]);
  } catch {
    // Vibration is blocked without a user gesture in some browsers. Ignore.
  }
}
