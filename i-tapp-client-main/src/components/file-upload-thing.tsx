"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/tailwind";
import { CameraIcon, FileUpIcon, XIcon } from "lucide-react";
import {
  canOfferCamera,
  captureWithNativeCamera,
  downscaleImage,
  hasNativeCamera,
  photoFilename,
} from "@/lib/camera";
import { haptic } from "@/lib/haptics";
// react-toastify, not sonner: <ThemedToastContainer /> is mounted in
// AppProvider, whereas sonner's <Toaster /> is not rendered anywhere in this
// app - see the note in APP-VS-BROWSER.md.
import { toast } from "react-toastify";

type Props = {
  title?: string;
  value?: File;
  /**
   * Widened from `(val: File) => void` so the field can be cleared. Callers
   * pass react-hook-form's `field.onChange`, which already accepts anything,
   * so every existing call site is unaffected.
   */
  onChange?: (val: File | undefined) => void;
  onBlur?: () => void;
  description?: string;
  /** Opt out where a photo makes no sense (a signed PDF contract, say). */
  allowCamera?: boolean;
};

// Two ways in, because "upload your IT letter" and "upload your CV" are
// usually a piece of paper somebody is holding, not a file they already
// have on their phone. Hunting for a file you never created is the friction
// this removes.
//
// The camera route differs by runtime and both are needed:
//
//   native  captureWithNativeCamera() -> the Capacitor Camera plugin. The
//           shell loads a remote origin, so a page-driven <input capture>
//           there depends on the WebView's file-chooser and permission
//           delegation - the plugin is the reliable path.
//   web     <input type="file" accept="image/*" capture="environment">.
//           Mobile browsers open the camera straight away.
//
// The button is hidden on pointer:fine devices (see canOfferCamera): on a
// desktop browser `capture` is ignored and it would just be a second,
// identical file dialog.
export const FileUploadThing = ({
  title,
  value,
  onChange,
  onBlur,
  description,
  allowCamera = true,
}: Props) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  // Resolved after mount: canOfferCamera() reads matchMedia and the
  // Capacitor bridge, neither of which exists during SSR. Starting false
  // means the server and first client render agree.
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (allowCamera) setShowCamera(canOfferCamera());
  }, [allowCamera]);

  // Object URLs are held until revoked. Without the cleanup, every retake
  // leaks a copy of the image for the life of the page.
  useEffect(() => {
    if (!value || !value.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const accept = ".pdf,.jpg,.jpeg,.png,.webp";

  const takePhoto = async () => {
    if (busy) return;

    // Fall straight to the <input capture> when there's no plugin - an
    // installed PWA or a plain mobile browser. Deciding this up front keeps
    // "no bridge" separate from "user cancelled", which the plugin reports
    // the same way; popping the file chooser open the instant someone
    // presses back reads as the app ignoring them.
    if (!hasNativeCamera()) {
      cameraInput.current?.click();
      return;
    }

    setBusy(true);
    try {
      const result = await captureWithNativeCamera(
        title?.toLowerCase().includes("cv") ? "cv" : "document"
      );

      if (result.file) {
        haptic("success");
        onChange?.(result.file);
        return;
      }

      // A cancel needs no feedback - the user is looking at the form again
      // with nothing changed, which is what they asked for. A denied
      // permission does: it can't be fixed from in here, and staying silent
      // leaves them tapping a button that appears broken.
      if (result.reason === "denied") {
        toast.error(
          "Camera access is off for PlaceIT. You can turn it on in your phone's settings, or choose a file instead."
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center px-4 py-4 hover:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30"
        )}
      >
        {preview ? (
          // next/image can't do anything with a blob: URL - no loader, no
          // optimisation, and it would throw on an unconfigured host. This
          // is a local preview of a file the user just picked.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="mb-2 h-20 w-auto rounded-lg object-cover"
          />
        ) : (
          <div className="mb-2 flex items-center justify-center rounded-full border bg-white p-2.5">
            <FileUpIcon size={16} className="text-primary" />
          </div>
        )}

        <h1 className="text-sm font-semibold text-primary">
          {title || "Upload file"}
        </h1>

        <p className="mt-0.5 text-center text-xs text-gray-500">
          {value ? `Selected: ${value.name}` : "Choose a file or take a photo"}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold text-primary"
          >
            {value ? "Change file" : "Choose file"}
          </button>

          {showCamera && (
            <button
              type="button"
              onClick={takePhoto}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              <CameraIcon size={13} />
              {busy ? "Opening..." : value ? "Retake" : "Take photo"}
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange?.(undefined);
                onBlur?.();
              }}
              className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium text-gray-500"
            >
              <XIcon size={13} />
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInput}
          type="file"
          className="hidden"
          onBlur={onBlur}
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange?.(file);
            // Reset so picking the SAME file twice still fires change - the
            // input compares values, and after a Remove the user very
            // plausibly reselects what they just cleared.
            e.target.value = "";
          }}
        />

        {/* Web camera path. `capture` is a hint: Android and iOS honour it,
            desktop ignores it - which is why the button that triggers this
            is hidden there. */}
        <input
          ref={cameraInput}
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          onBlur={onBlur}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            e.target.value = "";
            setBusy(true);
            try {
              haptic("success");
              // Camera files arrive named "image.jpg" or with no name at
              // all, which is unhelpful next to three other uploads in the
              // same form - and straight off a modern sensor they can be
              // larger than the 10MB the schema accepts. downscaleImage
              // handles both, and returns the original untouched if any of
              // it fails.
              onChange?.(await downscaleImage(file, photoFilename("document")));
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground flex-wrap ml-1">
        {description ||
          "Max file size: 10MB. Accepted formats: PDF, JPG, PNG, WEBP."}
      </p>
    </>
  );
};
