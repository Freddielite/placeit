"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFetchCompanies } from "@/queries/admin";

export default function CompanyList({ onSelect, selectedId }: any) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFetchCompanies();

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  const filtered = data.filter(
    (item: any) => item.name.toLowerCase().includes(search.toLowerCase()),
    // item.opportunity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="Search companies or opportunities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        {filtered.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-3 rounded-lg border text-left transition hover:bg-gray-100"
          >
            <div className="font-medium">{item.name}</div>

            <div className="text-xs text-gray-500">ID: {item.id}</div>

            {/* <div className="mt-2 text-xs font-semibold text-gray-600">
              {item.totalApplications} applications
            </div> */}
          </button>
        ))}
      </div>
    </div>
  );
}
