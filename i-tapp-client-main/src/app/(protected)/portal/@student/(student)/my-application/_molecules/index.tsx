"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Wrapper } from "@/components/wrapper";
import usePaginator from "@/hooks/use-paginator";
import { useFetchApplication, useFetchMyTransactions } from "@/hooks/query";
import ApplicationTable from "@/components/application-table";
import ApplicationCard from "@/components/application-card";
import { FilterBy } from "@/components/filter-by";
import { filtered } from "@/utils/filtered";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function MyApplicationSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyApplication({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");

  const urlParams = useSearchParams();
  const reference = urlParams.get("reference");

  const query = searchParams?.query || "";

  const { data, isLoading } = useFetchApplication();
  const { data: transactions } = useFetchMyTransactions();

  const applications = data?.data?.applications ?? [];

  const { setCurrentPage, postPerPage, currentPage, paginate } = usePaginator(
    6,
    applications,
  );

  const filteredApplications = filtered(
    applications,
    { query, status: filterStatus },
    (item: any) => item.opportunity?.company?.name,
  );

  // Determine payment banner based on reference in URL or latest transaction
  const latestTransaction = transactions?.[0];
  const showBanner = !!reference || !!latestTransaction;
  const bannerStatus =
    latestTransaction?.status ?? (reference ? "pending" : null);

  return (
    <Wrapper className="sm:pb-10">
      <div className="space-y-6">
        {/* Payment Return Banner */}
        {showBanner && bannerStatus === "success" && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
            <CheckCircle2
              className="text-green-600 mt-0.5 shrink-0"
              size={18}
            />
            <p className="text-green-800">
              Your payment was received and your application has been submitted
              successfully.
            </p>
          </div>
        )}

        {showBanner && bannerStatus === "pending" && (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm">
            <Clock className="text-yellow-600 mt-0.5 shrink-0" size={18} />
            <p className="text-yellow-800">
              You have an incomplete payment for a previous application. You can
              retry by applying again.
            </p>
          </div>
        )}

        {showBanner && bannerStatus === "failed" && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <p className="text-red-800">
              Your payment could not be verified. Please try applying again.
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Applications
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterBy
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <select
              title="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <MyApplicationSkeleton />
        ) : (
          <>
            {/* Desktop Table View */}
            <ApplicationTable application={filteredApplications} />

            {/* Mobile/Tablet Card View */}
            <ApplicationCard application={filteredApplications} />
          </>
        )}
      </div>
    </Wrapper>
  );
}
