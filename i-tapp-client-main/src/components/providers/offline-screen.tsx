"use client";

import { useCallback, useEffect, useState } from "react";
import { hasPersistedCache } from "@/lib/query-persist";
import { useFeature } from "./app-mode-provider";

// APP-EXCLUSIVE (scope: `offlineScreen` in config/app-features.ts).
//
// Two presentations, depending on whether there's anything to show:
//
//   cached data on disk -> a slim bar. The screen underneath still has the
//     listings/applications you last loaded, so blocking it would be
//     throwing away the entire point of the offline cache.
//   nothing cached     -> the full-screen state, since there is genuinely
//     nothing behind it.
//
// App-only: a browser tab already has Chrome's offline page, and taking over
// the viewport of a site someone may have open in a background tab is
// hostile.
export function OfflineScreen() {
  const enabled = useFeature("offlineScreen");
  const [offline, setOffline] = useState(false);
  const [checking, setChecking] = useState(false);
  const [hasCache, setHasCache] = useState(false);

  // navigator.onLine only knows whether an interface is up - it reports true
  // on a captive portal and on "connected, no data". A real request is the
  // only reliable check, so the flag is treated as a hint that triggers one.
  const verifyConnection = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      await fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const evaluate = async () => {
      if (navigator.onLine) {
        const reachable = await verifyConnection();
        if (!cancelled) setOffline(!reachable);
      } else if (!cancelled) {
        setOffline(true);
      }
      if (!cancelled) setHasCache(hasPersistedCache());
    };

    void evaluate();

    const goOffline = () => setOffline(true);
    const goOnline = () => void evaluate();

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      cancelled = true;
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [enabled, verifyConnection]);

  const handleRetry = async () => {
    setChecking(true);
    const reachable = await verifyConnection();
    if (reachable) {
      setOffline(false);
    }
    setChecking(false);
  };

  if (!enabled || !offline) return null;

  // --- Slim bar: there's cached content behind this, don't cover it. -------
  if (hasCache) {
    return (
      <div
        role="status"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "calc(env(safe-area-inset-bottom) + var(--app-tabbar-height, 0px))",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 16px",
          background: "#101418",
          color: "#ffffff",
          fontSize: 13,
        }}
      >
        <span>Offline — showing saved data</span>
        <button
          onClick={handleRetry}
          disabled={checking}
          style={{
            background: "transparent",
            color: "#8fb6e6",
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            opacity: checking ? 0.6 : 1,
          }}
        >
          {checking ? "Checking…" : "Retry"}
        </button>
      </div>
    );
  }

  // --- Full screen: nothing cached, nothing to show. ----------------------
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        textAlign: "center",
        background: "#101418",
        color: "#ffffff",
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        style={{ marginBottom: 24 }}
      >
        <path
          d="M6 32H20L26 20L34 44L40 32H58"
          stroke="#477dc0"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
        You&apos;re offline
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.6)",
          margin: "0 0 24px",
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        PlaceIT can&apos;t reach the network right now. Check your
        connection and try again.
      </p>

      <button
        onClick={handleRetry}
        disabled={checking}
        style={{
          background: "#477dc0",
          color: "#ffffff",
          border: "none",
          borderRadius: 999,
          padding: "12px 32px",
          fontSize: 15,
          fontWeight: 700,
          opacity: checking ? 0.7 : 1,
        }}
      >
        {checking ? "Checking..." : "Retry"}
      </button>
    </div>
  );
}
