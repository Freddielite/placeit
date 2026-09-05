"use client";

import { useState } from "react";
import { filters } from "@/config/student";
import { Opportunity } from "@/types";
import { useFetchStudentOpportunities } from "@/hooks/query";
import Results from "./results";
import { OpportunityDetailsPanel } from "./opportunity-details-panel";
import { FilterToggleButton } from "./filter-toggle-button";
import { OpportunityDetailsMobile } from "./opportunity-details-mobile";
import FilterPanel from "./filter-panel";
import FilterMobile from "./filter-mobile";
import { SitePagination } from "@/components/ui/site-pagination";
import { cn } from "@/utils/tailwind";

export default function FindITSpace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [filter, setFilter_] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);

  const setFilter = (f: typeof filters) => {
    setFilter_(f);
    setCurrentPage(1);
  };

  const { data: { items: opportunities = [], total: totalOpportunities = 0 } = {}, isLoading, error } =
    useFetchStudentOpportunities(filter, currentPage, 10);

  if (error) return (
    <div className="flex items-center justify-center h-full text-sm text-gray-500">
      Failed to load opportunities. Please try again.
    </div>
  );

  const isDetailsOpen = !!selectedId;

  const activeFilterCount = [
    ...filter.status.filter((s: any) => s.checked),
    ...filter.duration.filter((d: any) => d.checked),
    ...filter.industry.filter((i: any) => i.checked),
    ...(filter.location ? [1] : []),
  ].length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-gray-50 pt-[55px]">

      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <FilterToggleButton
          onToggle={() => setFilterActive((prev) => !prev)}
          activeCount={activeFilterCount}
        />
      </div>

      {/* Three-panel body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Filter sidebar */}
        <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 border-r border-gray-200 bg-white overflow-hidden">
          <FilterPanel filter={filter} setFilter={setFilter} setFilterActive={setFilterActive} />
        </div>

        {/* Results column */}
        <div className={cn(
          "flex-1 min-w-0 overflow-hidden flex flex-col",
          isDetailsOpen && "hidden md:flex",
        )}>
          <Results
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isLoading={isLoading}
            opportunities={opportunities}
            setSelectedOpportunity={setSelectedOpportunity}
            setFilter={setFilter}
            filter={filter}
          />
          <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-2">
            <SitePagination
              totalPosts={totalOpportunities}
              postsPerPage={10}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        {/* Details panel — desktop */}
        {isDetailsOpen && (
          <div className="hidden md:block w-80 lg:w-96 shrink-0 border-l border-gray-200 overflow-hidden">
            <OpportunityDetailsPanel
              selectedId={selectedId}
              selectedOpportunity={selectedOpportunity}
              setSelectedId={setSelectedId}
            />
          </div>
        )}
      </div>

      {/* Mobile filter overlay */}
      {filterActive && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setFilterActive(false)} />
          <FilterMobile filter={filter} setFilter={setFilter} filterActive={filterActive} setFilterActive={setFilterActive} />
        </>
      )}

      {/* Mobile details overlay */}
      <OpportunityDetailsMobile
        selectedId={selectedId}
        selectedOpportunity={selectedOpportunity}
        setSelectedId={setSelectedId}
      />
    </div>
  );
}
