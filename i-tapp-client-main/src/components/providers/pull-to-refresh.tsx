"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isInstalledApp } from "@/lib/is-installed-app";

const PULL_THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

// Custom pull-to-refresh for the installed app only. Native browser
// pull-to-refresh/rubber-banding is disabled globally (see globals.css),
// this replaces it with a branded gesture: pull down from the top of any
// page, the page content itself shifts down revealing the icon above it,
// release past the threshold and it pulses and reloads the page.
//
// Uses margin-top (not a CSS transform) to push content down - a
// transform on this wrapper would create a new containing block for any
// position:fixed element inside the app (headers, modals, sidenavs),
// breaking their positioning app-wide. Margin doesn't have that problem.
export function PullToRefresh({ children }: { children: ReactNode }) {
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

  if (!enabled) return <>{children}</>;

  const shift = Math.max(pullDistance, refreshing ? PULL_THRESHOLD : 0);
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const transitionStyle = pullingRef.current
    ? "none"
    : "margin-top 200ms ease, height 200ms ease, opacity 200ms ease";

  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: shift,
          overflow: "hidden",
          opacity: shift > 0 ? 1 : 0,
          transition: transitionStyle,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/placeit-icon.png"
          alt=""
          width={32}
          height={32}
          style={{
            borderRadius: 8,
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

      <div
        style={{
          marginTop: shift,
          transition: transitionStyle,
        }}
      >
        {children}
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
