// opportunity-details-mobile.tsx
"use client";

import { Opportunity } from "@/types";
import OpportunityDetailsContent from "./opportunity-details-content";

export function OpportunityDetailsMobile(props: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedOpportunity: Opportunity | null;
}) {
  if (!props.selectedId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="h-14 border-b flex items-center px-3">
        <button onClick={() => props.setSelectedId(null)}>Back</button>
      </div>
      {/* optional: make content scroll */}
      <div className="h-[calc(100vh-56px)] overflow-auto">
        <OpportunityDetailsContent {...props} />
      </div>
    </div>
  );
}
