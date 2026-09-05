"use client";

import { usePersona } from "@/app/(site)/_context/persona";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { Zap, ArrowRight, FileText, Mail, CheckCircle2, Star } from "lucide-react";

const steps = [
  { icon: <FileText className="w-4 h-4" />, label: "Upload your resume" },
  { icon: <Zap className="w-4 h-4" />, label: "Set your skills & state" },
  { icon: <Mail className="w-4 h-4" />, label: "We cold-email matching companies" },
  { icon: <CheckCircle2 className="w-4 h-4" />, label: "Companies respond to you" },
];

export function BulkApply() {
  const { persona } = usePersona();
  if (persona !== "corps") return null;

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-8 sm:px-14 py-14 sm:py-20">
          {/* Decorative */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary/5 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
            {/* Left */}
            <div className="flex-1 flex flex-col gap-6 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Pro Feature
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1.5 rounded-full">
                  Corps Members Only
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  BulkApply —{" "}
                  <span className="text-primary">We reach out</span>{" "}
                  for you
                </h2>
                <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
                  Upload your resume, set your skills and location. We cold-email matching companies and PPA hosts on your behalf — so you stand the best chance of landing a placement, even from camp.
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
                  <Zap className="w-4 h-4" />
                  Activate BulkApply
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-gray-600 text-xs">
                Available as a premium add-on. Pricing details available after signup.
              </p>
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

              {/* Floating result badge */}
              <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Sent to 24 companies</p>
                  <p className="text-gray-500 text-[12px]">3 responses received · 1 acceptance pending</p>
                </div>
                <span className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
