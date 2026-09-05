"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OpportunityTable from "./oppportunity-table";
import { useParams } from "next/navigation";
import { useFetchOpportunityDetails } from "@/hooks/query";
import { Opportunity } from "@/types";
import {
  TickCircle,
  CloseCircle,
  DocumentText,
  Edit2,
  Lock,
} from "iconsax-reactjs";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import OpportunityForm from "../../_molecules/opportunity-form";
import { useAction } from "next-safe-action/hooks";
import { Spinner } from "@/components/spinner";
import { closeOpportunity, updateOpportunity } from "@/actions";
import { toast } from "react-toastify";
import { useInvalidateOpportunities } from "@/hooks/use-invalidate";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchOpportunityDetails(id as string);
  const [editing, setEditing] = useState(false);
  const invalidateOpportunities = useInvalidateOpportunities();

  const opportunity = data as Opportunity;

  const { execute, isExecuting } = useAction(updateOpportunity, {
    onSuccess() {
      setEditing(false);
      toast.success("Opportunity updated successfully!");
      invalidateOpportunities();
    },
    onError(error) {
      toast.error(error?.error?.serverError ?? "Failed to update opportunity.");
    },
  });

  const { execute: close, isExecuting: isClosing } = useAction(
    closeOpportunity,
    {
      onSuccess() {
        setEditing(false);
        toast.success("Opportunity closed successfully!");
        invalidateOpportunities();
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Failed to close opportunity.");
      },
    },
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">
            Error loading opportunity
          </p>
          <p className="text-sm">{error.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const mapOpportunityToFormData = (opportunity: Opportunity) => {
    return {
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      type: opportunity.type,
      mode: opportunity.mode,
      duration: opportunity.duration,
      department: opportunity.department,
      industry: opportunity.industry,
      maxApplicants: opportunity.maxApplicants ?? 0,
      skills: opportunity.skills,
      applicationDeadline: opportunity.applicationDeadline
        ? new Date(opportunity.applicationDeadline).toISOString().split("T")[0]
        : "",
      status: opportunity.status,
      autoCloseOnDeadline: opportunity.autoCloseOnDeadline,
      resumeRequired: opportunity.resumeRequired,
      schoolLetterRequired: opportunity.schoolLetterRequired,
      preferredFieldsOfStudy:
        opportunity.preferredFields?.map((f) => f.field) ?? [],
      programType: (opportunity.programType as "siwes" | "ppa") ?? "siwes",
    };
  };

  if (editing) {
    return (
      <OpportunityForm
        initialData={mapOpportunityToFormData(opportunity)}
        onClose={() => setEditing(false)}
        isExecuting={isExecuting}
        onSubmit={(data) => {
          execute({ id: opportunity.id, ...data });
        }}
      />
    );
  }

  // Status configuration
  const statusConfig = {
    open: {
      icon: <TickCircle size={18} variant="Bold" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    closed: {
      icon: <CloseCircle size={18} variant="Bold" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    draft: {
      icon: <DocumentText size={18} variant="Bold" />,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  };

  const currentStatus = statusConfig[opportunity?.status] || statusConfig.draft;

  return (
    <div className="">
      {/* Breadcrumb/Meta Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
        <div className="flex flex-row items-center gap-1">
          <Briefcase size={16} />
          <span className="capitalize">{opportunity?.type || "N/A"}</span>
        </div>

        <div className="flex flex-row items-center gap-1">
          <MapPin size={16} />
          <span className="capitalize">{opportunity?.location || "N/A"}</span>
        </div>

        <div className="flex flex-row items-center gap-1">
          <Calendar size={16} />
          <span>
            Posted {new Date(opportunity?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl capitalize md:text-3xl font-bold text-gray-900 mb-2">
              {opportunity?.title || "Untitled Opportunity"}
            </h1>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStatus.bg} ${currentStatus.color}`}
            >
              {currentStatus.icon}
              <span className="font-medium text-sm">{opportunity?.status}</span>
            </div>
            {/* <OpportunityStatusBadge
              status={opportunity?.status}
              variant="default"
            /> */}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2">
            <Button
              variant="default"
              onClick={() => setEditing(true)}
              className="flex items-center text-white gap-2"
            >
              <Edit2 size={16} />
              Edit
            </Button>
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              disabled={isClosing}
              onClick={() => close({ id: opportunity.id })}
            >
              <CloseCircle size={16} />
              Close Opportunity
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Department
            </span>
            <span className="text-sm text-gray-900 font-semibold mt-1 capitalize">
              {opportunity?.department?.map((dept) => dept).join(", ") || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Status
            </span>
            <span
              className={`text-sm font-semibold mt-1 ${currentStatus.color} capitalize`}
            >
              {opportunity?.status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Posted On
            </span>
            <span className="text-sm text-gray-900 font-semibold mt-1">
              {new Date(opportunity?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {opportunity?.description ||
              "No description provided for this opportunity."}
          </p>
        </div>

        <hr className="-mx-4 md:-mx-6 border-gray-200 mb-6" />

        {/* Applicants Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>Applicants</span>
            <span className="text-sm font-normal text-gray-500">
              ({opportunity?.applications?.length || 0} total)
            </span>
          </h2>

          <OpportunityTable
            opportunityId={opportunity?.id}
            data={opportunity?.applications || []}
          />
        </div>
      </div>
    </div>
  );
}
