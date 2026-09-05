"use client";

import { useState } from "react";
import PlacementList from "./_molecules/placement-list";
import PlacementDetail from "./_molecules/placement-detail";
import { useFetchOffers } from "@/hooks/query";

export default function PlacementPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="w-full h-full flex">
      {/* LEFT LIST */}
      <div className="w-[350px] border-r h-full overflow-y-auto">
        <PlacementList onSelect={setSelected} selectedId={selected?.id} />
      </div>

      {/* RIGHT SIDE DETAIL PANEL */}
      <div className="flex-1 h-full overflow-y-auto">
        {selected ? (
          <PlacementDetail data={selected} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Select a placement request to view details
          </div>
        )}
      </div>
    </div>
  );
}
