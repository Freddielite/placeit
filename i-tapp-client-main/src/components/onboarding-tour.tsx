"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Card = {
  icon: string;
  title: string;
  description: string;
  accent: string;
};

const studentCards: Card[] = [
  {
    icon: "🎯",
    title: "Find Your Placement",
    description:
      "Browse verified industrial training opportunities from top Nigerian companies. Filter by location, industry, duration, and stipend to find your perfect match.",
    accent: "from-blue-50 to-indigo-50 border-blue-100",
  },
  {
    icon: "📄",
    title: "One Profile, Many Applications",
    description:
      "Build your student profile once — your field of study, skills, and documents — then apply to multiple companies instantly without re-entering information.",
    accent: "from-violet-50 to-purple-50 border-violet-100",
  },
  {
    icon: "📊",
    title: "Track Every Application",
    description:
      "Your dashboard shows every application you've submitted — pending, accepted, or declined — in real time. No more chasing emails or calling HR departments.",
    accent: "from-emerald-50 to-teal-50 border-emerald-100",
  },
  {
    icon: "🏢",
    title: "Verified Companies Only",
    description:
      "Every company on PlaceIT is reviewed before listing. Look out for the blue verification badge — it means the placement is legitimate and professionally managed.",
    accent: "from-amber-50 to-yellow-50 border-amber-100",
  },
  {
    icon: "🎉",
    title: "You're All Set!",
    description:
      "Your account is ready. Start by browsing available opportunities or complete your profile to improve your chances of getting selected.",
    accent: "from-primary/5 to-primary/10 border-primary/20",
  },
];

const companyCards: Card[] = [
  {
    icon: "📢",
    title: "Post Opportunities",
    description:
      "Create detailed placement listings — set requirements, duration, stipend, and preferred fields. Your roles go live immediately to thousands of verified students.",
    accent: "from-blue-50 to-indigo-50 border-blue-100",
  },
  {
    icon: "👥",
    title: "Review Applicants",
    description:
      "Browse student profiles, view resumes and school letters, and manage all applicants for each role from a single dashboard — no emails, no spreadsheets.",
    accent: "from-violet-50 to-purple-50 border-violet-100",
  },
  {
    icon: "✉️",
    title: "Send Offers Instantly",
    description:
      "Accept a student and send them an official placement offer directly through the platform. They're notified immediately and can accept or decline in-app.",
    accent: "from-emerald-50 to-teal-50 border-emerald-100",
  },
  {
    icon: "📈",
    title: "Manage Your Interns",
    description:
      "Track all active placements, start and end dates, and student progress from your company dashboard. Built for HR teams and department managers alike.",
    accent: "from-amber-50 to-yellow-50 border-amber-100",
  },
  {
    icon: "🚀",
    title: "Ready to Go!",
    description:
      "Your company account is active. Complete your profile to increase trust with students, then post your first placement opportunity.",
    accent: "from-primary/5 to-primary/10 border-primary/20",
  },
];

const STORAGE_KEYS = {
  student: "itapp_tour_student",
  company: "itapp_tour_company",
} as const;

export function OnboardingTour({ role }: { role: "student" | "company" }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const cards = role === "student" ? studentCards : companyCards;
  const storageKey = STORAGE_KEYS[role];
  const isLast = step === cards.length - 1;

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setVisible(true);
    }
  }, [storageKey]);

  const dismiss = useCallback(() => {
    localStorage.setItem(storageKey, "1");
    setExiting(true);
    setTimeout(() => setVisible(false), 300);
  }, [storageKey]);

  const next = useCallback(() => {
    if (isLast) {
      dismiss();
      return;
    }
    setStep((s) => s + 1);
  }, [isLast, dismiss]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!visible) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, next, prev, dismiss]);

  if (!visible) return null;

  const card = cards[step];

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      {/* Card modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl
          transition-all duration-300
          ${exiting ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        {/* Skip button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card content */}
        <div
          key={step}
          className={`rounded-t-3xl bg-gradient-to-br border-b ${card.accent} px-8 pt-10 pb-8 flex flex-col items-center text-center gap-4`}
          style={{ animation: "slideIn 0.25s ease-out" }}
        >
          <span className="text-5xl leading-none select-none">{card.icon}</span>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {card.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[320px]">
            {card.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex flex-col gap-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-5 h-2 bg-primary"
                    : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              disabled={step === 0}
              className="gap-1.5 text-gray-400 disabled:opacity-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>

            <Button
              size="sm"
              onClick={next}
              className="gap-1.5 min-w-28 bg-primary text-white hover:bg-primary/90 font-semibold rounded-xl shadow-sm shadow-primary/20"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link */}
          {!isLast && (
            <button
              onClick={dismiss}
              className="text-xs text-gray-400 hover:text-gray-500 text-center transition-colors"
            >
              Skip tour
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
