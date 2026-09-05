import React, { Suspense } from "react";
import AuthLayoutUi from "@/components/layouts/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayoutUi>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </AuthLayoutUi>
  );
}
