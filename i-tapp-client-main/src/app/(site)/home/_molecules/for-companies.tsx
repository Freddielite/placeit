"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, Users, ShieldCheck, Sparkles, LayoutDashboard, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { usePersona } from "@/app/(site)/_context/persona";

const perks = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Dual Talent Pool",
    description: "SIWES students and NYSC corps members — one listing reaches both.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verified Talent Only",
    description: "Every applicant is verified on signup. No fake profiles, no time wasters.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Admin-Assisted Listing",
    description: "Our team can list and manage your openings on your behalf.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Applicant Dashboard",
    description: "Review, shortlist, and accept talent — all from one clean view.",
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
];

const stats = [
  { value: "3,200+", label: "Active talent", icon: <Users className="w-4 h-4" /> },
  { value: "50+", label: "Companies listed", icon: <ShieldCheck className="w-4 h-4" /> },
  { value: "48h", label: "Avg. verification", icon: <Clock className="w-4 h-4" /> },
];

export function ForCompanies() {
  const { persona } = usePersona();
  if (persona !== "company") return null;

  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-28">

        {/* Top: eyebrow + headline + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">For Companies</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight">
              Nigeria&apos;s placement talent,<br />
              <span className="text-primary">at your fingertips</span>
            </h2>
            <p className="mt-4 text-gray-500 text-base leading-relaxed">
              List SIWES and NYSC PPA opportunities. Reach thousands of qualified, verified candidates — ready to contribute from day one.
            </p>
          </div>
          <Link
            href="/company/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "self-start shrink-0 gap-2 font-bold rounded-xl shadow-sm shadow-primary/20"
            )}
          >
            List your first opening
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main content: mock visual left + perks right */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* Left: mock dashboard card */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden">
              {/* Dashboard header bar */}
              <div className="bg-gray-950 px-5 py-3.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-[11px] text-gray-400 font-mono">company.getplaceit.com/dashboard</span>
              </div>

              {/* Dashboard body */}
              <div className="p-5 flex flex-col gap-4">
                {/* Listing header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Software Dev Intern · SIWES</p>
                    <p className="text-[11px] text-gray-400">BrandHive Nigeria · Lagos</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>

                {/* Pipeline bars */}
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Applied", count: 38, pct: 100, color: "bg-gray-200" },
                    { label: "Reviewing", count: 17, pct: 45, color: "bg-primary/60" },
                    { label: "Shortlisted", count: 8, pct: 21, color: "bg-primary" },
                    { label: "Accepted", count: 3, pct: 8, color: "bg-emerald-500" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 w-20 shrink-0">{row.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 w-4 text-right">{row.count}</span>
                    </div>
                  ))}
                </div>

                {/* Recent applicants */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent applicants</p>
                  {[
                    { name: "Adaeze Okonkwo", field: "Computer Science · 300L", status: "Shortlisted", statusColor: "text-primary bg-primary/8" },
                    { name: "Emeka Nwosu", field: "Electrical Eng. · 400L", status: "Reviewing", statusColor: "text-amber-600 bg-amber-50" },
                    { name: "Fatima Al-Hassan", field: "Software Eng. · 300L", status: "Applied", statusColor: "text-gray-500 bg-gray-50" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                        {a.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-gray-900 truncate">{a.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{a.field}</p>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", a.statusColor)}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom stat row */}
                <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">+12 applicants this week</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
                    <CheckCircle2 className="w-3 h-3" />
                    CAC verified
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row below mock */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm flex flex-col gap-1.5">
                  <div className="text-primary">{s.icon}</div>
                  <p className="text-lg font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: perks */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0", perk.accent)}>
                  {perk.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-gray-900">{perk.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="sm:col-span-2 bg-primary rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-base">Ready to start hiring?</p>
                <p className="text-primary-foreground/70 text-sm mt-1">Free to list. Verification required. Goes live in 48h.</p>
              </div>
              <Link
                href="/company/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-sm font-bold hover:bg-gray-50 transition-colors shrink-0"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
