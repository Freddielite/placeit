"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";

export default function SearchBar({
  setFilter,
}: {
  setFilter: (filter: any) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    setFilter((prev: any) => ({ ...prev, search: query }));
  };

  return (
    <div className="flex items-stretch gap-0 w-full border border-gray-300 bg-white overflow-hidden shadow-sm">
      {/* Text search */}
      <div className="flex items-center flex-1 gap-2 px-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by role or company…"
          className="flex-1 text-sm py-2.5 bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-800"
        />
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-200 self-stretch" />

      {/* Location */}
      <div className="flex items-center gap-1.5 px-3">
        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <select
          onChange={(e) => setFilter((prev: any) => ({ ...prev, location: e.target.value }))}
          className="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer py-2.5 pr-1"
        >
          <option value="">All States</option>
          {NIGERIAN_STATES.map((state) => (
            <option key={state.value} value={state.value}>{state.label}</option>
          ))}
        </select>
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        className="cursor-pointer px-5 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
      >
        Search
      </button>
    </div>
  );
}
