"use client";

import { useState, useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TickCircle, CloseCircle, DocumentText } from "iconsax-reactjs";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useFetchCompanyOpportunities } from "@/hooks/query";
import { useInvalidateOpportunities } from "@/hooks/use-invalidate";
import { Opportunity } from "@/types";
import OpportunityForm from "./opportunity-form";
import { useAction } from "next-safe-action/hooks";
import OpportunityTable from "./opportunity-table";
import { createOpportunity } from "@/actions";
import { toast } from "react-toastify";

// Unified status type
type OpportunityStatus = "open" | "closed" | "draft";

export default function OpportunityPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "All">(
    "open",
  );
  const [creating, setCreating] = useState(false);

  const { data, isLoading, error } = useFetchCompanyOpportunities();
  const opportunities = (data as Opportunity[]) || [];
  const invalidateOpportunities = useInvalidateOpportunities();

  const { execute, isExecuting } = useAction(createOpportunity, {
    onSuccess() {
      setCreating(false);
      toast.success("Opportunity posted");
      invalidateOpportunities();
    },
    onError(error) {
      toast.error(
        error?.error?.serverError ||
          "Error posting opportunity, please try again",
      );
    },
  });

  // if (isLoading) {
  //   return <Spinner />;
  // }

  // Filtered list
  const filtered = useMemo(() => {
    return (opportunities || []).filter((op) => {
      const matchesSearch = op.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || op.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [opportunities, search, statusFilter]);

  if (creating) {
    return (
      <OpportunityForm
        onClose={() => setCreating(false)}
        onSubmit={(data) => execute(data)}
        isExecuting={isExecuting}
      />
    );
  }

  return (
    <div className="space-y-6 h-screen">
      {/* Search bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="bg-white border border-gray-200 flex items-center px-1 rounded-md w-full max-w-lg">
          <Search size={18} className="text-gray-400" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 flex outline-none shadow-none focus:ring-0 ml-2"
          />
        </div>

        <Button
          onClick={() => setCreating(true)}
          className="text-white bg-primary"
        >
          Add New Opportunity
        </Button>
      </div>
      {/* Status filter */}
      <div className="flex flex-row items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Status:</span>
        {(["All", "open", "closed", "draft"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`
              px-3 py-1 text-sm font-medium border rounded-lg transition
              ${
                statusFilter === filter
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>
      <OpportunityTable data={filtered} />

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filtered.length > 0 ? (
          filtered.map((op) => <MobileCardView key={op.id} {...op} />)
        ) : (
          <p className="text-center text-sm text-gray-500 py-6">
            No opportunities found
          </p>
        )}
      </div>
    </div>
  );
}

type CardProps = {
  id: string;
  title: string;
  department: string[];
  location: string;
  status: OpportunityStatus;
  totalApplications: number;
};

// Desktop table row view
export function CardView({
  id,
  title,
  department,
  location,
  status,
  totalApplications,
}: CardProps) {
  const statusConfig = {
    open: {
      icon: <TickCircle size={18} variant="Bold" />,
      color: "text-green-600",
    },
    closed: {
      icon: <CloseCircle size={18} variant="Bold" />,
      color: "text-red-600",
    },
    draft: {
      icon: <DocumentText size={18} variant="Bold" />,
      color: "text-gray-500",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div
      className={`flex items-center justify-between px-4 py-4 border-b border-[#F5F5F5] hover:bg-gray-50 transition`}
    >
      {/* Left: logo + details */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-8 w-8 rounded-xl bg-gray-400/36 flex items-center justify-center ">
          🏢
        </div>
        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-xs text-gray-500">
            {department ?? "Not specified"} &#8226; {location}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="w-28 text-center">
        <div
          className={`flex capitalize items-center justify-center gap-1 ${currentStatus.color} `}
        >
          {" "}
          {/* //  */}
          {currentStatus.icon}
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>

      {/* Applicants */}
      <div className="w-28 text-center text-sm text-gray-700">
        {totalApplications} Applicant{totalApplications !== 1 && "s"}
      </div>

      {/* Action */}
      <div className="w-28 text-right">
        <Link
          href={`opportunities/${id}`}
          className={
            buttonVariants({ variant: "secondary" }) +
            " flex items-center gap-2"
          }
        >
          <span>View</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// Mobile card view
function MobileCardView({
  id,
  title,
  department,
  location,
  status,
  totalApplications,
}: CardProps) {
  const statusConfig = {
    open: {
      badge: "bg-green-700 text-white",
      icon: <TickCircle size={14} variant="Bold" />,
    },
    closed: {
      badge: "bg-red-100 text-red-700",
      icon: <CloseCircle size={14} variant="Bold" />,
    },
    draft: {
      badge: "bg-gray-100 text-gray-700",
      icon: <DocumentText size={14} variant="Bold" />,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-xl">
            🏢
          </div>
          <div>
            <h1 className="text-sm font-semibold">{title}</h1>
            <p className="text-xs text-gray-500">
              {department ?? "Not specified"} &#8226; {location}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${currentStatus.badge}`}
        >
          {currentStatus.icon}
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {totalApplications} Applicant{totalApplications !== 1 && "s"}
        </span>
        <Link
          href={`opportunities/${id}`}
          className={
            buttonVariants({ variant: "default", size: "sm" }) +
            " flex items-center gap-1"
          }
        >
          <span>View</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
