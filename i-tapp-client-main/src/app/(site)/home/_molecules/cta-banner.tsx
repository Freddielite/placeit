"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Shield, Building2, Sparkles } from "lucide-react";
import { usePersona } from "@/app/(site)/_context/persona";

const content = {
  default: {
    eyebrow: "Free to get started",
    title: "Stop searching.\nStart getting placed.",
    desc: "Thousands of Nigerian students and corps members found their placements on PlaceIT. Sign up in minutes — no CV printing, no cold emails, no walk-ins.",
    cta1: { label: "Find my SIWES placement", href: "/welcome", icon: <GraduationCap className="w-4 h-4" /> },
    cta2: { label: "Find my PPA", href: "/corps/signup", icon: <Shield className="w-4 h-4" /> },
    cta3: { label: "I'm a company", href: "/company/signup", icon: <Building2 className="w-4 h-4" /> },
  },
  student: {
    eyebrow: "Free to get started",
    title: "Stop cold-emailing.\nStart getting placed.",
    desc: "Thousands of Nigerian students found their SIWES placement on PlaceIT. Sign up in minutes — no CV printing, no walk-ins.",
    cta1: { label: "Create free account", href: "/welcome", icon: <Sparkles className="w-4 h-4" /> },
    cta2: { label: "Browse opportunities", href: "/opportunities", icon: <ArrowRight className="w-4 h-4" /> },
    cta3: null,
  },
  corps: {
    eyebrow: "Camp window is short",
    title: "Don't leave camp\nwithout a PPA.",
    desc: "The 3-week window moves fast. Browse state-matched PPA opportunities now and apply before spots fill up.",
    cta1: { label: "Find my PPA now", href: "/corps/signup", icon: <Shield className="w-4 h-4" /> },
    cta2: { label: "Browse PPAs", href: "/opportunities?type=ppa", icon: <ArrowRight className="w-4 h-4" /> },
    cta3: null,
  },
  company: {
    eyebrow: "Free to list",
    title: "List your first\nopportunity today.",
    desc: "Reach thousands of verified students and corps members. Admin-assisted listing available. Live within 48 hours.",
    cta1: { label: "List opportunities", href: "/company/signup", icon: <Building2 className="w-4 h-4" /> },
    cta2: { label: "See how it works", href: "#how-it-works", icon: <ArrowRight className="w-4 h-4" /> },
    cta3: null,
  },
};

export function CtaBanner() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const c = content[key];

  return (
    <section className="bg-primary relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

          {/* Left: text */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              {c.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight whitespace-pre-line">
              {c.title}
            </h2>
            <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">{c.desc}</p>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-3 shrink-0">
            {/* Primary CTA */}
            <Link
              href={c.cta1.href}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-primary text-base font-black hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20"
            >
              {c.cta1.icon}
              {c.cta1.label}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href={c.cta2.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              {c.cta2.icon}
              {c.cta2.label}
            </Link>

            {/* Tertiary (default only) — de-emphasized */}
            {c.cta3 && (
              <Link
                href={c.cta3.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-2xl text-white/40 text-xs font-medium hover:text-white/60 transition-colors duration-200"
              >
                {c.cta3.icon}
                {c.cta3.label}
              </Link>
            )}

            <p className="text-center text-[11px] text-white/40 mt-1">No credit card. No setup fee.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
