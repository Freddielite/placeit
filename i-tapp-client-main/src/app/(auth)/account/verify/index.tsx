"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetchVerifyEmail } from "@/queries/auth";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const { data, isLoading, error } = useFetchVerifyEmail(token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm font-medium text-red-600">Missing token.</p>
          <p className="text-xs text-muted-foreground">
            Please open the verification link from your email again.
          </p>
          <Link
            href="/resend-verification"
            className="inline-block pt-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            Resend verification email
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <Centered>Verifying...</Centered>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm font-medium text-red-600">
            Verification failed. Invalid or expired token.
          </p>
          <p className="text-xs text-muted-foreground">
            Please request a new verification email.
          </p>
          <Link
            href="/resend-verification"
            className="inline-block pt-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            Resend verification email
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-sm font-medium">Email verified successfully.</p>
        <p className="text-xs text-muted-foreground">Redirecting to login...</p>
        <Link
          href="/login"
          className="inline-block pt-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
