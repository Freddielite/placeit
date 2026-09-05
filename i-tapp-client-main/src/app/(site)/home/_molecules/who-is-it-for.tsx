"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Shield, Building2, CheckCircle2 } from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";
import { cn } from "@/utils/tailwind";

const personas = [
  {
    value: "student" as Persona,
    icon: <GraduationCap className="w-6 h-6" />,
    label: "I'm a Student",
    sub: "Looking for SIWES / IT placement",
    color: "#477dc0",
    rgb: "71,125,192",
    bg: "bg-primary/5",
    border: "border-primary/15",
    activeBorder: "border-primary",
    iconBg: "bg-primary/10 text-primary",
    perks: [
      "Matched to verified companies by field & location",
      "Apply to multiple listings from one profile",
      "Track every application in real time",
      "Free to get started — no hidden fees",
    ],
    cta: { label: "Find my placement", href: "/welcome" },
  },
  {
    value: "corps" as Persona,
    icon: <Shield className="w-6 h-6" />,
    label: "I'm a Corps Member",
    sub: "Looking for NYSC PPA",
    color: "#059669",
    rgb: "5,150,105",
    bg: "bg-emerald-50/60",
    border: "border-emerald-100",
    activeBorder: "border-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    perks: [
      "State-code matched PPA listings — no irrelevant results",
      "Camp mode: only immediately-available slots",
      "BulkApply: we cold-email companies for you",
      "PPA switch support if you need a fresh start",
    ],
    cta: { label: "Find my PPA", href: "/corps/signup" },
  },
  {
    value: "company" as Persona,
    icon: <Building2 className="w-6 h-6" />,
    label: "I'm a Company",
    sub: "Looking to hire placement talent",
    color: "#7c3aed",
    rgb: "124,58,237",
    bg: "bg-violet-50/60",
    border: "border-violet-100",
    activeBorder: "border-violet-500",
    iconBg: "bg-violet-50 text-violet-600",
    perks: [
      "Access SIWES students and NYSC corps members in one place",
      "CAC-verified listing — builds instant applicant trust",
      "Admin-assisted listing if you'd rather not DIY",
      "Free to list — no setup fee, live within 48h",
    ],
    cta: { label: "List opportunities", href: "/company/signup" },
  },
];

export function WhoIsItFor() {
  const { persona, setPersona } = usePersona();

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Who is PlaceIT for?</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight">
            Built for <span className="text-primary">everyone</span> in the placement chain
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            Pick your role below — the entire platform adapts to you.
          </p>
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {personas.map((p) => {
            const isActive = persona === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setPersona(isActive ? null : p.value)}
                aria-pressed={isActive}
                className={cn(
                  "group text-left rounded-3xl border-2 p-7 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1",
                  p.bg,
                  isActive
                    ? cn(p.activeBorder, "shadow-[0_12px_40px_rgba(0,0,0,0.10)]")
                    : cn(p.border, "hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]")
                )}
              >
                {/* Icon + label */}
                <div className="flex items-start justify-between gap-3">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", p.iconBg)}>
                    {p.icon}
                  </div>
                  {isActive && (
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white shrink-0"
                      style={{ background: p.color }}
                    >
                      Selected
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900">{p.label}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{p.sub}</p>
                </div>

                {/* Perks */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: p.color }}
                        aria-hidden="true"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={p.cta.href}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 hover:gap-3"
                  style={{ color: p.color }}
                >
                  {p.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
