"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFetchOffers } from "@/queries/admin";

export default function PlacementList({ onSelect, selectedId }: any) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFetchOffers();

  if (isLoading) {
    return <div>Loading placement offers...</div>;
  }

  const filtered = data.filter((item: any) => {
    const student = item.application?.student;
    if (!student) return true;
    const name = `${student.firstName ?? ""} ${student.lastName ?? ""}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        {filtered.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-lg border text-left transition 
              ${
                selectedId === item.id
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <div className="font-medium">
              {item.application?.student
                ? `${item.application.student.firstName ?? ""} ${item.application.student.lastName ?? ""}`.trim()
                : "Unknown Student"}
            </div>
            <div className="text-sm text-gray-500">{item.company?.name ?? "—"}</div>

            {/* <span
              className={`text-xs px-2 py-1 rounded mt-1 inline-block
                ${
                  item.status === "Pending"
                    ? "bg-yellow-200 text-yellow-700"
                    : item.status === "Approved"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }
              `}
            >
              {item.status}
            </span> */}
          </button>
        ))}
      </div>
    </div>
  );
}
