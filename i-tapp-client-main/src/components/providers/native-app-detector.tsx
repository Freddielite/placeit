"use client";

import { useEffect } from "react";
import { isInstalledApp } from "@/lib/is-installed-app";

export function NativeAppDetector() {
  useEffect(() => {
    // Covers both the native Capacitor app AND an installed PWA (Chrome's
    // "Install app"). App-only features (text-select lock, etc.) key off
    // this class rather than native-only, since installing via Chrome is
    // the common path most people actually use to test/use this as "the
    // app" day-to-day.
    if (isInstalledApp()) {
      document.documentElement.classList.add("is-native-app");
    }

    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal - app still works without the service worker.
      });
    }
  }, []);

  return null;
}
