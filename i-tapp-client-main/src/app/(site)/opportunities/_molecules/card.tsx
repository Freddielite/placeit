"use client";

import Image from "next/image";
import moment from "moment";
import dp from "@/assets/images/dp.png";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Wifi, Banknote, ArrowUpRight, CalendarDays } from "lucide-react";
import { cn } from "@/utils/tailwind";
import type { PublicOpportunity } from "./browse";

export default function OpportunityCard({
  opportunity,
  onView,
}: {
  opportunity: PublicOpportunity;
  onView: () => void;
}) {
  const {
    title,
    location,
    mode,
    duration,
    stipend,
    programType,
    totalApplications,
    maxApplicants,
    applicationDeadline,
    createdAt,
    status,
    company,
    department,
  } = opportunity;

  const isOpen = status === "open";
  const fillPct = maxApplicants > 0
    ? Math.min(100, Math.round((totalApplications / maxApplicants) * 100))
    : 0;
  const spotsLeft = maxApplicants - totalApplications;
  const isAlmostFull = fillPct >= 75;
  const deadlineMoment = moment(applicationDeadline);
  const hasValidDeadline = deadlineMoment.isValid();
  const deadlineIsNear =
    hasValidDeadline &&
    deadlineMoment.diff(moment(), "days") <= 7 &&
    isOpen;

  return (
    <article
      onClick={onView}
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer flex flex-col",
        "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]",
        "hover:-translate-y-1 transition-all duration-300 ease-out"
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={`h-1 w-full ${
          isOpen
            ? "bg-gradient-to-r from-primary via-primary/70 to-primary/40"
            : "bg-gradient-to-r from-gray-300 to-gray-200"
        }`}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
              <Image
                src={company?.logo || dp}
                alt={company?.name ?? ""}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Title + company */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[14.5px] leading-snug text-gray-900 capitalize line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-[12.5px] text-gray-500 mt-0.5 font-medium truncate">
              {company?.name}
            </p>
          </div>

          {/* Status */}
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-gray-50 text-gray-500 border-gray-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* ── Type badge ── */}
        {programType && (
          <div className="flex">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
              programType === "ppa"
                ? "bg-violet-50 text-violet-700 border-violet-100"
                : "bg-sky-50 text-sky-700 border-sky-100"
            }`}>
              {programType.toUpperCase()}
            </span>
          </div>
        )}

        {/* ── Location + industry ── */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1 font-medium text-red-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="capitalize">{location}</span>
          </span>
          <span className="text-[11px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-medium truncate max-w-[120px]">
            {company?.industry}
          </span>
        </div>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-1.5">
          <Tag>
            <Wifi className="w-3 h-3" />
            <span className="capitalize">{mode}</span>
          </Tag>
          <Tag>
            <Clock className="w-3 h-3" />
            {duration} mo
          </Tag>
          <Tag>
            <Banknote className="w-3 h-3" />
            {stipend === "stipend provided" ? "Paid" : stipend === "depends" ? "Depends" : "Unpaid"}
          </Tag>
          {department?.[0] && (
            <Tag className="hidden sm:inline-flex">{department[0]}</Tag>
          )}
        </div>

        {/* ── Fill progress ── */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-gray-400">
              <Users className="w-3 h-3" />
              <span>
                <span className={isAlmostFull ? "text-orange-600 font-semibold" : "text-gray-600 font-medium"}>
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                </span>
                <span className="text-gray-300 mx-1">/</span>
                {maxApplicants} total
              </span>
            </span>
            <span className={`font-semibold ${isAlmostFull ? "text-orange-500" : "text-gray-400"}`}>
              {fillPct}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                fillPct >= 100
                  ? "bg-red-400"
                  : isAlmostFull
                  ? "bg-gradient-to-r from-orange-400 to-orange-500"
                  : "bg-gradient-to-r from-primary/70 to-primary"
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-dashed border-gray-100" />

        {/* ── Footer ── */}
        <div className="flex items-center justify-between">
          {hasValidDeadline ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Deadline
              </span>
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${
                  deadlineIsNear ? "text-red-500" : "text-gray-700"
                }`}
              >
                {deadlineIsNear && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                <CalendarDays className="w-3 h-3" />
                {deadlineMoment.format("MMM D, YYYY")}
              </span>
            </div>
          ) : (
            <span />
          )}

          <span className="text-[11px] text-gray-400" suppressHydrationWarning>
            {moment(createdAt).fromNow()}
          </span>
        </div>

        {/* ── CTA ── */}
        <Button
          size="sm"
          className={`w-full mt-auto gap-1.5 cursor-pointer font-semibold transition-all duration-200 ${
            isOpen
              ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20 group-hover:shadow-primary/30"
              : "bg-gray-100 text-gray-400 cursor-default pointer-events-none"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          View Details
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </article>
  );
}

function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1 text-[11.5px] font-medium text-gray-600 capitalize ${className}`}
    >
      {children}
    </span>
  );
}
