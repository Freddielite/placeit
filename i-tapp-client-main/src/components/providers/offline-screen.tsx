"use client";

import { useEffect, useState } from "react";
import { useFeature } from "./app-mode-provider";

// APP-EXCLUSIVE (scope: `offlineScreen` in config/app-features.ts).
//
// Full-screen "you're offline" takeover. App-only on purpose: a browser tab
// already has Chrome's own offline page, and hijacking the viewport of a
// website that the user may have open in a background tab is hostile.
export function OfflineScreen() {
  const enabled = useFeature("offlineScreen");
  const [offline, setOffline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);

    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [enabled]);

  if (!enabled || !offline) return null;

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setChecking(false);
      }
    }, 500);
  };

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
