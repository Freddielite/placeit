"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAppPlugin, removeListener, whenBridgeReady } from "@/lib/capacitor-bridge";
import { useFeature } from "./app-mode-provider";
import { haptic } from "@/lib/haptics";
import { toast } from "react-toastify";

// Routes where "back" means "leave the app" rather than "go up a screen".
const ROOT_ROUTES = [
  "/",
  "/portal/dashboard",
  "/portal/find-it-space",
  "/portal/find-ppa",
];

const EXIT_CONFIRM_WINDOW_MS = 2000;

// NATIVE-ONLY (scope: `hardwareBackButton` in config/app-features.ts).
//
// Without this, Android's back button exits the app from any screen - the
// single most jarring thing about a wrapped webview. Capacitor's default
// handler is replaced entirely once we register a listener.
//
// Priority order matters: an open modal or drawer must swallow back before
// navigation does, or users end up on the previous page with the sheet still
// mounted over it.
export function BackButtonHandler() {
  const enabled = useFeature("hardwareBackButton");
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const exitArmedAt = useRef(0);

  // Keep the listener reading a live pathname without re-registering it on
  // every navigation (re-registering races with in-flight back presses).
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;

    let handle: unknown;

    const stopWaiting = whenBridgeReady(() => {
      const app = getAppPlugin();
      if (!app) return;

      handle = app.addListener("backButton", () => {
        // 1. Radix (dialog, sheet, drawer, popover, dropdown) marks open
        //    overlays with data-state="open". Escape is what all of them
        //    listen for, so dispatching it closes whatever is on top and
        //    respects their own nesting order.
        const openOverlay = document.querySelector(
          '[data-state="open"][role="dialog"], [data-state="open"][data-radix-popper-content-wrapper], [role="dialog"][data-state="open"]'
        );
        if (openOverlay) {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
          );
          return;
        }

        // 2. This app's sidenav/mobile-nav are custom and driven by window
        //    events rather than Radix state.
        window.dispatchEvent(new Event("placeit:mobilenav:close"));
        window.dispatchEvent(new Event("placeit:sidenav:close"));

        // 3. Not at a root screen - go up.
        if (!ROOT_ROUTES.includes(pathRef.current)) {
          router.back();
          return;
        }

        // 4. At a root screen - press-twice-to-exit.
        const now = Date.now();
        if (now - exitArmedAt.current < EXIT_CONFIRM_WINDOW_MS) {
          void app.exitApp();
          return;
        }

        exitArmedAt.current = now;
        haptic("light");
        toast.info("Press back again to exit", {
          autoClose: EXIT_CONFIRM_WINDOW_MS,
          toastId: "back-to-exit",
        });
      });
    });

    return () => {
      stopWaiting();
      void removeListener(handle);
    };
  }, [enabled, router]);

  return null;
}
