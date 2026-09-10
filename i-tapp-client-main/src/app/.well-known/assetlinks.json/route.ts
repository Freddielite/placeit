// ---------------------------------------------------------------------------
// Digital Asset Links — what makes Android App Links actually open the app.
//
// Android fetches https://www.getplaceit.com/.well-known/assetlinks.json on
// install and checks that this domain names the app's package and signing
// certificate. Only then does it honour the `autoVerify` intent filter in
// AndroidManifest.xml. Until it verifies, tapping a verification email link
// opens Chrome exactly as it does today — no error, no clue why.
//
// SET `ANDROID_APP_FINGERPRINTS` IN THE DEPLOYMENT ENVIRONMENT or this route
// 404s and verification can never succeed. It isn't hardcoded because the
// value is a property of the signing key, not the code, and it differs
// between the debug key and Play App Signing:
//
//   debug   keytool -list -v -keystore ~/.android/debug.keystore \
//             -alias androiddebugkey -storepass android -keypass android
//   release Play Console -> Release -> Setup -> App signing -> "SHA-256
//           certificate fingerprint". Use the APP SIGNING key, not the
//           upload key: Play re-signs the upload, so the upload key's
//           fingerprint is not what lands on the device.
//
// List both, comma-separated, if you want deep links working in debug builds
// as well as from the store.
//
// Serving requirements Google enforces, none of which are optional:
//   - exactly this path, no redirect (an apex -> www redirect fails)
//   - Content-Type: application/json
//   - HTTPS with a valid certificate
//   - no authentication
//
// The redirect rule is why AndroidManifest.xml verifies `www.getplaceit.com`
// only. Adding the apex to the same autoVerify filter would fail the whole
// filter — verification is all-or-nothing across the hosts it declares — if
// the apex redirects to www, which is the usual setup. Add it only once you
// have confirmed the apex serves this file directly.
//
// Verify after deploying:
//   curl -sI https://www.getplaceit.com/.well-known/assetlinks.json
//   (200, application/json, no 3xx hop)
//   https://developers.google.com/digital-asset-links/tools/generator
//   adb shell pm get-app-links com.wyntek.placeit   -> "verified"
// ---------------------------------------------------------------------------

const PACKAGE_NAME =
  process.env.ANDROID_PACKAGE_NAME ?? "com.wyntek.placeit";

/**
 * A SHA-256 fingerprint is 32 colon-separated hex pairs. Pasting the SHA-1
 * from the same keytool output instead is the single most common way this
 * ends up misconfigured, and Google's verifier reports it as a plain
 * failure with no hint about which field was wrong - so reject it here,
 * loudly, where the message can actually say so.
 */
const SHA256_FINGERPRINT = /^[0-9A-F]{2}(:[0-9A-F]{2}){31}$/;

/** Comma/whitespace-separated SHA-256 fingerprints. */
function fingerprints(): string[] {
  const raw = (process.env.ANDROID_APP_FINGERPRINTS ?? "")
    .split(/[,\s]+/)
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  const valid = raw.filter((value) => SHA256_FINGERPRINT.test(value));

  if (valid.length !== raw.length) {
    console.warn(
      "[assetlinks] Ignoring %d malformed fingerprint(s) in " +
        "ANDROID_APP_FINGERPRINTS. Expected 32 colon-separated hex pairs " +
        "(SHA-256). A 20-pair value is SHA-1 and will not work.",
      raw.length - valid.length
    );
  }

  return valid;
}

// Read at request time, not baked at build time. Prerendering this would
// mean that adding ANDROID_APP_FINGERPRINTS in the hosting dashboard does
// nothing until the next deploy - the build would have already frozen the
// 404 below into a static file, and you'd be debugging App Links against a
// response that can't change. It's fetched roughly once per install; the
// cache header does the rest.
export const dynamic = "force-dynamic";

export function GET() {
  const certs = fingerprints();

  // Deliberately 404 rather than serving a file with a placeholder or an
  // empty fingerprint list. A malformed file is worse than a missing one:
  // Android caches a verification failure and retries on its own schedule,
  // so a bad file can keep deep links broken well after it's fixed.
  if (certs.length === 0) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  }

  const statements = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: certs,
      },
    },
  ];

  return new Response(JSON.stringify(statements, null, 2), {
    status: 200,
    headers: {
      // Google's verifier is strict about this; text/plain is rejected.
      "content-type": "application/json",
      "cache-control": "public, max-age=3600",
    },
  });
}
