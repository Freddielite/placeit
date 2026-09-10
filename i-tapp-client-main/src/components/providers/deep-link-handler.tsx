"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getAppPlugin,
  removeListener,
  whenBridgeReady,
} from "@/lib/capacitor-bridge";
import { resolveDeepLink } from "@/lib/deep-links";
import { useFeature } from "./app-mode-provider";

// NATIVE-ONLY (scope: `deepLinks` in config/app-features.ts).
//
// Without this, tapping a verification or password-reset link from an email
// opens Chrome - on a phone that already has PlaceIT installed, with the
// user already signed in there. Two sessions, two cookie jars, and a
// verification that appears not to have worked.
//
// An installed PWA needs none of this: Chrome routes in-scope links into the
// installed app itself, and the app is just a browser window at that URL.
// Only the wrapped shell has to be told.
//
// Two arrival paths, because Capacitor covers cold and warm starts
// differently:
//
//   cold start - the OS starts the activity with the URL as its launch
//     intent. `getLaunchUrl()` reads it back. `appUrlOpen` may or may not
//     also fire depending on the platform and plugin version, hence the
//     dedupe below.
//   warm start - `singleTask` in the manifest means the running activity is
//     reused rather than a second one stacked on top, and the URL arrives
//     through onNewIntent -> `appUrlOpen`.
//
// On a cold start the shell has already begun loading the homepage by the
// time we navigate away from it. That's covered rather than fixed: the
// splash overlay (1.7s) outlasts the redirect, so what the user sees is
// splash -> the verification screen, never a flash of the homepage.
/** Long enough to cover the cold-start race, short enough to be invisible. */
const DEDUPE_WINDOW_MS = 3000;

export function DeepLinkHandler() {
  const enabled = useFeature("deepLinks");
  const router = useRouter();
  const pathname = usePathname();

  // Same trick as BackButtonHandler: the listener is registered once, and
  // re-registering it on every navigation would race with in-flight intents.
  const pathRef = useRef(pathname);
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // Guards against handling the same intent twice when both getLaunchUrl()
  // and appUrlOpen report the launch URL. See the note in `go` for why this
  // carries a timestamp rather than being a permanent record.
  const lastHandled = useRef<{ target: string; at: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let handle: unknown;
    let cancelled = false;

    const go = (raw: string | null | undefined) => {
      if (cancelled) return;

      const target = resolveDeepLink(raw);
      if (!target) return;

      // Dedupe the launch race only. getLaunchUrl() and appUrlOpen can both
      // report the SAME cold-start URL within a few ms of each other, and
      // acting on it twice double-fires whatever the screen does on mount.
      //
      // Time-bounded on purpose: a permanent record would mean that tapping
      // the same link again later - having navigated away in between, which
      // is exactly what someone does when a screen didn't seem to work -
      // silently did nothing for the rest of the session.
      const now = Date.now();
      if (
        lastHandled.current &&
        lastHandled.current.target === target &&
        now - lastHandled.current.at < DEDUPE_WINDOW_MS
      ) {
        return;
      }

      // Already on that screen - re-navigating would remount it and restart
      // whatever request it fires on mount (the verify page verifies on
      // mount, and doing that twice burns a single-use token).
      if (target === `${pathRef.current}${window.location.search}`) return;

      lastHandled.current = { target, at: now };

      // replace, not push: the homepage the shell cold-started on isn't
      // somewhere "back" should return to, and on a warm start the screen
      // the user left isn't either.
      router.replace(target);
    };

    const stopWaiting = whenBridgeReady(() => {
      const app = getAppPlugin();
      if (!app) return;

      handle = app.addListener("appUrlOpen", (data) => go(data?.url));

      // Older @capacitor/app builds don't expose getLaunchUrl; the optional
      // call means a missing method costs us the cold-start path rather
      // than throwing on every launch.
      void app
        .getLaunchUrl?.()
        .then((launch) => go(launch?.url))
        .catch(() => {
          // No launch URL, or the platform doesn't implement it. Normal.
        });
    });

    return () => {
      cancelled = true;
      stopWaiting();
      void removeListener(handle);
    };
  }, [enabled, router]);

  return null;
}
