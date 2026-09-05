"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Arrow, ArrowLeft } from "iconsax-reactjs";
import { AlignLeftIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useFetchCompanyApplications } from "@/queries/admin";
import { applicationStatusStyle } from "@/utils/admin-status-style";

export default function ApplicationList({
  onSelect,
  selectedId,
  onBack,
  selectedCompany,
}: any) {
  const companyId = selectedCompany?.id;
  const [search, setSearch] = useState("");
  const {
    data = [],
    isLoading,
    error,
  } = useFetchCompanyApplications(companyId);

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
  }

  const filtered = data.filter((a: any) => {
    const student = a.student?.firstName || "";
    const opportunity = a.opportunity?.title || "";

    return (
      student.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.toLowerCase().includes(search.toLowerCase())
    );
  });

  const status = data?.status;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
        >
          <ChevronLeft size={16} />
        </button>
        <Input
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.length > 0 ? (
          filtered.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-lg border text-left transition ${
                selectedId === item.id
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">
                {item.student?.firstName ?? "—"} {item.student?.lastName ?? ""}
              </div>
              <div className="text-sm text-gray-500">
                {item.opportunity?.title ?? "—"}
                {/* {item.opportunity.company.name} */}
              </div>

              <span
                className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                  applicationStatusStyle[
                    item.status as keyof typeof applicationStatusStyle
                  ]
                } `}
              >
                {item.status}
              </span>
            </button>
          ))
        ) : (
          <div>No applications found.</div>
        )}
      </div>
    </div>
  );
}
