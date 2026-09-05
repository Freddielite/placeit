"use client";

import { cn } from "@/utils/tailwind";
import FilterCompanies from "./filter-content";

export default function FilterMobile(props: {
  filter: any;
  setFilter: (f: any) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
  filterActive: boolean;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 bg-white z-50 lg:hidden flex flex-col",
        "transition-transform duration-300 ease-in-out",
        props.filterActive ? "translate-x-0" : "-translate-x-full",
        "w-[min(288px,85vw)]",
      )}
      style={{ boxShadow: props.filterActive ? "4px 0 24px rgba(0,0,0,0.10)" : "none" }}
    >
      <div className="flex-1 overflow-y-auto">
        <FilterCompanies {...props} />
      </div>

      {/* Apply button */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={() => props.setFilterActive(false)}
          className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
