"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/api";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import OpportunityCard from "./card";
import OpportunityDetailModal from "./detail-modal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  MapPin,
  TrendingUp,
  GraduationCap,
  BadgeCheck,
  LayoutGrid,
} from "lucide-react";

export type PublicOpportunity = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  programType?: "siwes" | "ppa";
  mode: string;
  stipend: string;
  duration: number;
  department: string[];
  status: string;
  applicationDeadline: string;
  totalApplications: number;
  maxApplicants: number;
  allowResumeUpload: boolean;
  resumeRequired: boolean;
  allowSchoolLetter: boolean;
  schoolLetterRequired: boolean;
  preferredFields: string[];
  isFavorited: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    industry: string;
    logo: string;
    website: string;
    location: string;
  };
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type OpportunityType = "all" | "siwes" | "ppa";

const TYPE_FILTERS: {
  value: OpportunityType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "all",
    label: "All",
    icon: <LayoutGrid className="w-4 h-4" />,
    description: "All opportunities",
  },
  {
    value: "siwes",
    label: "SIWES",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Student industrial training",
  },
  {
    value: "ppa",
    label: "PPA",
    icon: <BadgeCheck className="w-4 h-4" />,
    description: "NYSC place of primary assignment",
  },
];

export default function OpportunitiesBrowse() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<OpportunityType>("all");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<PublicOpportunity | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-opportunities", page, typeFilter],
    staleTime: 0,
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (typeFilter !== "all") params.set("program", typeFilter);
      const res = await query(`/o?${params.toString()}`);
      return res as { data: PublicOpportunity[]; pagination: PaginationMeta };
    },
  });

  const opportunities = (data?.data ?? []).filter((o) => {
    if (!o.maxApplicants) return true; // null/undefined/0 = no limit
    return o.maxApplicants - (o.totalApplications ?? 0) > 0;
  });
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Mesh background */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%),
              radial-gradient(circle at 60% 80%, #0ea5e9 0%, transparent 40%)`,
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <Wrapper className="relative pt-32 pb-14">
          {/* Eyebrow */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary bg-primary/8 border border-primary/15 px-4 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Placements
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-950 leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Find Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Industrial</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 rounded-sm -z-0"
                aria-hidden
              />
            </span>{" "}
            Training Placement
          </h1>

          <p className="mt-5 text-center text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover SIWES placements at verified companies across Nigeria.
            Apply directly and kickstart your professional journey.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              {
                icon: <Briefcase className="w-4 h-4" />,
                value: pagination?.totalItems
                  ? `${pagination.totalItems}+`
                  : "—",
                label: "Open Roles",
              },
              {
                icon: <Building2 className="w-4 h-4" />,
                value: "50+",
                label: "Verified Companies",
              },
              {
                icon: <MapPin className="w-4 h-4" />,
                value: "12+",
                label: "States",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 text-gray-700"
              >
                <span className="text-primary bg-primary/10 p-1.5 rounded-lg">
                  {stat.icon}
                </span>
                <div>
                  <p className="text-lg font-bold leading-none text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </div>

      {/* ── Type filter bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <Wrapper className="py-0">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-3">
            {TYPE_FILTERS.map((f) => {
              const active = typeFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    setTypeFilter(f.value);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm shadow-primary/25"
                      : "bg-transparent text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {f.icon}
                  {f.label}
                  {active && f.value !== "all" && (
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-wider opacity-80 bg-white/20 px-1.5 py-0.5 rounded-md">
                      {f.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Wrapper>
      </div>

      {/* ── Listings ── */}
      <Wrapper className="py-12">
        {/* Result meta */}
        {!isLoading && !isError && pagination && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {opportunities.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {pagination.totalItems}
              </span>{" "}
              {typeFilter !== "all" ? (
                <span className="inline-flex items-center gap-1">
                  <span className="font-semibold text-primary uppercase">
                    {typeFilter}
                  </span>{" "}
                  opportunities
                </span>
              ) : (
                "opportunities"
              )}
            </p>
            <span className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
              Page {pagination.currentPage} / {pagination.totalPages}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner />
            <p className="text-sm text-gray-400 animate-pulse">
              Loading opportunities…
            </p>
          </div>
        ) : isError ? (
          <div className="text-center py-32">
            <p className="text-gray-500 font-medium">
              Failed to load opportunities.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please try again later.
            </p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-32">
            <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No opportunities yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onView={() => setSelectedOpportunity(opp)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="gap-1.5 border-gray-200 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - page) <= 1,
                    )
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                        acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="w-8 text-center text-gray-400 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            page === p
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1.5 border-gray-200 shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Wrapper>

      {/* Detail modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
