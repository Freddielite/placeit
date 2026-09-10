"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFeature } from "@/components/providers/app-mode-provider";

// BROWSER-ONLY (scope: `installBanner` in config/app-features.ts).
//
// The registry has had this key and a <BrowserOnly> wrapper waiting for a
// component since the app-mode split went in. This is it.
//
// Only the website advertises the app — showing "get the app" to someone
// already in the app is the kind of thing that makes a product feel
// unfinished. The `browser` scope handles that; nothing here needs to check.
//
// Two install paths, because Chrome and Safari don't agree on any of this:
//
//   Chrome/Edge on Android fire `beforeinstallprompt`. Calling
//     preventDefault() stops the browser's own mini-infobar and hands us a
//     deferred event we can fire from a real button. The event can only be
//     used ONCE and only in response to a user gesture.
//   iOS Safari has no such event and no programmatic install at all. The
//     only route is Share -> Add to Home Screen, so all we can do is say so.
//
// If NEXT_PUBLIC_ANDROID_STORE_URL is set, Android visitors are sent to the
// Play listing instead of the PWA install — a store install is the better
// outcome (updates, notifications later, a real launcher entry) and it's
// the build that actually gets the app-mode features.

const DISMISS_KEY = "placeit:install-banner-dismissed";
const DISMISS_DAYS = 14;

/** Let people read something before asking them to install it. */
const APPEAR_DELAY_MS = 4000;

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function dismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    if (raw === "never") return true;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    // Private mode / storage disabled. Showing it again is the lesser evil.
    return false;
  }
}

function remember(value: string) {
  try {
    localStorage.setItem(DISMISS_KEY, value);
  } catch {
    // Nothing to do - it'll reappear next session.
  }
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as a Mac; the touch points give it away.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Chrome and Firefox on iOS are Safari underneath but can't install at all,
  // so the Share-sheet instructions would be wrong for them.
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

export function GetTheAppBanner() {
  const enabled = useFeature("installBanner");

  const [visible, setVisible] = useState(false);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [iosCapable, setIosCapable] = useState(false);
  // Resolved after mount - reads the UA, so it can't be derived during SSR.
  const [storeReady, setStoreReady] = useState(false);

  const storeUrl = process.env.NEXT_PUBLIC_ANDROID_STORE_URL;

  const hide = useCallback((persist: string | null) => {
    setVisible(false);
    setShowIosHelp(false);
    if (persist) remember(persist);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (dismissedRecently()) return;

    // Phones and tablets only. A desktop visitor installing the PWA isn't
    // harmful, but the copy is about having it "on your phone" and the
    // banner would sit awkwardly across a wide viewport.
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return;

    const ios = isIosSafari();
    setIosCapable(ios);

    // The Play listing is only an answer on Android. Checking `storeUrl`
    // alone would send an iPhone to Google Play the moment that env var is
    // set - a bug that stays invisible until the app ships.
    const store = Boolean(storeUrl) && isAndroid();
    setStoreReady(store);

    let timer: number | undefined;
    const reveal = () => {
      // Both branches below can fire on the same Android visit (store URL
      // set AND beforeinstallprompt arrives). Without this guard the second
      // call orphans the first timer, so cleanup only clears one of them and
      // a setState lands after unmount.
      if (timer !== undefined) return;
      timer = window.setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    };

    const onBeforeInstall = (event: Event) => {
      // Suppress Chrome's own mini-infobar so there aren't two prompts.
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      reveal();
    };

    // Installed via any route (our button, Chrome's menu, the store) - stop
    // asking for good.
    const onInstalled = () => hide("never");

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt, so nothing would ever reveal the
    // banner there. Android with a store URL doesn't need the event either -
    // the button is just a link.
    if (ios || store) reveal();

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled, hide, storeUrl]);

  const install = async () => {
    if (storeReady && storeUrl) {
      window.open(storeUrl, "_blank", "noopener,noreferrer");
      hide("never");
      return;
    }

    if (prompt) {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        // The event is single-use either way - drop it so the button can't
        // be pressed again into a no-op.
        setPrompt(null);
        hide(outcome === "accepted" ? "never" : String(Date.now()));
      } catch {
        hide(String(Date.now()));
      }
      return;
    }

    if (iosCapable) {
      setShowIosHelp((open) => !open);
    }
  };

  if (!enabled || !visible) return null;

  const canInstall = Boolean(prompt) || storeReady || iosCapable;
  if (!canInstall) return null;

  return (
    <div
      data-install-banner
      role="region"
      aria-label="Install the PlaceIT app"
      className="fixed inset-x-0 bottom-0 z-[9990] px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden"
    >
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/android-chrome-192x192.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              Get the PlaceIT app
            </p>
            <p className="truncate text-xs text-gray-500">
              Faster, and works offline
            </p>
          </div>

          <button
            type="button"
            onClick={install}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
          >
            {storeReady ? "Get" : iosCapable && !prompt ? "How?" : "Install"}
          </button>

          <button
            type="button"
            onClick={() => hide(String(Date.now()))}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-1.5 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {showIosHelp && (
          <p className="mt-3 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-600">
            Tap the Share button in Safari&apos;s toolbar, then choose{" "}
            <span className="font-semibold text-gray-900">
              Add to Home Screen
            </span>
            .
          </p>
        )}
      </div>
    </div>
  );
}
