"use client";

import { useEffect, useRef, useState } from "react";
import { isInstalledApp } from "@/lib/is-installed-app";

const PULL_THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

// Custom pull-to-refresh for the installed app only. Native browser
// pull-to-refresh/rubber-banding is disabled globally (see globals.css),
// this replaces it with a branded gesture: pull down from the top of any
// page, the logo scales/rotates in as you pull, release past the
// threshold and it spins and reloads the page.
export function PullToRefresh() {
  const [enabled, setEnabled] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const pullingRef = useRef(false);

  useEffect(() => {
    if (!isInstalledApp()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const atTop = () =>
      (document.scrollingElement || document.documentElement).scrollTop <= 0;

    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (!atTop()) return;
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pullingRef.current || startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;

      if (delta <= 0 || !atTop()) {
        pullingRef.current = false;
        setPullDistance(0);
        return;
      }

      const resisted = Math.min(delta * RESISTANCE, MAX_PULL);
      setPullDistance(resisted);
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      startYRef.current = null;

      setPullDistance((current) => {
        if (current >= PULL_THRESHOLD) {
          setRefreshing(true);
          setTimeout(() => window.location.reload(), 550);
          return PULL_THRESHOLD;
        }
        return 0;
      });
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, refreshing]);

  if (!enabled) return null;

  const visible = pullDistance > 0 || refreshing;
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: Math.max(pullDistance, refreshing ? PULL_THRESHOLD : 0),
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9998,
        opacity: visible ? 1 : 0,
        transition: pullingRef.current
          ? "none"
          : "height 200ms ease, opacity 200ms ease",
      }}
    >
      <div style={{ padding: "14px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt=""
          width={72}
          height={18}
          style={{
            transform: `scale(${0.7 + progress * 0.3}) rotate(${
              progress * 10
            }deg)`,
            animation: refreshing
              ? "pull-refresh-pulse 700ms ease-in-out infinite"
              : "none",
            opacity: 0.5 + progress * 0.5,
          }}
        />
      </div>
      <style>{`
        @keyframes pull-refresh-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
