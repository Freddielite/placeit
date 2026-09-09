"use client";

import { useEffect } from "react";
import {
  getKeyboardPlugin,
  removeListener,
  whenBridgeReady,
} from "@/lib/capacitor-bridge";
import { useFeature } from "./app-mode-provider";

// APP-EXCLUSIVE (scope: `keyboardHandling` in config/app-features.ts).
//
// The classic wrapped-webview complaint on a forms-heavy app: the soft
// keyboard covers the field you're typing in, and any fixed bottom UI floats
// on top of it. Capacitor's `resize: "body"` (capacitor.config.json) shrinks
// the webview, which handles most of it; this fills the two remaining gaps.
//
//   1. Publishes --keyboard-height so fixed elements (the app tab bar) can
//      get out of the way instead of sitting over the keyboard.
//   2. Scrolls the focused field into view - body resize alone doesn't do
//      this when the field is near the bottom of a scroll container.
//
// The installed PWA gets a VisualViewport-based version of the same thing,
// since there's no plugin there.
export function KeyboardHandler() {
  const enabled = useFeature("keyboardHandling");

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;

    const setHeight = (height: number) => {
      root.style.setProperty("--keyboard-height", `${Math.max(0, height)}px`);
      root.classList.toggle("keyboard-open", height > 0);
    };

    const scrollFocusedIntoView = () => {
      // Two frames: one for the resize to land, one for layout to settle.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.activeElement;
          if (!(el instanceof HTMLElement)) return;
          if (!el.matches("input, textarea, select, [contenteditable='true']"))
            return;
          el.scrollIntoView({ block: "center", behavior: "smooth" });
        })
      );
    };

    let showHandle: unknown;
    let hideHandle: unknown;

    const stopWaiting = whenBridgeReady(() => {
      const keyboard = getKeyboardPlugin();
      if (!keyboard) return;

      showHandle = keyboard.addListener("keyboardWillShow", (info) => {
        setHeight(info.keyboardHeight);
        scrollFocusedIntoView();
      });
      hideHandle = keyboard.addListener("keyboardWillHide", () => setHeight(0));
    });

    // PWA fallback. visualViewport shrinks when the soft keyboard opens; the
    // difference against the layout viewport is the keyboard height.
    const vv = window.visualViewport;
    const onViewportResize = () => {
      if (getKeyboardPlugin()) return; // native listeners already have it
      if (!vv) return;
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      // Below ~120px it's browser chrome (URL bar), not a keyboard.
      setHeight(covered > 120 ? covered : 0);
      if (covered > 120) scrollFocusedIntoView();
    };
    vv?.addEventListener("resize", onViewportResize);

    return () => {
      stopWaiting();
      void removeListener(showHandle);
      void removeListener(hideHandle);
      vv?.removeEventListener("resize", onViewportResize);
      root.style.removeProperty("--keyboard-height");
      root.classList.remove("keyboard-open");
    };
  }, [enabled]);

  return null;
}
