"use client";
import Link from "next/link";
import { CompanyInfo1 } from "./company-info-1";

export function CompanyOnboardingForm() {
  return (
    <div className="w-full max-w-[350px] m-auto flex flex-col">
      <div className="flex flex-col gap-4 items-center mb-4">
        <h1 className="text-2xl font-bold">Tell us about your company</h1>
      </div>
      <CompanyInfo1 />
      <div className="flex items-center flex-col gap-2">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
