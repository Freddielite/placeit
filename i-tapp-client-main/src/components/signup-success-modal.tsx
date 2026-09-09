"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";

/**
 * Shown for a beat after a successful signup, then it sends the person to the
 * login screen itself.
 *
 * The redirect lives HERE rather than in each form's `onSuccess`. If the form
 * redirects and also renders this, the route changes immediately and the modal
 * is unmounted before anyone reads it - which is the behaviour this replaces.
 * So each form's job is now just `setShowSuccess(true)`.
 *
 * There is no close button by design: the answer to "how should it behave" was
 * fully automatic. `redirectTo` is still driven by the caller because company
 * accounts log in at a different route from students and corps members.
 */
export function SignupSuccessModal({
  title = "Congratulations!",
  message,
  redirectTo,
  delayMs = 3000,
}: {
  title?: string;
  message: string;
  redirectTo: string;
  delayMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(redirectTo), delayMs);
    return () => clearTimeout(timer);
  }, [router, redirectTo, delayMs]);

  // The page underneath is still scrollable otherwise, which looks broken
  // while a blocking overlay is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Logo className="h-8 w-auto" />
        </div>

        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
        </div>

        <h2
          id="signup-success-title"
          className="mb-3 text-center text-2xl font-bold text-gray-900"
        >
          {title}
        </h2>

        {/* aria-live so a screen reader announces this even though the dialog
            disappears on its own a few seconds later. */}
        <p
          aria-live="polite"
          className="text-center text-sm leading-relaxed text-gray-500"
        >
          {message}
        </p>

        <div className="mt-7">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="signup-success-bar h-full rounded-full bg-primary"
              style={{ animationDuration: `${delayMs}ms` }}
            />
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            Taking you to the login page…
          </p>
        </div>
      </div>

      {/* Scoped to this component, so it doesn't need a globals.css entry. The
          bar is decorative, hence reduced-motion just leaves it filled. */}
      <style>{`
        @keyframes signup-success-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .signup-success-bar {
          transform-origin: left;
          animation-name: signup-success-fill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .signup-success-bar { animation: none; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
