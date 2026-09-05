"use client";

import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/navigation";
import dp from "@/assets/images/dp.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  MapPin,
  Globe,
  CalendarDays,
  BookOpen,
  FileText,
  Users,
  Clock,
  Wifi,
  Banknote,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building2,
  GraduationCap,
  Timer,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { apply } from "@/actions";
import { toast } from "react-toastify";
import type { PublicOpportunity } from "./browse";

function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function OpportunityDetailModal({
  opportunity,
  onClose,
}: {
  opportunity: PublicOpportunity | null;
  onClose: () => void;
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(apply, {
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      onClose();
      router.push("/portal/find-it-space");
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to apply. Please try again.");
    },
  });

  function handleApply() {
    const token = getClientCookie("session-token");
    if (!token) {
      router.push(
        `/signin?redirect=/opportunities`,
      );
      return;
    }
    execute({ id: opportunity!.id });
  }

  if (!opportunity) return null;

  const {
    title,
    description,
    location,
    mode,
    duration,
    stipend,
    type,
    totalApplications,
    maxApplicants,
    applicationDeadline,
    resumeRequired,
    schoolLetterRequired,
    preferredFields,
    department,
    status,
    company,
  } = opportunity;

  const isOpen = status === "open";
  const spotsLeft = Math.max(0, maxApplicants - totalApplications);
  const fillPct =
    maxApplicants > 0
      ? Math.min(100, Math.round((totalApplications / maxApplicants) * 100))
      : 0;
  const daysLeft = moment(applicationDeadline).diff(moment(), "days");
  const deadlineIsNear = daysLeft <= 7 && isOpen;

  return (
    <Dialog open={!!opportunity} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl max-h-[80vh] [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        {/* X button — always top-right, above everything */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* ── Left panel — hidden on mobile ── */}
          <div className="hidden md:flex relative md:w-72 shrink-0 bg-gradient-to-b from-primary to-primary/80 flex-col overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 p-6 flex flex-col gap-5 flex-1">
              {/* Logo + company */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <Image
                    src={company?.logo || dp}
                    alt={company?.name ?? ""}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">
                    Company
                  </p>
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {company?.name}
                  </p>
                  <p className="text-white/50 text-[11px] truncate">
                    {company?.industry}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                    isOpen
                      ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30"
                      : "bg-white/10 text-white/50 border-white/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpen ? "bg-emerald-400 animate-pulse" : "bg-white/40"
                    }`}
                  />
                  {isOpen ? "Accepting Applications" : "Position Closed"}
                </span>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-2">
                <StatTile
                  icon={<Timer className="w-3.5 h-3.5" />}
                  label="Duration"
                  value={`${duration} Months`}
                />
                <StatTile
                  icon={<Wifi className="w-3.5 h-3.5" />}
                  label="Mode"
                  value={mode}
                />
                <StatTile
                  icon={<Banknote className="w-3.5 h-3.5" />}
                  label="Stipend"
                  value={stipend === "stipend provided" ? "Paid" : stipend === "depends" ? "Depends" : "Unpaid"}
                />
                <StatTile
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  label="Type"
                  value={type}
                />
              </div>

              {/* Applicant fill */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-white/60">
                    <Users className="w-3 h-3" />
                    Spots filled
                  </span>
                  <span className="text-white font-semibold">{fillPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      fillPct >= 100
                        ? "bg-red-400"
                        : fillPct >= 75
                        ? "bg-orange-300"
                        : "bg-white/70"
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <p className="text-white/50 text-[11px]">
                  {spotsLeft > 0 ? `${spotsLeft} of ${maxApplicants} spots remaining` : "No spots remaining"}
                </p>
              </div>

              {/* Deadline */}
              <div
                className={`rounded-xl p-3 border ${
                  deadlineIsNear
                    ? "bg-red-500/20 border-red-400/30"
                    : "bg-white/8 border-white/15"
                }`}
              >
                <p className="text-white/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Application Deadline
                </p>
                <p
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    deadlineIsNear ? "text-red-200" : "text-white"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  {moment(applicationDeadline).format("MMM D, YYYY")}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    deadlineIsNear ? "text-red-300" : "text-white/40"
                  }`}
                >
                  {daysLeft > 0
                    ? deadlineIsNear
                      ? `⚠ Only ${daysLeft} days left`
                      : `${daysLeft} days remaining`
                    : "Deadline passed"}
                </p>
              </div>

              {/* Location */}
              {company?.location && (
                <div className="flex items-start gap-2 text-white/60 text-[12px]">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="capitalize">{company.location}</span>
                </div>
              )}

              {/* Company website */}
              {company?.website && (
                <a
                  href={company?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white/50 hover:text-white text-[12px] transition-colors truncate mt-auto"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{company?.website}</span>
                </a>
              )}
            </div>
          </div>

          {/* ── Right panel (scrollable) ── */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
            {/* Mobile branded header */}
            <div className="md:hidden relative bg-gradient-to-br from-primary to-primary/80 px-5 pt-5 pb-5 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                  <Image src={company?.logo || dp} alt={company?.name ?? ""} width={48} height={48} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1 pr-8">
                  <h2 className="text-white font-bold text-base leading-tight capitalize truncate">{title}</h2>
                  <p className="text-white/60 text-xs mt-0.5 truncate">{company?.name} · {company?.industry}</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${isOpen ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : "bg-white/10 text-white/50 border-white/20"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`} />
                  {isOpen ? "Open" : "Closed"}
                </span>
                {[
                  { icon: <Timer className="w-3 h-3" />, label: `${duration}mo` },
                  { icon: <Wifi className="w-3 h-3" />, label: mode },
                  { icon: <Banknote className="w-3 h-3" />, label: stipend === "stipend provided" ? "Paid" : stipend === "depends" ? "Depends" : "Unpaid" },
                  { icon: <MapPin className="w-3 h-3" />, label: location },
                ].map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-white/80 capitalize">
                    {s.icon}{s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="pr-8">
                <h2 className="text-xl font-bold text-gray-900 leading-tight capitalize">{title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />{location}
                  </span>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />Posted {moment(opportunity.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              {department?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {department.map((d) => (
                    <span key={d} className="text-[11px] font-medium px-2.5 py-0.5 bg-primary/8 text-primary rounded-full border border-primary/15">{d}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Body content */}
            <div className="px-6 py-5 flex flex-col gap-6 flex-1">
              {/* Department tags (mobile only — desktop shows in sticky header) */}
              {department?.length > 0 && (
                <div className="md:hidden flex flex-wrap gap-1.5">
                  {department.map((d) => (
                    <span key={d} className="text-[11px] font-medium px-2.5 py-0.5 bg-primary/8 text-primary rounded-full border border-primary/15">{d}</span>
                  ))}
                </div>
              )}
              {/* Description */}
              {description && (
                <Section title="About This Role">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </Section>
              )}

              {/* Requirements */}
              <Section title="What You'll Need">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <RequirementRow
                    icon={<FileText className="w-4 h-4" />}
                    label="Resume / CV"
                    required={resumeRequired}
                  />
                  <RequirementRow
                    icon={<BookOpen className="w-4 h-4" />}
                    label="School Letter"
                    required={schoolLetterRequired}
                  />
                </div>
              </Section>

              {/* Preferred fields */}
              {preferredFields?.length > 0 && (
                <Section title="Preferred Fields of Study">
                  <div className="flex flex-wrap gap-2">
                    {preferredFields.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 text-[12px] font-medium px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-700"
                      >
                        <GraduationCap className="w-3 h-3 text-gray-400" />
                        {f}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* Sticky CTA footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <p className="text-xs text-gray-400 text-center sm:text-left">
                  Only students can apply. Sign in required.
                </p>
                <Button
                  onClick={handleApply}
                  disabled={!isOpen || isExecuting}
                  className="gap-2 min-w-36 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 font-semibold"
                >
                  {isExecuting ? (
                    <>
                      Applying…
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : isOpen ? (
                    <>
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    "Position Closed"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/8 border border-white/12 rounded-xl p-2.5 flex flex-col gap-1">
      <span className="text-white/50">{icon}</span>
      <span className="text-white/40 text-[10px] uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className="text-white text-xs font-semibold capitalize leading-tight">
        {value}
      </span>
    </div>
  );
}

function RequirementRow({
  icon,
  label,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  required: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border text-sm ${
        required
          ? "bg-red-50 border-red-100 text-red-700"
          : "bg-gray-50 border-gray-100 text-gray-500"
      }`}
    >
      <span className={required ? "text-red-400" : "text-gray-400"}>
        {icon}
      </span>
      <span className="font-medium flex-1">{label}</span>
      {required ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wide">
          <XCircle className="w-3.5 h-3.5" />
          Required
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Optional
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </h4>
      {children}
    </div>
  );
}
