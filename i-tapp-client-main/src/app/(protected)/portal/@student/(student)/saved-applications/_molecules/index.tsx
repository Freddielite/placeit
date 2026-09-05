"use client";

import React, { useState } from "react";
import { Wrapper } from "@/components/wrapper";
import { SitePagination } from "@/components/ui/site-pagination";
import usePaginator from "@/hooks/use-paginator";
import { useFetchApplication } from "@/hooks/query";
import ApplicationSearch from "@/components/application-search";
import ApplicationTable from "@/components/application-table";
import ApplicationCard from "@/components/application-card";
import { FilterBy } from "@/components/filter-by";
import { filtered } from "@/utils/filtered";
import { useFetchSavedOpportunities } from "@/queries/student";
import SavedOpportunityTable from "@/components/saved-opportunity-table";
import SavedOpportunityCard from "@/components/saved-opportunity-card";

export default function SavedApplication({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");

  const query = searchParams?.query || "";

  const { data: saved, isLoading } = useFetchSavedOpportunities();

  const { setCurrentPage, postPerPage, currentPage, paginate } = usePaginator(
    6,
    saved?.length || 0,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const filteredApplications = filtered(
    saved,
    { query, status: filterStatus },
    (item: any) => item?.company?.name,
  );

  return (
    <Wrapper className="sm:pb-10">
      <div className="space-y-6">
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

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <FilterBy
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <select
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

        {/* Desktop Table View */}
        <SavedOpportunityTable opportunity={filteredApplications} />

        {/* Mobile/Tablet Card View */}
        <SavedOpportunityCard opportunity={filteredApplications} />
      </div>

      {/* <SitePagination
        totalPosts={filteredApplications.length}
        postsPerPage={postPerPage}
        paginate={paginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}
    </Wrapper>
  );
}
