import { OpportunityStatusBadge } from "@/components/opportunity-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { Briefcase } from "iconsax-reactjs";
import Link from "next/link";
import React from "react";

type OpportunityCardProps = {
  id: string;
  title: string;
  applicants: number;
  status: "open" | "closed" | "draft";
  department?: string;
  location?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "dashboard" | "list";
};

export default function OpportunityCard({
  id,
  title,
  applicants,
  status,
  department = "Engineering",
  location = "Remote",
  icon = <Briefcase className="w-5 h-5 text-blue-600" />,
  actionLabel = "View",
  onAction,
  variant = "dashboard",
}: OpportunityCardProps) {
  const isDashboard = variant === "dashboard";

  return (
    <div
      className={`
    flex items-center
    justify-between
    px-6
    ${isDashboard ? "py-3" : "py-4"}
    border-b border-gray-100
    hover:bg-gray-50
    transition
  `}
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
          {icon}
        </div>

        <div className="min-w-0">
          <h1 className="font-semibold text-sm truncate">{title}</h1>
          <p className="text-xs text-gray-500 truncate">
            {department} &#8226; {location}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-16">
        {/* Status */}
        <div className="flex justify-center">
          <OpportunityStatusBadge status={status as any} />
        </div>

        {/* Applicants */}
        <div className="text-center text-sm text-gray-700">
          {applicants} Applicant{applicants !== 1 && "s"}
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Link
            className={
              "text-xs bg-secondary rounded px-4 py-2 outline-none shadow-none"
            }
            href={`/portal/opportunities/${id}`}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
