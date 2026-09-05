"use client";

import { usePersona } from "@/app/(site)/_context/persona";
import { Sparkles, LayoutDashboard, Send, ShieldCheck, MapPin, Zap, Users, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/tailwind";

const features = {
  default: {
    featured: {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Tailored Placement Matching",
      description: "Get personalized recommendations based on your field of study, location, and preferences — no more cold searching, no more WhatsApp group spam.",
      accent: "bg-primary/10 text-primary border-primary/20",
      accentHex: "#477dc0",
    },
    rest: [
      { icon: <LayoutDashboard className="w-5 h-5" />, title: "Application Dashboard", description: "Track every application live — from submitted to offer received.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
      { icon: <Send className="w-5 h-5" />, title: "One Profile, Many Companies", description: "Apply to multiple companies instantly. Your documents travel with you.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      { icon: <ShieldCheck className="w-5 h-5" />, title: "Verified Companies Only", description: "Every company is reviewed before listing. Safe, professional placements.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
    ],
  },
  student: {
    featured: {
      icon: <Sparkles className="w-6 h-6" />,
      title: "SIWES Placement Matching",
      description: "Stop cold-emailing companies. PlaceIT matches you to verified SIWES placements based on your field of study, location, and skills — in seconds.",
      accent: "bg-primary/10 text-primary border-primary/20",
      accentHex: "#477dc0",
    },
    rest: [
      { icon: <LayoutDashboard className="w-5 h-5" />, title: "Real-time Application Tracking", description: "Full visibility on every application — from sent to offer received.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
      { icon: <Send className="w-5 h-5" />, title: "One Profile, Many Companies", description: "Build your profile once. Apply everywhere without re-uploading documents.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      { icon: <ShieldCheck className="w-5 h-5" />, title: "CAC-Verified Companies", description: "Every company on PlaceIT is verified. No sketchy listings, no ghost companies.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
    ],
  },
  corps: {
    featured: {
      icon: <MapPin className="w-6 h-6" />,
      title: "State-Code PPA Matching",
      description: "Enter your NYSC state code once. We instantly filter PPA opportunities to your posted state — no irrelevant listings, no scrolling through Lagos results when you're in Kano.",
      accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accentHex: "#059669",
    },
    rest: [
      { icon: <Zap className="w-5 h-5" />, title: "Camp Mode", description: "See only immediately-available PPA slots — built for the 3-week window.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
      { icon: <Send className="w-5 h-5" />, title: "BulkApply (Premium)", description: "Upload your resume. We cold-email matching companies on your behalf.", accent: "bg-violet-50 text-violet-600 border-violet-100" },
      { icon: <LayoutDashboard className="w-5 h-5" />, title: "PPA Switch Support", description: "Already placed badly? Browse new listings and apply fresh — no restrictions.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
    ],
  },
  company: {
    featured: {
      icon: <Users className="w-6 h-6" />,
      title: "Dual Talent Pool — SIWES & NYSC",
      description: "Post once and reach both SIWES students and NYSC corps members from a single dashboard. One listing, two verified talent pipelines — zero extra effort.",
      accent: "bg-violet-50 text-violet-600 border-violet-100",
      accentHex: "#7c3aed",
    },
    rest: [
      { icon: <ShieldCheck className="w-5 h-5" />, title: "Verified Talent Only", description: "Every applicant is verified on signup. No fake profiles, no time wasters.", accent: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      { icon: <Sparkles className="w-5 h-5" />, title: "Admin-Assisted Listing", description: "Our team can list and manage your openings on your behalf.", accent: "bg-amber-50 text-amber-600 border-amber-100" },
      { icon: <LayoutDashboard className="w-5 h-5" />, title: "Application Dashboard", description: "Review applicants, shortlist, and accept — all in one clean view.", accent: "bg-blue-50 text-blue-600 border-blue-100" },
    ],
  },
};

const headings = {
  default: { eyebrow: "What We Offer", title: "Everything you need,\nbuilt into one platform", desc: "From discovery to offer letter — PlaceIT handles it all." },
  student: { eyebrow: "For Students", title: "Your SIWES journey,\nsimplified", desc: "Find placements, apply instantly, track everything live." },
  corps: { eyebrow: "For Corps Members", title: "PPA placement,\non your terms", desc: "State-matched, fast, and built for the 3-week camp window." },
  company: { eyebrow: "For Companies", title: "Hire smarter\nwith PlaceIT", desc: "List opportunities, reach verified talent, close faster." },
};

const ctaLinks = {
  default: { href: "/welcome", label: "Get started free" },
  student: { href: "/welcome", label: "Find my placement" },
  corps: { href: "/corps/signup", label: "Find my PPA" },
  company: { href: "/company/signup", label: "List opportunities" },
};

export function Services() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const h = headings[key];
  const f = features[key];
  const cta = ctaLinks[key];

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-28">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{h.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight whitespace-pre-line">
              {h.title.includes("PlaceIT") ? (
                <>
                  {h.title.split("PlaceIT")[0]}
                  <span className="text-primary">PlaceIT</span>
                  {h.title.split("PlaceIT")[1]}
                </>
              ) : h.title}
            </h2>
            <p className="mt-4 text-gray-500 text-base leading-relaxed">{h.desc}</p>
          </div>
          <Link
            href={cta.href}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-sm shadow-primary/25 shrink-0"
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric grid: featured left + 3 stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured card — spans 2 cols */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 group">
            {/* Background number decoration */}
            <div
              className="absolute -right-4 -bottom-6 text-[120px] font-black leading-none select-none pointer-events-none opacity-[0.04] text-gray-900"
              aria-hidden="true"
            >
              01
            </div>
            <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0", f.featured.accent)}>
              {f.featured.icon}
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{f.featured.title}</h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{f.featured.description}</p>
            </div>
            <div
              className="h-1 w-16 rounded-full group-hover:w-24 transition-all duration-300"
              style={{ background: f.featured.accentHex }}
            />
          </div>

          {/* 3 supporting cards — span 3 cols, stacked */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {f.rest.map((feat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-start gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5", feat.accent)}>
                  {feat.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-gray-900">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
