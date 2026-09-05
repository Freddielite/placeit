"use client";

import { useState } from "react";
import { useFetchCorpsPPA } from "@/queries/corps";
import { Spinner } from "@/components/spinner";
import { SitePagination } from "@/components/ui/site-pagination";
import PPACard from "./ppa-card";
import PPADetailPanel from "./ppa-detail-panel";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";

export default function FindPPA() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ state: "", industry: "", search: "" });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useFetchCorpsPPA(filter, currentPage, 10);
  const listings: any[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex h-screen overflow-hidden pt-14 bg-gray-50">
      {/* Main grid column */}
      <div className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${selectedId ? "hidden lg:flex" : "flex"}`}>

        {/* Search + Filter bar */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PPA listings..."
                value={filter.search}
                onChange={(e) => { setFilter((f) => ({ ...f, search: e.target.value })); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:text-primary"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-2">
              <select
              title="select"
                value={filter.state}
                onChange={(e) => { setFilter((f) => ({ ...f, state: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s.value} value={s.label}>{s.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Industry (e.g. Technology)"
                value={filter.industry}
                onChange={(e) => { setFilter((f) => ({ ...f, industry: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {(filter.state || filter.industry) && (
                <button
                  onClick={() => { setFilter((f) => ({ ...f, state: "", industry: "" })); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <p className="text-lg font-medium">No PPA listings found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {listings.map((ppa) => (
                <PPACard
                  key={ppa.id}
                  ppa={ppa}
                  selected={selectedId === ppa.id}
                  onSelect={() => setSelectedId(ppa.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-2">
            <SitePagination
              totalPosts={pagination.totalItems}
              postsPerPage={pagination.itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Detail panel — slides in from right */}
      {selectedId && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSelectedId(null)}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-2xl overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0 lg:border-l lg:border-gray-200 lg:shadow-none pt-14 lg:pt-0">
            <PPADetailPanel id={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        </>
      )}
    </div>
  );
}
