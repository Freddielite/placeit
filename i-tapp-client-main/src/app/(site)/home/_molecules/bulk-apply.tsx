"use client";

import { usePersona } from "@/app/(site)/_context/persona";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { UserPlus, ArrowRight, FileText, Send, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: <UserPlus className="w-4 h-4" />, label: "Signup" },
  { icon: <FileText className="w-4 h-4" />, label: "Upload your document" },
  { icon: <Send className="w-4 h-4" />, label: "Apply to opportunities" },
  { icon: <CheckCircle2 className="w-4 h-4" />, label: "Secure PPA" },
];

export function BulkApply() {
  const { persona } = usePersona();
  if (persona !== "corps") return null;

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* `theme-static`: this panel is dark BY DESIGN, not because the page
            is. Without it the gray-950/900 gradient inverts to near-white in
            dark mode while the `text-white` on top stays white. */}
        <div className="theme-static relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-8 sm:px-14 py-14 sm:py-20">
          {/* Decorative */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary/5 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
            {/* Left */}
            <div className="flex-1 flex flex-col gap-6 max-w-lg">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Secure Your PPA in{" "}
                  <span className="text-primary">4 Simple Steps</span>
                </h2>
                <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
                  Sign up, upload your document, and apply to state-matched PPA opportunities from verified companies — all from one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/welcome"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 font-bold rounded-xl shadow-lg shadow-primary/30"
                  )}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — visual flow */}
            <div className="flex-1 w-full max-w-sm lg:max-w-none">
              <div className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-5 py-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                      {step.icon}
                    </div>
                    <p className="text-sm font-medium text-white/80">{step.label}</p>
                    {i < steps.length - 1 && (
                      <div className="ml-auto text-gray-600">
                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    )}
                    {i === steps.length - 1 && (
                      <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                        Done ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
