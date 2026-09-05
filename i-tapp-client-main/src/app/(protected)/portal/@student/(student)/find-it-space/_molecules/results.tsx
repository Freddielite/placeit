import { cn } from "@/utils/tailwind";
import SearchBar from "./search";
import { Opportunity } from "@/types";
import AvailableOpportunity from "./available-opportunity";
import { Inbox, X } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white p-4 border-l-[3px] border-l-transparent animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 w-3/4" />
          <div className="h-3 bg-gray-100 w-1/2" />
          <div className="h-3 bg-gray-100 w-1/3" />
          <div className="flex gap-2 mt-1">
            <div className="h-4 w-12 bg-gray-100" />
            <div className="h-4 w-14 bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between">
        <div className="h-3 w-20 bg-gray-100" />
        <div className="h-3 w-20 bg-gray-100" />
      </div>
    </div>
  );
}

export default function Results({
  selectedId,
  setSelectedId,
  opportunities,
  setSelectedOpportunity,
  setFilter,
  isLoading,
  filter,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setSelectedOpportunity: (name: Opportunity | null) => void;
  opportunities: Opportunity[];
  setFilter: (filter: any) => void;
  isLoading: boolean;
  filter?: any;
}) {
  const isDetailsOpen = !!selectedId;

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filter) {
    filter.status?.filter((s: any) => s.checked).forEach((s: any) =>
      activeChips.push({
        label: s.status,
        clear: () => setFilter({ ...filter, status: filter.status.map((x: any) => ({ ...x, checked: x.id === s.id ? false : x.checked })) }),
      })
    );
    filter.duration?.filter((d: any) => d.checked).forEach((d: any) =>
      activeChips.push({
        label: `${d.time} months`,
        clear: () => setFilter({ ...filter, duration: filter.duration.map((x: any) => ({ ...x, checked: x.id === d.id ? false : x.checked })) }),
      })
    );
    filter.industry?.filter((i: any) => i.checked).forEach((i: any) =>
      activeChips.push({
        label: i.industry,
        clear: () => setFilter({ ...filter, industry: filter.industry.map((x: any) => ({ ...x, checked: x.id === i.id ? false : x.checked })) }),
      })
    );
    if (filter.location) activeChips.push({ label: filter.location, clear: () => setFilter({ ...filter, location: "" }) });
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Page identity header */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-200 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Find IT Space</p>
        <p className="text-xs text-gray-400">Browse open SIWES placements from companies across Nigeria.</p>
        <div className="mt-3">
          <SearchBar setFilter={setFilter} />
        </div>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">Active</span>
          {activeChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={chip.clear}
              className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary/8 text-primary border border-primary/20 shrink-0 hover:bg-primary/15 transition-colors"
            >
              {chip.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Results bar — count + sort toggle */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0 flex items-center justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {isLoading ? "Loading…" : `${opportunities.length} placement${opportunities.length !== 1 ? "s" : ""} found`}
        </p>
        {filter && (
          <div className="flex items-center gap-px shrink-0">
            {(["most recent", "oldest"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter({ ...filter, sortBy: opt })}
                className={cn(
                  "cursor-pointer px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide border transition-colors",
                  (filter.sortBy ?? "most recent") === opt
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
                )}
              >
                {opt === "most recent" ? "Newest" : "Oldest"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card grid — edge-to-edge tiles */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {isLoading ? (
          <div className={cn(
            "grid gap-px",
            "grid-cols-1",
            isDetailsOpen ? "lg:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3",
          )}>
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white text-gray-400">
            <Inbox className="w-10 h-10 stroke-[1.5]" />
            <p className="text-sm font-semibold text-gray-600">No placements found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-px",
            "grid-cols-1",
            isDetailsOpen ? "lg:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3",
          )}>
            {opportunities.map((item, index) => (
              <AvailableOpportunity
                details={item}
                key={item.id ?? index}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                setSelectedOpportunity={setSelectedOpportunity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
