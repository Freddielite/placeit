"use client";

import { useEffect, useState } from "react";
import { isInstalledApp } from "@/lib/is-installed-app";

const TOTAL_MS = 1700; // ~1.5-2s on screen
const FADE_OUT_MS = 300;

// Animated splash: logo fades/scales in, holds briefly, fades out. Only
// shown when running as the installed app (native Capacitor shell or
// installed PWA) - regular website visitors never see this.
export function AppSplash() {
  const [shouldShow, setShouldShow] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isInstalledApp()) {
      setMounted(false);
      return;
    }

    setShouldShow(true);
    const fadeTimer = setTimeout(
      () => setFadingOut(true),
      TOTAL_MS - FADE_OUT_MS
    );
    const removeTimer = setTimeout(() => setMounted(false), TOTAL_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted || !shouldShow) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_OUT_MS}ms ease`,
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        width={220}
        height={56}
        style={{
          animation:
            "app-splash-in 550ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      />
      <style>{`
        @keyframes app-splash-in {
          0% { opacity: 0; transform: scale(0.82); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
