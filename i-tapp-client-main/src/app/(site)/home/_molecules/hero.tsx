"use client";

import Link from "next/link";
import Image from "next/image";
import Boy from "@/assets/images/itapp-company.jpeg";
import Girl from "@/assets/images/itapp-company2.jpeg";
import { cn } from "@/utils/tailwind";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Shield,
  Building2,
  MapPin,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Bell,
  Star,
  Timer,
} from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";
import { useEffect, useState, useRef } from "react";

const SLIDE_DURATION = 15000;

const slides = [
  {
    persona: "student" as Persona,
    icon: <GraduationCap className="w-4 h-4" />,
    label: "Student",
    eyebrow: "Nigeria's #1 SIWES Platform",
    headline: ["Find Your", "Industrial Training", "Placement"],
    accentLine: 1,
    description:
      "Browse verified SIWES opportunities at top companies. Apply in minutes, track your applications — all from one place.",
    cta1: { label: "Get Started Free", href: "/welcome" },
    cta2: { label: "Browse Opportunities", href: "/opportunities" },
    trust: [
      "Free to get started",
      "Verified companies only",
      "Real-time tracking",
    ],
    accent: "#445DCB",
    accentRgb: "68,93,203",
    bg: "#f0f3ff",
  },
  {
    persona: "corps" as Persona,
    icon: <Shield className="w-4 h-4" />,
    label: "Corps Member",
    eyebrow: "NYSC PPA Placement",
    headline: ["Secure Your PPA", "Before Camp", "Ends"],
    accentLine: 0,
    description:
      "State-matched PPA opportunities from verified companies. Apply before camp closes — start your service year strong.",
    cta1: { label: "Find My PPA Now", href: "/corps/signup" },
    cta2: { label: "Browse PPAs", href: "/opportunities?type=ppa" },
    trust: ["State-code matched", "3-week camp mode", "BulkApply available"],
    accent: "#059669",
    accentRgb: "5,150,105",
    bg: "#f0fdf8",
  },
  {
    persona: "company" as Persona,
    icon: <Building2 className="w-4 h-4" />,
    label: "Company",
    eyebrow: "Hire Placement-Ready Talent",
    headline: ["Access Nigeria's", "Best Emerging", "Talent"],
    accentLine: 2,
    description:
      "List SIWES and NYSC PPA opportunities. Reach thousands of verified students and corps members from one dashboard.",
    cta1: { label: "List Opportunities", href: "/company/signup" },
    cta2: { label: "See How It Works", href: "#how-it-works" },
    trust: [
      "SIWES + PPA talent pool",
      "Verified applicants only",
      "Admin-assisted listing",
    ],
    accent: "#7c3aed",
    accentRgb: "124,58,237",
    bg: "#faf5ff",
  },
];

function StudentVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full flex flex-col gap-4 py-6 px-2">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-4 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0"
          style={{ borderColor: `${accent}30` }}
        >
          <Image
            src={Girl}
            alt="Student"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">Adaeze Okonkwo</p>
          <p className="text-[12px] text-gray-500 truncate">
            Computer Science · 300 Level
          </p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {["React", "Node.js", "Lagos"].map((s) => (
              <span
                key={s}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-gray-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
          SIWES
        </span>
      </div>

      {/* Opportunity card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          }}
        />
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs text-white"
              style={{ background: accent }}
            >
              AC
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900">
                Frontend Engineer Intern
              </p>
              <p className="text-[12px] text-gray-500">
                Acme Technologies · Lagos
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Open
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["Hybrid", "3 Months", "Paid"].map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-600"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-dashed border-gray-100">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              12 spots left
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" />
              Lagos
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              2d ago
            </span>
          </div>
        </div>
      </div>

      {/* Success notification — floats top-right */}
      <div className="absolute -top-2 -right-2 bg-white border border-emerald-100 rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2.5 max-w-[200px]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-900 leading-tight">
            Application Accepted!
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            Acme Technologies
          </p>
        </div>
      </div>

      {/* Active users float */}
      <div className="absolute -bottom-2 left-0 bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-md flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={Boy}
              alt=""
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={Girl}
              alt=""
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[7px] font-bold text-primary">
            +2k
          </div>
        </div>
        <span className="text-[10px] text-gray-500 font-medium">
          Students placed
        </span>
      </div>
    </div>
  );
}

function CorpsVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full flex flex-col gap-4 py-6 px-2">
      {/* Corps member profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-4 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0"
          style={{ borderColor: `${accent}30` }}
        >
          <Image
            src={Boy}
            alt="Corps member"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">Chukwuemeka Adeyemi</p>
          <p className="text-[12px] text-gray-500">
            Computer Engineering · Graduate
          </p>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
              LA/24B/1204
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-gray-500">
              Lagos State
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
            style={{ background: accent }}
          >
            In Camp
          </span>
          <span className="text-[9px] text-amber-500 font-medium">
            Seek PPA now
          </span>
        </div>
      </div>

      {/* Matched PPAs card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}18` }}
          >
            <MapPin className="w-3 h-3" style={{ color: accent }} />
          </div>
          <p className="text-xs font-bold text-gray-800">
            3 PPAs matched in Lagos
          </p>
          <span
            className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ background: accent }}
          >
            New
          </span>
        </div>
        {[
          { name: "Interswitch Group", role: "IT / Software PPA" },
          { name: "Sterling Bank", role: "Data & Analytics PPA" },
          { name: "Printivo", role: "Frontend Dev PPA" },
        ].map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-2 border-t border-gray-50 first:border-0 first:pt-0"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
              style={{
                background: `${accent}${i === 0 ? "ff" : i === 1 ? "cc" : "99"}`,
              }}
            >
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-900 truncate">
                {c.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{c.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Camp urgency badge */}
      <div className="absolute -top-2 -right-2 bg-white border border-red-100 rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Timer className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-900">
            PPA spots filling
          </p>
          <p className="text-[10px] text-amber-500 font-bold">
            Secure yours before camp ends
          </p>
        </div>
      </div>
    </div>
  );
}

function CompanyVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full flex flex-col gap-4 py-6 px-2">
      {/* Company profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-4 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
          style={{ background: accent }}
        >
          BH
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">BrandHive Nigeria</p>
          <p className="text-[12px] text-gray-500">
            Technology · Lagos, Nigeria
          </p>
        </div>
        <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      </div>

      {/* Application pipeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-gray-800">
            Marketing Intern · Applications
          </p>
          <span className="text-[10px] text-gray-400">Today</span>
        </div>
        {[
          { label: "Applied", count: 24, pct: 100, color: "bg-gray-200" },
          { label: "Reviewing", count: 11, pct: 46, color: "bg-amber-400" },
          { label: "Accepted", count: 4, pct: 17, color: "bg-emerald-500" },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 w-16 shrink-0">
              {row.label}
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-700 w-5 text-right">
              {row.count}
            </span>
          </div>
        ))}

        {/* Recent applicants */}
        <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-100">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden">
              <Image
                src={Girl}
                alt=""
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden">
              <Image
                src={Boy}
                alt=""
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold bg-gray-100 text-gray-500">
              +22
            </div>
          </div>
          <span className="text-[11px] text-gray-400 flex-1">
            Recent applicants
          </span>
          <span className="text-[10px] font-bold text-emerald-600">
            +8 today
          </span>
        </div>
      </div>

      {/* Star rating float */}
      <div className="absolute -bottom-2 left-0 bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-md flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-medium">
          Trusted by 50+ companies
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { persona, setPersona } = usePersona();
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearAll() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }

  function startAuto(idx: number) {
    clearAll();
    setProgress(0);
    let p = 0;
    const step = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => {
      p = Math.min(p + step, 100);
      setProgress(p);
    }, 50);
    timerRef.current = setInterval(
      () => animateTo((idx + 1) % slides.length, "right"),
      SLIDE_DURATION,
    );
  }

  function animateTo(idx: number, direction: "left" | "right") {
    if (idx === activeIdx) return;
    setDir(direction);
    setExiting(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setExiting(false);
      setProgress(0);
    }, 320);
  }

  useEffect(() => {
    if (!paused) startAuto(activeIdx);
    return clearAll;
  }, [activeIdx, paused]);

  useEffect(() => {
    if (persona !== null) {
      const idx = slides.findIndex((s) => s.persona === persona);
      if (idx !== -1 && idx !== activeIdx) {
        setPaused(true);
        clearAll();
        animateTo(idx, idx > activeIdx ? "right" : "left");
      }
    } else {
      setPaused(false);
    }
  }, [persona]);

  function go(idx: number, d: "left" | "right") {
    setPaused(true);
    setPersona(slides[idx].persona);
    animateTo(idx, d);
  }

  const slide = slides[activeIdx];

  const slideIn = exiting
    ? dir === "right"
      ? "-translate-x-8 opacity-0"
      : "translate-x-8 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ background: slide.bg }}
      onMouseEnter={() => !persona && setPaused(true)}
      onMouseLeave={() => !persona && setPaused(false)}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #9ba8d4 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 95% 90% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      {/* Radial glow per slide */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 80% 50%, rgba(${slide.accentRgb},0.12) 0%, transparent 60%)`,
        }}
      />

      {/* ── Floating side arrows (hidden on mobile — pill selectors handle navigation) ── */}
      <button
        aria-label="Previous slide"
        onClick={() =>
          go((activeIdx - 1 + slides.length) % slides.length, "left")
        }
        className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 shadow-md items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go((activeIdx + 1) % slides.length, "right")}
        className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 shadow-md items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-24 pb-0">
        {/* ── Slide ── */}
        <div
          className={cn(
            "flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-10 transition-all duration-320 ease-out",
            slideIn,
          )}
        >
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-7 max-w-[560px] mx-auto lg:mx-0 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="flex justify-center lg:justify-start">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
                style={{
                  color: slide.accent,
                  background: `rgba(${slide.accentRgb},0.09)`,
                  borderColor: `rgba(${slide.accentRgb},0.22)`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: slide.accent }}
                />
                {slide.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] tracking-tight">
              {slide.headline.map((line, i) =>
                i === slide.accentLine ? (
                  <span
                    key={i}
                    className="block relative"
                    style={{ color: slide.accent }}
                  >
                    {line}
                    <svg
                      className="absolute -bottom-1.5 left-0 w-3/4 hidden lg:block"
                      viewBox="0 0 300 10"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 7 Q75 2 150 5 Q225 8 298 3"
                        stroke={slide.accent}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                    </svg>
                  </span>
                ) : (
                  <span key={i} className="block text-gray-950">
                    {line}
                  </span>
                ),
              )}
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-base sm:text-[17px] leading-relaxed max-w-[460px] mx-auto lg:mx-0">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href={slide.cta1.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: slide.accent,
                  boxShadow: `0 6px 24px rgba(${slide.accentRgb},0.35)`,
                }}
              >
                {slide.cta1.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-gray-300 transition-all duration-200"
              >
                {slide.cta2.label}
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
              {slide.trust.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"
                >
                  <BadgeCheck
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: slide.accent }}
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: story visual */}
          <div className="flex-1 w-full max-w-[440px] lg:max-w-none">
            {slide.persona === "student" && (
              <StudentVisual accent={slide.accent} />
            )}
            {slide.persona === "corps" && <CorpsVisual accent={slide.accent} />}
            {slide.persona === "company" && (
              <CompanyVisual accent={slide.accent} />
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col items-center gap-3 pb-10">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {slides.map((s, i) => (
              <button
                key={i}
                aria-label={`Go to ${s.label} slide`}
                aria-current={i === activeIdx ? "true" : undefined}
                onClick={() => go(i, i > activeIdx ? "right" : "left")}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold border overflow-hidden transition-all duration-200",
                  i === activeIdx
                    ? "text-white border-transparent shadow-sm"
                    : "text-gray-500 border-gray-300 bg-white/70 hover:border-gray-400 hover:text-gray-700",
                )}
                style={
                  i === activeIdx
                    ? {
                        background: s.accent,
                        boxShadow: `0 4px 14px rgba(${s.accentRgb},0.35)`,
                      }
                    : {}
                }
              >
                {i === activeIdx && !paused && (
                  <span
                    className="absolute inset-0 rounded-full bg-white/20 pointer-events-none"
                    style={{
                      transform: `scaleX(${progress / 100})`,
                      transformOrigin: "left",
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {s.icon}
                  {s.label}
                </span>
              </button>
            ))}
            {persona !== null && (
              <button
                onClick={() => {
                  setPersona(null);
                  setPaused(false);
                }}
                className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                Reset
              </button>
            )}
          </div>
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((s, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}: ${s.label}`}
                aria-selected={i === activeIdx}
                role="tab"
                onClick={() => go(i, i > activeIdx ? "right" : "left")}
                className="relative h-[3px] rounded-full overflow-hidden bg-gra
                -300/60 transition-all duration-300"
                style={{ width: i === activeIdx ? "32px" : "12px" }}
              >
                {i === activeIdx && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: s.accent,
                      transition: "width 50ms linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
