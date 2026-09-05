"use client";

import Link from "next/link";
import { MapPin, Clock, Users, ArrowRight, Wifi, Banknote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { useQuery } from "@tanstack/react-query";
import { usePersona } from "@/app/(site)/_context/persona";

type PreviewOpportunity = {
  id: string;
  title: string;
  location: string;
  mode: string;
  stipend: string;
  duration: number;
  totalApplications: number;
  maxApplicants: number;
  status: string;
  company: { name: string; industry: string; logo: string };
};

const headings = {
  default: { eyebrow: "Live Opportunities", title: "Placements open right now", desc: "A snapshot of SIWES and PPA opportunities. Hundreds more waiting on the opportunities page." },
  student: { eyebrow: "SIWES Placements", title: "IT placements open now", desc: "Verified companies looking for students like you. Apply before spots run out." },
  corps: { eyebrow: "PPA Opportunities", title: "PPAs open for corps members", desc: "State-matched PPA listings from verified companies. Apply now — camp window is short." },
  company: { eyebrow: "What You Can List", title: "Opportunities on PlaceIT", desc: "See what students and corps members are browsing. Your listing could be here." },
};

export function OpportunitiesPreview() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const h = headings[key];

  const { data } = useQuery({
    queryKey: ["opportunities-preview"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_API_URL;
      const res = await fetch(`${baseUrl}/o/browse?page=1&limit=20`, {
        headers: { "G-PlaceIT-build": process.env.NEXT_PUBLIC_BUILD_KEY ?? "" },
      });
      if (!res.ok) return [];
      const json = await res.json();
      const all: PreviewOpportunity[] = json?.data ?? [];
      return all
        .filter((o) => {
          if (!o.maxApplicants) return true;
          return o.maxApplicants - (o.totalApplications ?? 0) > 0;
        })
        .slice(0, 6);
    },
    staleTime: 5 * 60 * 1000,
  });

  const opportunities = data ?? [];
  if (opportunities.length === 0) return null;

  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{h.eyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 leading-tight tracking-tight">{h.title}</h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-md">{h.desc}</p>
          </div>
          <Link
            href="/opportunities"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "shrink-0 gap-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary/30 hover:text-primary self-start sm:self-auto"
            )}
          >
            See all opportunities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 capitalize truncate group-hover:text-primary transition-colors">{opp.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{opp.company.name}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Open
                  </span>
                </div>
                <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="capitalize truncate">{opp.location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { icon: <Wifi className="w-3 h-3" />, text: opp.mode },
                    { icon: <Clock className="w-3 h-3" />, text: `${opp.duration} mo` },
                    { icon: <Banknote className="w-3 h-3" />, text: opp.stipend === "stipend provided" ? "Paid" : opp.stipend === "depends" ? "Depends" : "Unpaid" },
                  ].map((tag) => (
                    <span key={tag.text} className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-lg text-gray-600 capitalize">
                      {tag.icon}{tag.text}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-auto pt-2 border-t border-dashed border-gray-100">
                  <Users className="w-3 h-3" />
                  <span>
                    <span className="font-medium text-gray-600">{opp.maxApplicants ? opp.maxApplicants - opp.totalApplications : "∞"}</span>{" "}
                    spots left · {opp.company.industry}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/opportunities"
            className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold rounded-xl shadow-sm shadow-primary/20")}
          >
            Browse all opportunities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
