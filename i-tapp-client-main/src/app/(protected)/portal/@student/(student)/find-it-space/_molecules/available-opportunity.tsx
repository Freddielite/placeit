import React from "react";
import Image from "next/image";
import dp from "@/assets/images/dp.png";
import moment from "moment";
import { cn } from "@/utils/tailwind";
import { Opportunity } from "@/types";
import { Clock, Profile2User } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import useIsResponsive from "@/utils/responsive";
import { BadgeCheck, MapPin, ArrowRight, Banknote, CalendarClock, CheckCircle2 } from "lucide-react";

export default function AvailableOpportunity({
  details,
  setSelectedId,
  selectedId,
  setSelectedOpportunity,
}: {
  details: Opportunity;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setSelectedOpportunity: (name: Opportunity | null) => void;
}) {
  const {
    id, title, location, duration, createdAt,
    mode, totalApplications, status, industry,
    applicationDeadline, hasApplied, maxApplicants,
  } = details;

  const rawStipend = (details as any).stipend;
  const stipendNum = rawStipend != null ? Number(rawStipend) : NaN;
  const stipend = !isNaN(stipendNum) && stipendNum > 0 ? stipendNum : null;

  const companyName =
    details?.company?.name ||
    // @ts-expect-error
    details?.companyName ||
    (typeof details?.company === "string" ? details.company : null);

  const isSelected = selectedId === id;
  const isVerified = details?.company?.status === "approved";
  const isClosed = status === "closed";
  const isNew = !isClosed && moment().diff(moment(createdAt), "hours") < 24;

  // Deadline urgency — warn when ≤ 7 days away and not closed
  const deadlineMoment = applicationDeadline ? moment(applicationDeadline) : null;
  const daysToDeadline = deadlineMoment ? deadlineMoment.diff(moment(), "days") : null;
  const isUrgent = !isClosed && daysToDeadline !== null && daysToDeadline >= 0 && daysToDeadline <= 7;
  const deadlineLabel = daysToDeadline === 0
    ? "Closes today"
    : daysToDeadline === 1
      ? "Closes tomorrow"
      : `Closes in ${daysToDeadline}d`;

  const router = useRouter();
  const { isMobile } = useIsResponsive();

  return (
    <button
      type="button"
      disabled={isClosed}
      className={cn(
        "w-full text-left bg-white p-4 border-l-[3px] transition-all duration-150 group relative",
        isClosed && "opacity-60 cursor-not-allowed bg-gray-50",
        !isClosed && isSelected && "border-l-primary bg-primary/[0.015]",
        !isClosed && !isSelected && "border-l-transparent hover:border-l-gray-300 hover:bg-gray-50/80",
        isClosed && "border-l-gray-200",
      )}
      onClick={() => {
        if (isClosed) return;
        if (isMobile) return router.push(`find-it-space/o/${id}`);
        setSelectedId(id);
        setSelectedOpportunity(details);
      }}
    >
      {/* Top-right badges — priority: Applied > Closed > Urgent > New > Arrow */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {hasApplied && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> Applied
          </span>
        )}
        {isClosed && !hasApplied && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
            Closed
          </span>
        )}
        {isUrgent && !hasApplied && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5">
            <CalendarClock className="w-2.5 h-2.5" /> {deadlineLabel}
          </span>
        )}
        {isNew && !hasApplied && !isUrgent && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
            New
          </span>
        )}
        {!isNew && !hasApplied && !isUrgent && !isClosed && (
          <ArrowRight className={cn(
            "w-3.5 h-3.5 text-primary transition-all duration-150",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-40",
          )} />
        )}
      </div>

      <div className="flex items-start gap-3 pr-8">
        {/* Logo */}
        <div className="shrink-0 w-9 h-9 border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center">
          <Image
            src={details?.company?.logo ?? dp}
            alt={companyName ?? "company"}
            width={36}
            height={36}
            className={cn("w-full h-full object-contain", isClosed && "grayscale")}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title */}
          <h6 className={cn(
            "text-[13px] font-semibold leading-snug capitalize",
            isClosed
              ? "text-gray-400"
              : isSelected
                ? "text-primary"
                : "text-gray-900 group-hover:text-primary transition-colors",
          )}>
            {title ?? "Untitled"}
          </h6>

          {/* Company + verified */}
          {companyName && (
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[12px] text-gray-500 truncate capitalize font-semibold">{companyName}</p>
              {isVerified && (
                <div className="relative group/badge inline-block shrink-0">
                  <BadgeCheck className="w-3 h-3 text-blue-500" />
                  <div className="absolute z-10 bottom-full mb-1 left-0 w-40 hidden group-hover/badge:block bg-gray-900 text-white text-[10px] px-2 py-1.5 leading-relaxed whitespace-nowrap">
                    Verified company
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-red-600 shrink-0" />
              <p className="text-[12px] font-semibold text-red-600 capitalize truncate">{location}</p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mode && <Tag>{mode}</Tag>}
            {duration && <Tag>{duration} mo.</Tag>}
            {industry && <Tag>{industry}</Tag>}
            {stipend && (
              <Tag className="text-emerald-700 bg-emerald-50">
                <Banknote className="w-2.5 h-2.5 inline mr-0.5" />
                ₦{stipend.toLocaleString()}
              </Tag>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums">
          <Clock size={11} />
          {moment(createdAt).fromNow()}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums">
          <Profile2User size={11} />
          {totalApplications ?? 0}
          {maxApplicants ? ` / ${maxApplicants}` : ""} applicants
        </span>
      </div>
    </button>
  );
}

const Tag = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn(
    "inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 capitalize tracking-wide",
    className,
  )}>
    {children}
  </span>
);
