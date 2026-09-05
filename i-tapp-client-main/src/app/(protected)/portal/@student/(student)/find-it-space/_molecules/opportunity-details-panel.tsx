"use client";

import { Opportunity } from "@/types";
import OpportunityDetailsContent from "./opportunity-details-content";

export function OpportunityDetailsPanel(props: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedOpportunity: Opportunity | null;
}) {
  if (!props.selectedId) return null;
  return (
    <aside className="h-full flex flex-col bg-white overflow-hidden">
      <OpportunityDetailsContent {...props} />
    </aside>
  );
}
