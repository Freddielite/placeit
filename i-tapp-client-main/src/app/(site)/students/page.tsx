"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/app/(site)/home/_molecules/reveal";
import { OpportunitiesPreview } from "@/app/(site)/home/_molecules/opportunities-preview";
import {
  GraduationCap,
  MapPin,
  LayoutDashboard,
  Send,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/utils/tailwind";

const blue = "#445DCB";

const stats = [
  { value: "2,000+", label: "Students registered" },
  { value: "50+", label: "Verified companies" },
  { value: "36", label: "States & FCT" },
  { value: "48h", label: "Avg. verification time" },
];

const perks = [
  { icon: MapPin, text: "Matched to verified companies by field & location" },
  { icon: Send, text: "Apply to multiple listings from one profile" },
  { icon: LayoutDashboard, text: "Track every application in real time" },
  { icon: ShieldCheck, text: "CAC-verified companies only — no fake listings" },
  { icon: GraduationCap, text: "Free to get started — no hidden fees" },
  { icon: Sparkles, text: "Personalised recommendations based on your field" },
];

const steps = [
  {
    n: "01",
    title: "Sign up in minutes",
    desc: "Create your account, verify your student status, and unlock the full platform — no paperwork, no stress.",
    tag: "Free forever",
  },
  {
    n: "02",
    title: "Build your profile",
    desc: "Drop in your field of study, skills, and location. Your profile becomes your digital CV — companies see it the moment you apply.",
    tag: "One profile",
  },
  {
    n: "03",
    title: "Apply & get placed",
    desc: "Browse verified SIWES listings, send applications in one tap, and track everything live until your offer lands.",
    tag: "Real-time tracking",
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    meta: "CS · UniLag",
    quote:
      "I spent two weeks cold-emailing companies with zero response. Signed up on PlaceIT, got matched to three SIWES listings by the next morning. Accepted one that same week.",
    tag: "SIWES placed",
    featured: true,
  },
  {
    name: "Tobiloba Fashola",
    meta: "Electrical Eng · OAU",
    quote:
      "I thought finding IT placement meant printing CVs and walking into offices. PlaceIT changed that entirely — one profile, applied to five companies in twenty minutes.",
    tag: "Placed at Interswitch",
    featured: false,
  },
  {
    name: "Fatima Al-Hassan",
    meta: "Software Eng · ABU Zaria",
    quote:
      "The dashboard is clean, the companies are real, and tracking my applications felt professional. Finally something built for students that actually works.",
    tag: "Offer received",
    featured: false,
  },
];

const faqs = [
  {
    q: "What is SIWES and how does PlaceIT help?",
    a: "SIWES (Students Industrial Work Experience Scheme) is a federal programme requiring Nigerian undergraduates to complete industrial training. PlaceIT connects you directly to verified companies offering SIWES placements — no cold emails, no walk-ins.",
  },
  {
    q: "How do I apply for a SIWES placement?",
    a: "Create a free account, build your profile with your field of study and location, then browse verified listings. Apply with one tap — your profile is your application.",
  },
  {
    q: "Is PlaceIT free for students?",
    a: "Yes. Creating an account, building your profile, and applying for SIWES placements is completely free for students.",
  },
  {
    q: "How do I know a company is legitimate?",
    a: "Every company on PlaceIT is verified against their CAC registration number before their listing goes live. You'll see a verification badge on all approved listings.",
  },
  {
    q: "Can I track my applications?",
    a: "Yes. Your dashboard shows the real-time status of every application — applied, reviewing, shortlisted, offered, or declined — all in one place.",
  },
];

export default function StudentsPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f8fc] border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${blue}, transparent 70%)` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
          <Reveal>
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ background: `${blue}18`, color: blue }}
            >
              Nigeria&apos;s #1 SIWES Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.08] tracking-tight max-w-3xl">
              Find Your{" "}
              <span style={{ color: blue }}>Industrial Training</span>{" "}
              Placement
            </h1>
            <p className="mt-6 text-gray-500 text-lg max-w-xl leading-relaxed">
              Browse verified SIWES opportunities at top companies. Apply in minutes, track your applications — all from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/welcome"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: blue }}
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition-all"
              >
                Browse Opportunities
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {["Free to get started", "Verified companies only", "Real-time tracking"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4" style={{ color: blue }} />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: blue }} className="py-12">
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
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: blue }}>
              Why PlaceIT
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight max-w-xl">
              Everything you need to land your SIWES placement
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <Reveal key={p.text} delay={i * 60}>
                <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-[#f7f8fc] hover:border-blue-100 transition-colors">
                  <div
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${blue}15` }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: blue }} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-snug self-center">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 bg-[#f7f8fc] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: blue }}>
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              From signup to placement in 3 steps
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gray-200" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white mb-4"
                    style={{ background: blue }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ background: `${blue}15`, color: blue }}
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

      {/* Opportunities preview */}
      <OpportunitiesPreview />

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: blue }}>
              Student Stories
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Students who found their placement on PlaceIT
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-5">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 80}
                className={t.featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <div className="h-full bg-[#f7f8fc] rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.meta}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${blue}15`, color: blue }}
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
      <section className="py-20 sm:py-28 bg-[#f7f8fc] border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: blue }}>
              FAQs
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Common questions from students
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
                      ? "border-blue-200 bg-white"
                      : "border-gray-100 bg-white hover:border-gray-200"
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
      <section className="py-20 sm:py-28" style={{ background: blue }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
              Free to get started
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight">
              Stop cold-emailing.<br />Start getting placed.
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-base">
              Thousands of Nigerian students found their SIWES placement on PlaceIT. Sign up in minutes — no CV printing, no walk-ins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/welcome"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white shadow-lg hover:opacity-90 transition-all"
                style={{ color: blue }}
              >
                <Sparkles className="w-4 h-4" /> Create free account
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Browse opportunities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40">No credit card. No setup fee.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
