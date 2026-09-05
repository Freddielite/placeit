"use client";

import Link from "next/link";
import { cn } from "@/utils/tailwind";
import { ArrowRight, GraduationCap, Shield, Building2, ChevronRight } from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";
import { useState } from "react";

const tabs: { value: Exclude<Persona, null>; label: string; icon: React.ReactNode; color: string; rgb: string }[] = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" />, color: "#477dc0", rgb: "71,125,192" },
  { value: "corps", label: "Corps Member", icon: <Shield className="w-4 h-4" />, color: "#059669", rgb: "5,150,105" },
  { value: "company", label: "Company", icon: <Building2 className="w-4 h-4" />, color: "#7c3aed", rgb: "124,58,237" },
];

const steps = {
  student: [
    {
      number: "01",
      title: "Sign up in minutes",
      description: "Create your account, verify your student status, and unlock the full platform — no paperwork, no stress.",
      tag: "Free forever",
    },
    {
      number: "02",
      title: "Build your profile",
      description: "Drop in your field of study, skills, and location. Your profile becomes your digital CV — companies see it the moment you apply.",
      tag: "One profile",
    },
    {
      number: "03",
      title: "Apply & get placed",
      description: "Browse verified SIWES listings, send applications in one tap, and track everything live until your offer lands.",
      tag: "Real-time tracking",
    },
  ],
  corps: [
    {
      number: "01",
      title: "Register with your state code",
      description: "Sign up with your NYSC call-up number and state code. We instantly filter PPAs to your posted state — only relevant listings.",
      tag: "State-matched",
    },
    {
      number: "02",
      title: "Browse & shortlist PPAs",
      description: "Scroll through verified, immediately-available PPA slots. Shortlist your top picks before camp closes.",
      tag: "Camp-mode ready",
    },
    {
      number: "03",
      title: "Apply or use BulkApply",
      description: "Apply directly, or let BulkApply do the heavy lifting — we cold-email matching companies on your behalf.",
      tag: "BulkApply available",
    },
  ],
  company: [
    {
      number: "01",
      title: "Register & get verified",
      description: "Sign up with your CAC number. We review and verify your company — your badge goes live within 48 hours.",
      tag: "CAC-verified",
    },
    {
      number: "02",
      title: "List your openings",
      description: "Post SIWES or PPA slots in minutes. Set requirements, duration, and slots. Goes live instantly.",
      tag: "Instant listing",
    },
    {
      number: "03",
      title: "Review & accept talent",
      description: "Applications land on your dashboard. Shortlist, review profiles, and accept — all in one clean view.",
      tag: "Dashboard managed",
    },
  ],
};

const ctaLinks = {
  student: { href: "/welcome", label: "Start for free" },
  corps: { href: "/corps/signup", label: "Find my PPA" },
  company: { href: "/company/signup", label: "List opportunities" },
};

export function HowItWorks() {
  const { persona, setPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<Exclude<Persona, null>>(
    (persona as Exclude<Persona, null>) ?? "student"
  );

  function selectTab(tab: Exclude<Persona, null>) {
    setActiveTab(tab);
    setPersona(tab);
  }

  const currentTab = (persona as Exclude<Persona, null>) ?? activeTab;
  const currentSteps = steps[currentTab];
  const cta = ctaLinks[currentTab];
  const activeTabMeta = tabs.find((t) => t.value === currentTab)!;

  return (
    <section id="how-it-works" className="bg-slate-50 relative overflow-hidden border-t border-gray-100">
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%)",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at top, rgba(${activeTabMeta.rgb},0.08) 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-32">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border mb-4"
              style={{ color: activeTabMeta.color, background: `rgba(${activeTabMeta.rgb},0.12)`, borderColor: `rgba(${activeTabMeta.rgb},0.25)` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeTabMeta.color }} />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black text-gray-950 leading-tight tracking-tight">
              Three steps.<br />
              <span style={{ color: activeTabMeta.color }}>Zero confusion.</span>
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-2xl p-1.5 self-start sm:self-auto hide-scrollbar overflow-x-auto shrink-0 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => selectTab(tab.value)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all duration-200",
                  currentTab === tab.value
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                style={currentTab === tab.value ? { background: tab.color } : {}}
              >
                {tab.icon}
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Steps — vertical on mobile, horizontal on desktop */}
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-[60px] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px z-0"
            style={{ background: `linear-gradient(90deg, transparent, rgba(${activeTabMeta.rgb},0.3), transparent)` }}
          />

          <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
            {currentSteps.map((step, i) => (
              <div key={`${currentTab}-${i}`} className="relative flex-1 group">

                {/* Mobile: vertical line connector */}
                {i < currentSteps.length - 1 && (
                  <div
                    className="lg:hidden absolute left-[27px] top-[56px] w-px h-[calc(100%-16px)] z-0"
                    style={{ background: `linear-gradient(to bottom, rgba(${activeTabMeta.rgb},0.5), transparent)` }}
                  />
                )}

                <div className="relative z-10 flex flex-row lg:flex-col gap-5 lg:gap-6 p-1 lg:p-0">
                  {/* Number badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
                    style={{ background: `rgba(${activeTabMeta.rgb},0.12)`, border: `1px solid rgba(${activeTabMeta.rgb},0.25)` }}
                  >
                    <span
                      className="text-2xl font-black tracking-tighter"
                      style={{ color: activeTabMeta.color }}
                    >
                      {step.number}
                    </span>
                    {/* Ghost large number */}
                    <span
                      className="absolute -right-1 -bottom-2 text-5xl font-black leading-none select-none pointer-events-none opacity-10"
                      style={{ color: activeTabMeta.color }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2 pt-1 lg:pt-0 pb-8 lg:pb-0">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: activeTabMeta.color }}
                    >
                      {step.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>

                  {/* Desktop: arrow between steps */}
                  {i < currentSteps.length - 1 && (
                    <ChevronRight
                      className="hidden lg:block absolute -right-4 top-[18px] w-5 h-5 z-10 text-gray-600"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: activeTabMeta.color,
              boxShadow: `0 6px 24px rgba(${activeTabMeta.rgb},0.4)`,
            }}
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400">No credit card. No setup fee. Start free.</p>
        </div>
      </div>
    </section>
  );
}
