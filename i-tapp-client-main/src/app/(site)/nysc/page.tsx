"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/app/(site)/home/_molecules/reveal";
import { OpportunitiesPreview } from "@/app/(site)/home/_molecules/opportunities-preview";
import {
  MapPin,
  Zap,
  Send,
  LayoutDashboard,
  Shield,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  FileText,
  Mail,
} from "lucide-react";
import { cn } from "@/utils/tailwind";

const green = "#059669";

const stats = [
  { value: "1,200+", label: "Corps members registered" },
  { value: "50+", label: "PPA slots listed" },
  { value: "36", label: "States & FCT" },
  { value: "3 wks", label: "Camp window" },
];

const perks = [
  { icon: MapPin, text: "State-code matched PPA listings — no irrelevant results" },
  { icon: Zap, text: "Camp mode: only immediately-available slots shown" },
  { icon: Send, text: "BulkApply: we cold-email matching companies for you" },
  { icon: LayoutDashboard, text: "Track every application in real time" },
  { icon: Shield, text: "Verified companies only — CAC-backed listings" },
  { icon: FileText, text: "PPA switch support if you need a fresh start" },
];

const steps = [
  {
    n: "01",
    title: "Register with your state code",
    desc: "Sign up with your NYSC call-up number and state code. We instantly filter PPAs to your posted state — only relevant listings.",
    tag: "State-matched",
  },
  {
    n: "02",
    title: "Browse & shortlist PPAs",
    desc: "Scroll through verified, immediately-available PPA slots. Shortlist your top picks before camp closes.",
    tag: "Camp-mode ready",
  },
  {
    n: "03",
    title: "Apply or use BulkApply",
    desc: "Apply directly, or let BulkApply do the heavy lifting — we cold-email matching companies on your behalf.",
    tag: "BulkApply available",
  },
];

const testimonials = [
  {
    name: "Chukwuemeka Adeyemi",
    meta: "Mechanical Eng · FUTO",
    quote:
      "Camp was in its second week and I had nothing. BulkApply sent my CV to 18 companies overnight. I had two responses by morning and confirmed my PPA before camp ended.",
    tag: "PPA secured in camp",
    featured: true,
  },
  {
    name: "Bello Abdulrahman",
    meta: "Civil Eng · BUK",
    quote:
      "State-code matching is real. I entered my code, selected Lagos, and only saw Lagos PPAs. No scrolling through irrelevant listings. Applied to three, got one within 48 hours.",
    tag: "Matched in 48h",
    featured: false,
  },
  {
    name: "Miracle Onyekachi",
    meta: "CS · UNICAL",
    quote:
      "I was already redeployed once and didn't want it again. Found a PPA through PlaceIT in my new state within days. The platform literally saved my service year.",
    tag: "PPA switch successful",
    featured: false,
  },
];

const faqs = [
  {
    q: "What is a PPA and how does PlaceIT help?",
    a: "A Place of Primary Assignment (PPA) is where you serve during your NYSC year. PlaceIT connects corps members to verified organisations offering PPA slots — matched to your state of deployment.",
  },
  {
    q: "How does state-code matching work?",
    a: "When you sign up, you enter your NYSC state code. PlaceIT automatically filters all PPA listings to only show opportunities in your posted state — so you never waste time on irrelevant results.",
  },
  {
    q: "What is BulkApply?",
    a: "BulkApply is a premium feature where PlaceIT cold-emails verified companies in your state on your behalf using your profile and resume. You get responses without lifting a finger.",
  },
  {
    q: "Can I switch my current PPA using PlaceIT?",
    a: "Yes. If you need to move to a new PPA — whether due to relocation, redeployment, or a difficult work environment — PlaceIT can help you find a new verified placement in your state.",
  },
  {
    q: "What is camp mode?",
    a: "Camp mode surfaces only PPA slots that are immediately available — prioritising listings from companies that can onboard you before or right after camp ends. Urgent listings appear at the top.",
  },
];

