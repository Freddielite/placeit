"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">
            An error occurred. Please try again.
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
          <Button variant="outline" onClick={() => router.push("/signin")}>
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
