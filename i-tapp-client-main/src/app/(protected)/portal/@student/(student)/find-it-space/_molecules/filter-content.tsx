"use client";

import Input from "@/components/input";
import { cn } from "@/utils/tailwind";
import { X } from "lucide-react";
import React from "react";

type CheckedItem = { id: number; checked: boolean; [key: string]: any };

type FilterState = {
  sortBy?: "most recent" | "oldest";
  status: CheckedItem[];
  duration: CheckedItem[];
  industry: CheckedItem[];
  location: string;
};

export default function FilterCompanies({
  filter,
  setFilter,
  setFilterActive,
  onBack,
}: {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  const toggleMulti = (key: keyof FilterState, id: number) => {
    const list = filter[key] as CheckedItem[];
    setFilter({
      ...filter,
      [key]: list.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    });
  };

  const setSingle = (key: keyof FilterState, id: number) => {
    const list = filter[key] as CheckedItem[];
    const clicked = list.find((x) => x.id === id);
    const willUnset = Boolean(clicked?.checked);
    setFilter({
      ...filter,
      [key]: list.map((item) => ({
        ...item,
        checked: willUnset ? false : item.id === id,
      })),
    });
  };

  const resetAll = () => {
    setFilter({
      ...filter,
      sortBy: "most recent",
      duration: filter.duration.map((d) => ({ ...d, checked: false })),
      industry: filter.industry.map((i) => ({ ...i, checked: false })),
      status: filter.status.map((s) => ({ ...s, checked: false })),
      location: "",
    });
  };

  const hasActive =
    filter.duration.some((d) => d.checked) ||
    filter.industry.some((i) => i.checked) ||
    filter.status.some((s) => s.checked) ||
    Boolean(filter.location);

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Filters
        </p>
        {hasActive && (
          <button
            type="button"
            onClick={resetAll}
            className="cursor-pointer flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-4">
        {/* Sort */}
        <Section title="Sort By">
          <div className="flex gap-2">
            {(["most recent", "oldest"] as const).map((s) => (
              <Chip
                key={s}
                active={(filter.sortBy ?? "most recent") === s}
                onClick={() => setFilter({ ...filter, sortBy: s })}
              >
                {s}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Status */}
        <Section title="Status">
          <div className="flex flex-wrap gap-2">
            {filter.status.map((s: any) => (
              <Chip
                key={s.id}
                active={Boolean(s.checked)}
                onClick={() => setSingle("status", s.id)}
              >
                {s.status}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Duration */}
        <Section title="Duration">
          <div className="flex flex-wrap gap-2">
            {filter.duration.map((d: any) => (
              <Chip
                key={d.id}
                active={Boolean(d.checked)}
                onClick={() => setSingle("duration", d.id)}
              >
                {d.time} months
              </Chip>
            ))}
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <Input
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
            placeholder="e.g Lagos"
            className="rounded-none text-sm"
          />
        </Section>

        {/* Industry */}
        <Section title="Industry">
          <div className="flex flex-wrap gap-2">
            {filter.industry.map((i: any) => (
              <Chip
                key={i.id}
                active={Boolean(i.checked)}
                onClick={() => toggleMulti("industry", i.id)}
              >
                {i.industry}
              </Chip>
            ))}
          </div>
        </Section>
      </div>
      <div className="mt-auto pt-5 pb-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-56 text-center">
          Only placements from registered companies are shown. Verified
          companies are reviewed by our team.
        </p>
      </div>
    </div>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2.5">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {title}
    </p>
    {children}
  </div>
);

const Chip = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center px-3 py-1 text-xs font-medium capitalize transition cursor-pointer border",
      active
        ? "bg-primary border-primary text-white"
        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400",
    )}
  >
    {children}
  </button>
);
