// ---------------------------------------------------------------------------
// "Photograph the document" for file uploads.
//
// Two implementations of the same idea, picked at runtime:
//
//   native  - @capacitor/camera. A real camera activity, and the only path
//             that reliably works inside the Android WebView: the shell
//             loads a remote origin, and a remote page asking for
//             getUserMedia / <input capture> is at the mercy of the
//             WebView's file-chooser wiring and permission delegation.
//   web     - <input type="file" accept="image/*" capture="environment">,
//             handled by the caller (see components/file-upload-thing.tsx).
//             Mobile browsers open the camera directly; desktop ones fall
//             back to a file dialog, which is why the button is hidden on
//             pointer:fine devices.
//
// Output has to satisfy `fileSchema` in schemas/company.schema.ts - a File,
// under 10MB, of an accepted MIME type. The plugin options below are chosen
// to guarantee that: JPEG at quality 80 and max 1600px is 200-600KB for a
// photographed A4 page, and still legible enough to read a CV off.
// ---------------------------------------------------------------------------

import { getCameraPlugin } from "./capacitor-bridge";
import { isFeatureEnabled } from "@/config/app-features";
import { detectAppMode } from "./app-mode";

/** Long edge, in px. Big enough to read body text off a photographed page. */
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 80;

/** True when the Capacitor Camera plugin is live and callable. */
export function hasNativeCamera(): boolean {
  return getCameraPlugin() !== null;
}

/**
 * True when a camera button is worth showing at all.
 *
 * `pointer: coarse` is the closest thing to "this is a phone or tablet"
 * that doesn't involve sniffing the user agent. On a desktop browser the
 * `capture` attribute is ignored and the button would just be a second,
 * identical file dialog - confusing rather than useless.
 *
 * Not a hook: uploads live inside react-hook-form fields that re-render on
 * every keystroke elsewhere in the form, and this is cheap enough to just
 * ask. Same pattern as haptic() in src/lib/haptics.ts.
 */
export function canOfferCamera(): boolean {
  if (typeof window === "undefined") return false;
  if (!isFeatureEnabled("cameraCapture", detectAppMode())) return false;
  if (hasNativeCamera()) return true;
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function dataUrlToFile(dataUrl: string, filename: string): File | null {
  const [header, payload] = dataUrl.split(",");
  if (!payload) return null;

  const mime = /data:([^;]+)/.exec(header)?.[1] ?? "image/jpeg";

  let binary: string;
  try {
    binary = atob(payload);
  } catch {
    return null;
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  return new File([bytes], filename, { type: mime, lastModified: Date.now() });
}

export function photoFilename(prefix = "photo"): string {
  // Colons and spaces out of an ISO timestamp - some backends and Android's
  // own download manager choke on them in a filename.
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}-${stamp}.jpg`;
}

/**
 * Shrink an oversized camera photo to the same budget the native plugin
 * produces (long edge MAX_DIMENSION, JPEG at JPEG_QUALITY).
 *
 * The web path can't ask the camera for a smaller image the way the plugin
 * can - `<input capture>` hands back whatever the camera app saved, which on
 * a current phone is routinely 4-9MB and sometimes over the 10MB cap in
 * `fileSchema`. Without this, "photograph your IT letter" fails validation
 * on precisely the devices with the best cameras, and the error message
 * ("Max file size is 10MB") gives no hint that retaking won't help.
 *
 * Returns the ORIGINAL file unchanged on any failure. A slightly-too-large
 * file that the user can see rejected is better than a silent black square,
 * and every step here (createImageBitmap, canvas, toBlob) can fail or be
 * missing depending on the browser.
 */
export async function downscaleImage(
  file: File,
  filename = photoFilename()
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    // `imageOrientation: "from-image"` applies the EXIF rotation while
    // decoding. Without it the canvas draws the raw sensor pixels and a
    // portrait photo of a document comes out sideways - the same trap
    // `correctOrientation` covers on the native side.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const longEdge = Math.max(bitmap.width, bitmap.height);
    const scale = longEdge > MAX_DIMENSION ? MAX_DIMENSION / longEdge : 1;

    // Already small enough AND already JPEG - re-encoding would only lose
    // quality for no gain.
    if (scale === 1 && file.type === "image/jpeg") {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY / 100)
    );
    if (!blob) return file;

    // Guard against the pathological case where re-encoding grew the file
    // (a small flat-colour PNG becomes a larger JPEG).
    if (blob.size >= file.size && scale === 1) return file;

    return new File([blob], filename, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

/**
 * Why a capture produced no file. `cancelled` is the user changing their
 * mind and needs no feedback at all; `denied` is a dead end they can't
 * escape from inside the app, so the caller has to say something. Treating
 * both as "nothing happened" leaves someone tapping a button that silently
 * does nothing forever after one accidental Deny.
 */
export type CaptureFailure = "cancelled" | "denied" | "unavailable";

export type CaptureResult =
  | { file: File; reason?: undefined }
  | { file: null; reason: CaptureFailure };

/**
 * Open the native camera and return the shot.
 *
 * The plugin reports a cancel by throwing, not by resolving, so the reason
 * has to be recovered from the error message - there is no error code to
 * switch on. Anything unrecognised is treated as a cancel: a spurious
 * "camera unavailable" toast on a successful cancel is worse than staying
 * quiet.
 */
export async function captureWithNativeCamera(
  prefix = "photo"
): Promise<CaptureResult> {
  const camera = getCameraPlugin();
  if (!camera) return { file: null, reason: "unavailable" };

  try {
    const photo = await camera.getPhoto({
      quality: JPEG_QUALITY,
      width: MAX_DIMENSION,
      resultType: "dataUrl",
      source: "CAMERA",
      // Phones record orientation in EXIF rather than rotating the pixels.
      // Without this, a portrait photo of a document arrives sideways and
      // whoever opens it has to tilt their head.
      correctOrientation: true,
      // Don't litter the camera roll with someone's IT letter.
      saveToGallery: false,
      allowEditing: false,
    });

    if (!photo?.dataUrl) return { file: null, reason: "cancelled" };

    const file = dataUrlToFile(photo.dataUrl, photoFilename(prefix));
    return file ? { file } : { file: null, reason: "unavailable" };
  } catch (error) {
    const message = String(
      (error as { message?: unknown } | null)?.message ?? error ?? ""
    ).toLowerCase();

    const denied =
      message.includes("denied") ||
      message.includes("permission") ||
      message.includes("not authorized");

    return { file: null, reason: denied ? "denied" : "cancelled" };
  }
}
