import React from "react";
import { OpportunityStatus } from "@/types/enums";
import { CloseCircle, DocumentText, TickCircle } from "iconsax-reactjs";
import { Dot, DotIcon } from "lucide-react";

export function OpportunityStatusBadge({
  status,
  variant = "default",
}: {
  status: OpportunityStatus;
  variant?: "dashboard" | "default";
}) {
  const baseClass =
    variant === "dashboard"
      ? "px-3 py-1 text-xs font-semibold rounded-xl capitalize"
      : "flex items-center justify-center text-sm font-medium capitalize";

  const statusConfig: Record<
    OpportunityStatus,
    {
      label: string;
      dashboardColor: string;
      textColor: string;
      icon: React.ReactNode;
    }
  > = {
    [OpportunityStatus.OPEN]: {
      label: "Open",
      dashboardColor: "bg-green-700 text-white",
      textColor: "text-green-600",
      icon: <DotIcon />,
    },
    [OpportunityStatus.CLOSED]: {
      label: "Closed",
      dashboardColor: "bg-red-100 text-red-700",
      textColor: "text-red-600",
      icon: <DotIcon />,
    },
    [OpportunityStatus.DRAFT]: {
      label: "Draft",
      dashboardColor: "bg-gray-100 text-gray-700",
      textColor: "text-gray-500",
      icon: <DocumentText size={16} variant="Bold" />,
    },
    [OpportunityStatus.FILLED]: {
      label: "Filled",
      dashboardColor: "bg-blue-100 text-blue-700",
      textColor: "text-blue-600",
      icon: <TickCircle size={16} variant="Bold" />,
    },
    [OpportunityStatus.FLAGGED]: {
      label: "Flagged",
      dashboardColor: "bg-blue-100 text-blue-700",
      textColor: "text-blue-600",
      icon: <TickCircle size={16} variant="Bold" />,
    },
    [OpportunityStatus.EXPIRED]: {
      label: "Expired",
      dashboardColor: "bg-gray-100 text-gray-700",
      textColor: "text-gray-500",
      icon: <CloseCircle size={16} variant="Bold" />,
    },
    [OpportunityStatus.PAUSED]: {
      label: "Paused",
      dashboardColor: "bg-yellow-100 text-yellow-700",
      textColor: "text-yellow-600",
      icon: <DotIcon />,
    },
    [OpportunityStatus.REVIEW]: {
      label: "Under Review",
      dashboardColor: "bg-purple-100 text-purple-700",
      textColor: "text-purple-600",
      icon: <DotIcon />,
    },
  };

  const current = statusConfig[status];

  // Dashboard view: pill with background color
  if (variant === "dashboard") {
    return (
      <span className={`${baseClass} ${current.dashboardColor}`}>
        {current.label}
      </span>
    );
  }

  // Default view: icon + text with simple text color
  return (
    <div className={`${baseClass} ${current.textColor}`}>
      {current.icon}
      <span className="text-xs">{current.label}</span>
    </div>
  );
}
