"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/is-installed-app";

export function NativeAppDetector() {
  useEffect(() => {
    if (isNativeApp()) {
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
