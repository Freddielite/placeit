"use client";

import Image from "next/image";
import dp from "@/assets/images/dp.png";
import moment from "moment";
import { cn } from "@/utils/tailwind";
import {
  MapPin,
  ArrowRight,
  CalendarClock,
  BadgeCheck,
  Banknote,
  BookmarkIcon,
} from "lucide-react";
import { Clock } from "iconsax-reactjs";
import { Profile2User } from "iconsax-reactjs";
import { useAction } from "next-safe-action/hooks";
import { saveCorpsPPA } from "@/actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Tag = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 capitalize tracking-wide",
      className,
    )}
  >
    {children}
  </span>
);

export default function PPACard({
  ppa,
  selected,
  onSelect,
}: {
  ppa: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const queryClient = useQueryClient();
  const { execute: toggleSave } = useAction(saveCorpsPPA, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["corps-ppa"] }),
    onError: () => toast.error("Failed to save"),
  });

  const companyName = ppa.organisationName ?? ppa.company?.name ?? null;
  const sector = ppa.sector ?? ppa.company?.industry ?? null;
  const logo = ppa.company?.logo ?? null;
  const isClosed = ppa.status === "closed";
  const isNew = !isClosed && moment().diff(moment(ppa.createdAt), "hours") < 24;
  const deadlineMoment = ppa.applicationDeadline
    ? moment(ppa.applicationDeadline)
    : null;
  const daysToDeadline = deadlineMoment
    ? deadlineMoment.diff(moment(), "days")
    : null;
  const isUrgent =
    !isClosed &&
    daysToDeadline !== null &&
    daysToDeadline >= 0 &&
    daysToDeadline <= 7;
  const deadlineLabel =
    daysToDeadline === 0
      ? "Closes today"
      : daysToDeadline === 1
        ? "Closes tomorrow"
        : `Closes in ${daysToDeadline}d`;

  return (
    <div
      role="button"
      tabIndex={isClosed ? -1 : 0}
      onClick={isClosed ? undefined : onSelect}
      onKeyDown={(e) => {
        if (!isClosed && (e.key === "Enter" || e.key === " ")) onSelect();
      }}
      className={cn(
        "w-full text-left bg-white p-4 border border-gray-100 border-l-8 rounded transition-all duration-150 group relative",
        isClosed && "opacity-60 cursor-not-allowed bg-gray-50",
        !isClosed &&
          selected &&
          "border-primary border-l-primary bg-primary/1.5 shadow-sm",
        !isClosed &&
          !selected &&
          "border-l-transparent hover:border-gray-200 hover:border-l-gray-300 hover:bg-gray-50/80 hover:shadow-sm cursor-pointer",
        isClosed && "border-l-gray-200",
      )}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          title="save"
          onClick={(e) => {
            e.stopPropagation();
            toggleSave({ id: ppa.id });
          }}
          className={cn(
            "p-1 rounded transition-colors",
            ppa.isSaved ? "text-primary" : "text-gray-300 hover:text-primary",
          )}
        >
          <BookmarkIcon
            className="w-3.5 h-3.5"
            fill={ppa.isSaved ? "currentColor" : "none"}
          />
        </button>
        {isClosed && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
            Closed
          </span>
        )}
        {isUrgent && !isClosed && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5">
            <CalendarClock className="w-2.5 h-2.5" /> {deadlineLabel}
          </span>
        )}
        {isNew && !isUrgent && !isClosed && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
            New
          </span>
        )}
        {!isNew && !isUrgent && !isClosed && (
          <ArrowRight
            className={cn(
              "w-3.5 h-3.5 text-primary transition-all duration-150",
              selected ? "opacity-100" : "opacity-0 group-hover:opacity-40",
            )}
          />
        )}
      </div>

      <div className="flex items-start gap-3 pr-8">
        {/* Logo */}
        <div className="shrink-0 w-9 h-9 border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center">
          <Image
            src={logo ?? dp}
            alt={companyName ?? "organisation"}
            width={36}
            height={36}
            className={cn(
              "w-full h-full object-contain",
              isClosed && "grayscale",
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title */}
          <h6
            className={cn(
              "text-[13px] font-semibold leading-snug capitalize",
              isClosed
                ? "text-gray-400"
                : selected
                  ? "text-primary"
                  : "text-gray-900 group-hover:text-primary transition-colors",
            )}
          >
            {ppa.title ?? "Untitled"}
          </h6>

          {companyName && (
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[12px] text-gray-500 truncate capitalize font-semibold">
                {companyName}
              </p>
              {ppa.company?.id && (
                <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />
              )}
            </div>
          )}

          {/* Location */}
          {ppa.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-red-600 shrink-0" />
              <p className="text-[12px] font-semibold text-red-600 capitalize truncate">
                {ppa.location}
              </p>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {ppa.mode && <Tag>{ppa.mode}</Tag>}
            {ppa.duration && <Tag>{ppa.duration} mo.</Tag>}
            {sector && <Tag>{sector}</Tag>}
            {ppa.stipend && ppa.stipend !== "unpaid" && (
              <Tag className="text-emerald-700 bg-emerald-50">
                <Banknote className="w-2.5 h-2.5 inline mr-0.5" />
                {ppa.stipend}
              </Tag>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums">
          <Clock size={11} />
          {moment(ppa.createdAt).fromNow()}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums">
          <Profile2User size={11} />
          {ppa.totalApplications ?? 0}
          {ppa.maxApplicants ? ` / ${ppa.maxApplicants}` : ""} applicants
        </span>
      </div>
    </div>
  );
}
