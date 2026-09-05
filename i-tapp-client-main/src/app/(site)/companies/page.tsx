"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/app/(site)/home/_molecules/reveal";
import {
  Users,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { cn } from "@/utils/tailwind";

const violet = "#7c3aed";

const stats = [
  { value: "3,200+", label: "Active talent pool" },
  { value: "50+", label: "Active listings" },
  { value: "36", label: "States & FCT" },
  { value: "48h", label: "Avg. time to first applicant" },
];

const perks = [
  {
    icon: Users,
    title: "Dual Talent Pool",
    desc: "SIWES students and NYSC corps members — one listing reaches both verified pipelines.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Talent Only",
    desc: "Every applicant is verified on signup. No fake profiles, no time wasters.",
  },
  {
    icon: Sparkles,
    title: "Admin-Assisted Listing",
    desc: "Our team can list and manage your openings on your behalf — zero effort on your end.",
  },
  {
    icon: LayoutDashboard,
    title: "Applicant Dashboard",
    desc: "Review, shortlist, and accept talent — all from one clean dashboard view.",
  },
  {
    icon: Building2,
    title: "CAC-Verified Badge",
    desc: "Your listing goes live with a verification badge — builds instant trust with applicants.",
  },
  {
    icon: CheckCircle2,
    title: "Free to List",
    desc: "No setup fee, no listing fee. You only pay for premium features if you need them.",
  },
];

const steps = [
  {
    title: "Register & get verified",
    desc: "Sign up with your CAC number. We review and verify your company — your badge goes live within 48 hours.",
    tag: "CAC-verified",
  },
  {
    title: "List your openings",
    desc: "Post SIWES or PPA slots in minutes. Set requirements, duration, and slots. Goes live instantly after verification.",
    tag: "Instant listing",
  },
  {
    title: "Review & accept talent",
    desc: "Applications land on your dashboard. Shortlist, review profiles, and accept — all in one clean view.",
    tag: "Dashboard managed",
  },
];

const pipeline = [
  { label: "Applied", count: 38, pct: 100 },
  { label: "Reviewing", count: 17, pct: 45 },
  { label: "Shortlisted", count: 8, pct: 21 },
  { label: "Accepted", count: 3, pct: 8 },
];

const applicants = [
  { name: "Adaeze Okonkwo", meta: "CS 300L", status: "Shortlisted", color: "#7c3aed" },
  { name: "Emeka Nwosu", meta: "EE 400L", status: "Reviewing", color: "#d97706" },
  { name: "Fatima Al-Hassan", meta: "SE 300L", status: "Applied", color: "#6b7280" },
];

const testimonials = [
  {
    name: "Ngozi Eze",
    meta: "HR Lead · Printivo",
    quote:
      "We listed three intern slots on a Friday afternoon. By Monday we had 24 verified applications. Shortlisted six, accepted three. The fastest placement hiring we've done.",
    tag: "24 applicants in 3 days",
    featured: true,
  },
  {
    name: "Emeka Okafor",
    meta: "CTO · BrandHive",
    quote:
      "The talent pool is properly verified. No fake CVs, no ghosts. Every applicant had a real profile with their field and state visible. Made shortlisting very fast.",
    tag: "Zero fake profiles",
    featured: false,
  },
  {
    name: "Amaka Nwosu",
    meta: "Operations · Sterling Bank",
    quote:
      "Admin listed on our behalf and we just reviewed applications as they came in. Zero effort on our end and we still filled all four intern spots within the week.",
    tag: "4 slots filled",
    featured: false,
  },
];

const faqs = [
  {
    q: "Who can list opportunities on PlaceIT?",
    a: "Any registered Nigerian company can list SIWES or NYSC PPA opportunities on PlaceIT. We require a valid CAC number for verification before your listing goes live.",
  },
  {
    q: "Can I list both SIWES and NYSC PPA slots?",
    a: "Yes. One company account lets you post both SIWES internship slots and NYSC PPA positions. Each listing type is shown to the relevant talent pool automatically.",
  },
  {
    q: "How do I verify my company?",
    a: "Sign up with your company details and CAC number. Our team reviews and verifies your company within 48 hours. Verified companies receive a badge visible to all applicants.",
  },
  {
    q: "Is it free to list opportunities?",
    a: "Yes. Listing SIWES and PPA opportunities on PlaceIT is free. Premium features like admin-assisted listing and enhanced visibility are available as paid add-ons.",
  },
  {
    q: "What happens after I list an opportunity?",
    a: "Your listing goes live immediately. Applications from verified students and corps members appear on your dashboard in real time. You can shortlist, message, and accept candidates directly.",
  },
];

export default function CompaniesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#faf5ff] border-b border-violet-100">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${violet}, transparent 70%)` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <Reveal className="flex-1">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                style={{ background: `${violet}18`, color: violet }}
              >
                Hire Placement-Ready Talent
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.08] tracking-tight max-w-2xl">
                Access Nigeria&apos;s Best{" "}
                <span style={{ color: violet }}>Emerging Talent</span>
              </h1>
              <p className="mt-6 text-gray-500 text-lg max-w-xl leading-relaxed">
                List SIWES and NYSC PPA opportunities. Reach thousands of verified students and corps members from one dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/company/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: violet }}
                >
                  List Opportunities <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition-all"
                >
                  See How It Works
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                {["SIWES + PPA talent pool", "Verified applicants only", "Admin-assisted listing"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4" style={{ color: violet }} />
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Dashboard mockup */}
            <Reveal className="flex-1 w-full max-w-md" delay={120}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">company.getplaceit.com/dashboard</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-sm text-gray-900">Software Dev Intern · SIWES</p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${violet}15`, color: violet }}
                      >
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {pipeline.map((p) => (
                      <div key={p.label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{p.label}</span>
                          <span className="font-semibold text-gray-700">{p.count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${p.pct}%`, background: violet }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    {applicants.map((a) => (
                      <div key={a.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: a.color }}
                          >
                            {a.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-800">{a.name}</p>
                            <p className="text-[10px] text-gray-400">{a.meta}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500">{a.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>+12 applicants this week</span>
                    <span className="text-green-600 font-semibold">CAC verified ✓</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: violet }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-white">{s.value}</p>
                <p className="text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: violet }}>
              Why PlaceIT for Companies
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight max-w-xl">
              Nigeria&apos;s placement talent, at your fingertips
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="flex flex-col gap-3 p-6 rounded-2xl border border-gray-100 bg-[#faf5ff] hover:border-violet-100 transition-colors h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${violet}15` }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: violet }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#faf5ff] border-t border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: violet }}>
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              From signup to your first applicant in 3 steps
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-violet-200" />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="relative bg-white rounded-2xl border border-violet-100 p-6 shadow-sm">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white mb-4"
                    style={{ background: violet }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ background: `${violet}15`, color: violet }}
                  >
                    {s.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: violet }}>
              Company Stories
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Companies that hired through PlaceIT
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-5">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 80}
                className={t.featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <div className="h-full bg-[#faf5ff] rounded-2xl border border-violet-100 p-6 flex flex-col gap-4">
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-3 border-t border-violet-100">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.meta}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${violet}15`, color: violet }}
                    >
                      {t.tag}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 sm:py-28 bg-[#faf5ff] border-t border-violet-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: violet }}>
              FAQs
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Common questions from companies
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 40}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className={cn(
                    "w-full text-left rounded-xl border px-5 py-4 transition-colors",
                    open === i
                      ? "border-violet-200 bg-white"
                      : "border-violet-100 bg-white hover:border-violet-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm text-gray-900">{f.q}</span>
                    <ChevronDown
                      className={cn("w-4 h-4 shrink-0 text-gray-400 transition-transform", open === i && "rotate-180")}
                    />
                  </div>
                  {open === i && (
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{f.a}</p>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28" style={{ background: violet }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
              Free to list
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight">
              List your first opportunity today.
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-base">
              Reach thousands of verified students and corps members. Admin-assisted listing available. Live within 48 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/company/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white shadow-lg hover:opacity-90 transition-all"
                style={{ color: violet }}
              >
                <Building2 className="w-4 h-4" /> List opportunities
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40">Verification required. No credit card. No setup fee.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
