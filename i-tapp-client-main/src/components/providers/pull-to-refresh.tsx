"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useFeature } from "./app-mode-provider";
import { haptic } from "@/lib/haptics";

const PULL_THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;
const MIN_INDICATOR_MS = 450;

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
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const pullingRef = useRef(false);
  const armedRef = useRef(false);

  // Refetch rather than reload. `window.location.reload()` re-downloads the
  // JS bundle, flashes white, drops scroll position and blows away every
  // client cache - several seconds on a poor connection, and unmistakably
  // "this is a web page". Invalidating React Query refetches only the data
  // that's actually on screen; router.refresh() re-runs the server
  // components alongside it.
  const runRefresh = useCallback(async () => {
    haptic("medium");
    const startedAt = Date.now();
    try {
      router.refresh();
      await queryClient.invalidateQueries({ refetchType: "active" });
    } catch {
      // A failed refetch leaves the last-known data on screen, which is the
      // right outcome - don't escalate to a reload.
    } finally {
      // A cached refetch can resolve in ~20ms, which reads as a broken
      // flicker rather than a refresh. Hold the indicator briefly.
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_INDICATOR_MS - elapsed);
      window.setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, remaining);
    }
  }, [queryClient, router]);

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

      // One tick as the gesture crosses the release threshold, the way a
      // native pull-to-refresh tells you it's armed.
      const armed = resisted >= PULL_THRESHOLD;
      if (armed !== armedRef.current) {
        armedRef.current = armed;
        if (armed) haptic("light");
      }

      setPullDistance(resisted);
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      startYRef.current = null;
      armedRef.current = false;

      setPullDistance((current) => {
        if (current >= PULL_THRESHOLD) {
          setRefreshing(true);
          void runRefresh();
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
  }, [enabled, refreshing, runRefresh]);

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
