// ---------------------------------------------------------------------------
// Deep links: turning an incoming URL into an in-app route.
//
// The native shell already loads getplaceit.com remotely, so a deep link is
// not "load this page" - the page is already loaded. It's "navigate the
// existing webview to this path". This module does the URL -> path half;
// components/providers/deep-link-handler.tsx does the navigation half.
//
// Two link shapes arrive here:
//
//   https://www.getplaceit.com/account/verify?token=…   Android App Links.
//     The real thing. Requires assetlinks.json to be live on the domain
//     (src/app/.well-known/assetlinks.json/route.ts) AND a verified
//     signing fingerprint, or Android silently sends the link to Chrome.
//
//   placeit://account/verify?token=…                    Custom scheme.
//     Works with no domain verification at all, which makes it the fallback
//     while App Links verification is still pending, and a debugging tool
//     (`adb shell am start -a android.intent.action.VIEW -d "placeit://…"`).
//     It is NOT a substitute: nothing generates these links today, since the
//     backend sends https links in emails.
//
// THREE PLACES DEFINE THE SAME PATH LIST. Keep them in sync:
//   1. ALLOWED_PATH_PREFIXES below
//   2. the <data android:pathPrefix> entries in
//      placeit-mobile/android/app/src/main/AndroidManifest.xml
//   3. the table in APP-VS-BROWSER.md
// The manifest decides what Android hands us; this file decides what we're
// willing to act on. Widening one without the other either does nothing (1
// without 2) or drops links on the floor (2 without 1).
// ---------------------------------------------------------------------------

/** Hosts we will accept an https deep link from. Anything else is ignored. */
export const DEEP_LINK_HOSTS = ["www.getplaceit.com", "getplaceit.com"];

/** Custom scheme registered by the Android shell. */
export const DEEP_LINK_SCHEME = "placeit";

/**
 * Route prefixes a deep link is allowed to reach.
 *
 * Deliberately narrow. The whole point of the feature is the email links -
 * verification, activation, password reset - which all live under /account.
 *
 * This is a security boundary, not just tidiness: any installed app can fire
 * `placeit://…` at us, and the custom scheme has no domain verification
 * behind it. An unbounded list would let a hostile app drop someone on an
 * arbitrary screen of a logged-in session.
 */
export const ALLOWED_PATH_PREFIXES = ["/account"];

/**
 * Parse a deep link into an in-app path (`/account/verify?token=…`).
 *
 * Returns null for anything not recognised, so callers can no-op rather than
 * navigating somewhere unexpected. Never throws - this runs on input from
 * outside the app.
 */
export function resolveDeepLink(raw: string | null | undefined): string | null {
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  let path: string;

  if (url.protocol === "https:" || url.protocol === "http:") {
    if (!DEEP_LINK_HOSTS.includes(url.hostname.toLowerCase())) return null;
    path = url.pathname;
  } else if (url.protocol === `${DEEP_LINK_SCHEME}:`) {
    // `placeit://account/verify` parses with host="account", pathname="/verify"
    // in some engines and host="", pathname="//account/verify" in others.
    // Rejoining both parts and collapsing the slashes handles either.
    path = `/${url.host}${url.pathname}`.replace(/\/{2,}/g, "/");
  } else {
    return null;
  }

  if (!path.startsWith("/")) path = `/${path}`;

  const allowed = ALLOWED_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  if (!allowed) return null;

  // Only the query survives. The hash is dropped on purpose: nothing in the
  // app routes on it, and tokens have turned up in fragments before.
  return `${path}${url.search}`;
}
