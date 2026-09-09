"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFeature } from "./app-mode-provider";

const PULL_THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

// APP-EXCLUSIVE (scope: `pullToRefresh` in config/app-features.ts).
//
// In the installed app this is the only pull-to-refresh there is, because
// `overscroll-behavior-y: contain` suppresses the browser's own - both are
// gated together, so a browser tab keeps Chrome's native pull-to-refresh
// and never gets this one. Turning one off without the other leaves users
// with no refresh gesture at all; that pairing is enforced in the CSS
// (html.is-app-mode) and in the feature registry.
//
// The wrapper elements render in every mode so the DOM shape is identical
// browser vs app - that keeps SSR markup stable and means the page tree is
// never torn down and rebuilt when the mode resolves. Only the listeners
// and the indicator are conditional.
export function PullToRefresh({ children }: { children: ReactNode }) {
  const enabled = useFeature("pullToRefresh");
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const pullingRef = useRef(false);

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
      // Leaving app mode mid-session (rare, but possible) shouldn't strand
      // the content pushed down.
      setPullDistance(0);
      setRefreshing(false);
    };
  }, [enabled, refreshing]);

  const shift = enabled
    ? Math.max(pullDistance, refreshing ? PULL_THRESHOLD : 0)
    : 0;
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const transitionStyle = pullingRef.current
    ? "none"
    : "margin-top 200ms ease, height 200ms ease, opacity 200ms ease";

  return (
    <div style={{ position: "relative" }}>
      {enabled && (
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
      )}

      <div
        style={
          enabled
            ? { marginTop: shift, transition: transitionStyle }
            : undefined
        }
      >
        {children}
      </div>

      {enabled && (
        <style>{`
          @keyframes pull-refresh-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.12); }
          }
        `}</style>
      )}
    </div>
  );
}
