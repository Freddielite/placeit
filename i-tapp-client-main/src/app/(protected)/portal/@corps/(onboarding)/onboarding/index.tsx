"use client";

import { cn } from "@/utils/tailwind";
import { useMemo, useState } from "react";
import CorpsPersonalInfoStep from "./_molecules/personal-info";
import CorpsNyscInfoStep from "./_molecules/nysc-info";
import CorpsSkillsStep from "./_molecules/skills";
import CorpsDocumentStep from "./_molecules/documents";
import { Step } from "@/types/wizard";
import { corpsOnboardingSchema } from "@/schemas";
import { useAction } from "next-safe-action/hooks";
import { onBoardCorps } from "@/actions";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, CheckCircle2, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";
import { Logo } from "@/components/logo";
import { useFetchMyProfile } from "@/hooks/query";

const FORM_IDS = [
  "corps-personal-info-form",
  "corps-nysc-info-form",
  "corps-skills-form",
  "corps-documents-form",
] as const;

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function CorpsOnboardingPage() {
  const router = useRouter();
  const logout = useLogout();
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { data: profile } = useFetchMyProfile();

  const userName = profile?.user?.name ?? profile?.corps?.name ?? "";

  const steps: Step[] = useMemo(() => [
    { title: "Personal Info", description: "Your name, phone number and gender.", component: CorpsPersonalInfoStep },
    { title: "NYSC Details", description: "Deployment state, reg number and academic background.", component: CorpsNyscInfoStep },
    { title: "Skills", description: "Tech skills, soft skills and industry interests.", component: CorpsSkillsStep },
    { title: "Documents", description: "Upload your call-up letter and CV.", component: CorpsDocumentStep },
  ], []);

  const { execute, isExecuting, hasErrored, result } = useAction(onBoardCorps, {
    onSuccess: () => {
      setIsComplete(true);
      setTimeout(() => { router.refresh(); router.push("/portal/find-ppa"); }, 2200);
    },
    onError: () => {},
  });

  const activeFormId = FORM_IDS[currentStep];
  const isLast = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep]?.component;
  const progress = isComplete ? 100 : ((currentStep + 1) / steps.length) * 100;

  const handleNext = (data: any) => {
    const merged = { ...onboardingData, ...data };
    if (isLast) {
      const parse = corpsOnboardingSchema.safeParse(merged);
      if (!parse.success) return;
      execute(parse.data);
    } else {
      setOnboardingData(merged);
      setCurrentStep((p) => p + 1);
    }
  };

  const handleSkip = () => {
    if (isLast) router.push("/portal/find-ppa");
    else setCurrentStep((p) => p + 1);
  };

  /* ── Completion screen ── */
  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-[zoomIn_0.4s_ease-out]">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6 stroke-[1.5]" />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {userName ? `You're all set, ${userName.split(" ")[0]}!` : "You're all set!"}
          </h1>
          <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto leading-relaxed">
            Your corps profile is ready. Taking you to find your PPA now.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
        <style>{`@keyframes zoomIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top bar */}
      <header className="h-14 border-b flex items-center px-5 sm:px-8 shrink-0 bg-white z-10">
        <Logo className="mix-blend-multiply" />
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden sm:block text-xs text-gray-400 font-medium">
            {steps[currentStep]?.title}
          </span>
          <div className="flex items-center gap-2.5">
            <div className="w-32 sm:w-44 h-[3px] bg-gray-100 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-bold text-primary tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{getInitials(userName)}</span>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 border-r flex-col py-10 px-6 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 px-1">Corps Setup</p>

          <div className="flex flex-col">
            {steps.map((step, index) => {
              const isDone = currentStep > index;
              const isActive = currentStep === index;
              const isLastStep = index === steps.length - 1;
              return (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-6 h-6 flex items-center justify-center shrink-0 text-[10px] font-bold border-2 transition-all z-10",
                      isDone && "bg-primary border-primary text-white",
                      isActive && "border-primary text-primary bg-white scale-110",
                      !isActive && !isDone && "border-gray-200 text-gray-300 bg-white",
                    )}>
                      {isDone ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    {!isLastStep && (
                      <div className={cn(
                        "w-px flex-1 min-h-[2rem] mt-1 transition-colors duration-300",
                        isDone ? "bg-primary" : "bg-gray-200",
                      )} />
                    )}
                  </div>
                  <div className={cn("pb-6", isLastStep && "pb-0")}>
                    <p className={cn(
                      "text-sm font-semibold leading-tight mt-0.5 transition-colors",
                      isActive ? "text-gray-900" : isDone ? "text-gray-500" : "text-gray-300",
                    )}>
                      {step.title}
                    </p>
                    {isActive && (
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Your profile is used to match you with PPA opportunities in your deployment state. Takes about 3 minutes.
            </p>
          </div>
        </aside>

        {/* Main — dot-grid background */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Mobile stepper */}
          <div className="flex lg:hidden items-center gap-0 border-b overflow-x-auto shrink-0 bg-white">
            {steps.map((step, index) => {
              const isDone = currentStep > index;
              const isActive = currentStep === index;
              return (
                <div key={step.title} className={cn(
                  "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold shrink-0 transition-colors",
                  isActive ? "border-primary text-primary" : "border-transparent text-gray-400",
                )}>
                  {isDone && <Check className="w-3 h-3" />}
                  {step.title}
                </div>
              );
            })}
          </div>

          {/* Form surface */}
          <div className="w-full max-w-2xl mx-auto my-8 px-4">
            <div
              key={currentStep}
              className="bg-white border border-gray-200 px-6 sm:px-10 pt-8 pb-10 animate-[slideIn_0.25s_ease-out]"
            >
              {/* Step heading */}
              <div className="mb-8 pl-4 border-l-4 border-primary">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                  Step {currentStep + 1} of {steps.length}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {steps[currentStep]?.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1.5">
                  {steps[currentStep]?.description}
                </p>
              </div>

              {hasErrored && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3">
                  {result.serverError || "Something went wrong. Please try again."}
                </div>
              )}

              {CurrentStepComponent ? (
                <CurrentStepComponent
                  onNext={handleNext}
                  onBack={() => setCurrentStep((p) => Math.max(p - 1, 0))}
                />
              ) : (
                <p className="text-sm text-gray-400">This step is not yet available.</p>
              )}

              {/* Actions */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((p) => p - 1)}
                      className="cursor-pointer px-5 py-2.5 border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    form={activeFormId}
                    type="submit"
                    disabled={isExecuting}
                    className="cursor-pointer inline-flex items-center gap-2 px-8 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isExecuting
                      ? "Submitting..."
                      : isLast
                        ? "Complete Setup"
                        : <> Continue <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