export default function NyscPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f0fdf4] border-b border-emerald-100">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${green}, transparent 70%)` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
          <Reveal>
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ background: `${green}18`, color: green }}
            >
              NYSC PPA Placement
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.08] tracking-tight max-w-3xl">
              <span style={{ color: green }}>Secure Your PPA</span>{" "}
              Before Camp Ends
            </h1>
            <p className="mt-6 text-gray-500 text-lg max-w-xl leading-relaxed">
              State-matched PPA opportunities from verified companies. Apply before camp closes — start your service year strong.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/corps/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: green }}
              >
                Find My PPA Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/opportunities?type=ppa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition-all"
              >
                Browse PPAs
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {["State-code matched", "3-week camp mode", "BulkApply available"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4" style={{ color: green }} />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: green }} className="py-12">
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
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: green }}>
              Why PlaceIT for NYSC
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight max-w-xl">
              Built specifically for corps members under time pressure
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <Reveal key={p.text} delay={i * 60}>
                <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-[#f0fdf4] hover:border-emerald-100 transition-colors">
                  <div
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${green}15` }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: green }} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-snug self-center">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BulkApply spotlight */}
      <section className="py-20 sm:py-28 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <Reveal className="flex-1">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                style={{ background: `${green}25`, color: green }}
              >
                Pro Feature
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                BulkApply — We reach out for you
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
                Upload your resume, set your skills and location. We cold-email matching companies and PPA hosts on your behalf — so you stand the best chance of landing a placement, even from camp.
              </p>
              <Link
                href="/welcome"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: green }}
              >
                Activate BulkApply <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-xs text-gray-600">Available as a premium add-on.</p>
            </Reveal>
            <Reveal className="flex-1 w-full" delay={100}>
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
                {[
                  { icon: FileText, label: "Upload your resume", done: true },
                  { icon: Zap, label: "Set your skills & state", done: true },
                  { icon: Mail, label: "We cold-email matching companies", done: true },
                  { icon: CheckCircle2, label: "Companies respond to you", done: false, highlight: true },
                ].map((step, i) => (
                  <div
                    key={step.label}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl",
                      step.highlight ? "bg-emerald-900/30 border border-emerald-800" : "bg-gray-800/50"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: step.highlight ? `${green}40` : "#ffffff10" }}
                    >
                      <step.icon className="w-4 h-4" style={{ color: step.highlight ? green : "#9ca3af" }} />
                    </div>
                    <span className={cn("text-sm font-medium", step.highlight ? "text-emerald-300" : "text-gray-300")}>
                      {step.label}
                    </span>
                    {step.done && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: green }} />}
                  </div>
                ))}
                <div className="mt-2 p-3 rounded-xl border border-emerald-800 bg-emerald-900/20">
                  <p className="text-xs font-semibold text-emerald-300">Sent to 24 companies</p>
                  <p className="text-xs text-emerald-400/70 mt-0.5">3 responses received · 1 acceptance pending</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 bg-[#f0fdf4] border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: green }}>
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              PPA secured in 3 steps — before camp ends
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-emerald-200" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white mb-4"
                    style={{ background: green }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ background: `${green}15`, color: green }}
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

      {/* Opportunities */}
      <OpportunitiesPreview />

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: green }}>
              Corps Member Stories
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Corps members who secured their PPA on PlaceIT
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-5">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 80}
                className={t.featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <div className="h-full bg-[#f0fdf4] rounded-2xl border border-emerald-100 p-6 flex flex-col gap-4">
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.meta}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${green}15`, color: green }}
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
      <section className="py-20 sm:py-28 bg-[#f0fdf4] border-t border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: green }}>
              FAQs
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Common questions from corps members
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
                      ? "border-emerald-200 bg-white"
                      : "border-emerald-100 bg-white hover:border-emerald-200"
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
      <section className="py-20 sm:py-28" style={{ background: green }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
              Camp window is short
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight">
              Don&apos;t leave camp<br />without a PPA.
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-base">
              The 3-week window moves fast. Browse state-matched PPA opportunities now and apply before spots fill up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/corps/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white shadow-lg hover:opacity-90 transition-all"
                style={{ color: green }}
              >
                <Shield className="w-4 h-4" /> Find my PPA now
              </Link>
              <Link
                href="/opportunities?type=ppa"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Browse PPAs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40">No credit card. No setup fee.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
