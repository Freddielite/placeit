"use client";

import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { onBoardCompany } from "@/actions";
import { onBoardCompanySchema, OnboardingData } from "@/schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Facts from "./_molecules/facts";
import OnboardingForm from "./_molecules/company-profile";

export default function OnboardingPage() {
  const router = useRouter();

  const { execute, hasErrored, result, isExecuting } = useAction(
    onBoardCompany,
    {
      onSuccess: () => {
        toast.success(
          "Onboarding submitted! Your account will be reviewed shortly.",
        );
        router.replace("/portal/dashboard");
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Onboarding failed. Please try again.");
      },
    },
  );

  async function skip() {
    router.replace("/portal/dashboard");
    await fetch("/api/company/onboarding/skip", { method: "POST" });
  }

  function handleSubmit(data: OnboardingData) {
    const parsed = onBoardCompanySchema.safeParse(data);
    if (!parsed.success) return;
    execute(parsed.data);
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col w-72 shrink-0 gap-4">
          <div>
            <div className="text-2xl font-semibold">Welcome, Company! 👋</div>
            <p className="text-sm text-gray-600 mt-2">
              Complete the required fields to get started. Optional fields can
              be filled in later from your profile.
            </p>
          </div>
          <Facts />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 rounded-xl border overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b flex items-start justify-between gap-4">
            <div>
              <h1 className="font-semibold text-xl">Company Onboarding</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Fields marked{" "}
                <span className="text-red-600 font-medium">Required</span> must
                be completed before you can access the platform.
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-auto px-2 py-1 text-sm shrink-0"
              onClick={skip}
            >
              Skip for now
            </Button>
          </div>

          {/* Error banner */}
          {hasErrored && (
            <div className="mx-4 md:mx-6 mt-4 rounded-lg bg-red-100 text-red-800 text-sm px-4 py-3">
              {result?.serverError ||
                "An error occurred while submitting. Please try again."}
            </div>
          )}

          {/* Form body */}
          <div className="px-4 md:px-6 py-4 overflow-y-auto flex-1">
            <OnboardingForm onSubmit={handleSubmit} />
          </div>

          <Hr />

          {/* Footer */}
          <div className="p-4 md:p-6 pt-3 flex justify-end">
            <Button
              form="onboarding-form"
              type="submit"
              className="min-w-40"
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  Submitting...
                  <div className="ml-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
