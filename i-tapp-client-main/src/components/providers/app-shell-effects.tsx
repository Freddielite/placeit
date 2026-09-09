"use client";

import { useEffect } from "react";
import { useAppMode } from "./app-mode-provider";

// Side effects that have to touch the document directly rather than render
// something. Replaces the old `native-app-detector` - the <html> class it
// used to set is now owned by the boot script + AppModeProvider, so what's
// left here is the viewport tag and the service worker.
export function AppShellEffects() {
  const { feature, hydrated } = useAppMode();
  const disableZoom = feature("disableZoom");
  const serviceWorker = feature("serviceWorker");

  // Pinch-zoom: blocked in the app (a stray two-finger pinch on a native
  // screen looks broken), left alone on the website. `user-scalable=no` is
  // a WCAG 1.4.4 failure and Lighthouse dings it, so the static metadata in
  // layout.tsx ships the accessible version and we only tighten it here,
  // client-side, once we know we're in the app.
  useEffect(() => {
    if (!hydrated) return;
    const tag = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!tag) return;

    const appViewport =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
    const webViewport = "width=device-width, initial-scale=1, viewport-fit=cover";

    tag.setAttribute("content", disableZoom ? appViewport : webViewport);
  }, [disableZoom, hydrated]);

  // Registered in every mode - the browser needs it or the PWA can't be
  // installed in the first place, which is how people get into app mode.
  useEffect(() => {
    if (!serviceWorker) return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Non-fatal - app still works without the service worker.
    });
  }, [serviceWorker]);

  return null;
}
