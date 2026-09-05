"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {}, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We couldn&apos;t load this page. Please try again or return to the
            dashboard.
          </p>
          {process.env.NEXT_PUBLIC_APP_ENV === "development" && error?.message && (
            <p className="mt-3 rounded-lg bg-red-50 border border-red-100 px-4 py-2 text-xs text-red-700 text-left font-mono break-all">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RotateCcw size={16} />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/portal/")}
            className="gap-2"
          >
            <LayoutDashboard size={16} />
            Back to Dashboard
          </Button>
        </div>

        {error?.digest && (
          <p className="text-xs text-muted-foreground">
            Error ID: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}
