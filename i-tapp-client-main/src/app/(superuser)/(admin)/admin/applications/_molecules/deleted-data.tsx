"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { query } from "@/lib/api";
import { Search, Trash2, User, Building, Briefcase, FileText, RotateCcw } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { restoreRecord, purgeRecord } from "@/actions";
import { toast } from "react-toastify";

type DeletedCategory = "students" | "companies" | "opportunities" | "applications";

const CATEGORIES: { key: DeletedCategory; label: string; icon: React.ReactNode; endpoint: string }[] = [
  { key: "students", label: "Students", icon: <User size={14} />, endpoint: "/admin/deleted/students" },
  { key: "companies", label: "Companies", icon: <Building size={14} />, endpoint: "/admin/deleted/companies" },
  { key: "opportunities", label: "Opportunities", icon: <Briefcase size={14} />, endpoint: "/admin/deleted/opportunities" },
  { key: "applications", label: "Applications", icon: <FileText size={14} />, endpoint: "/admin/deleted/applications" },
];

function useDeletedData(category: DeletedCategory) {
  const cat = CATEGORIES.find((c) => c.key === category)!;
  return useQuery({
    queryKey: ["admin-deleted", category],
    queryFn: async () => {
      const response = await query(cat.endpoint);
      return response as any[];
    },
  });
}

function getLabel(item: any, category: DeletedCategory): { primary: string; secondary: string; tertiary?: string } {
  switch (category) {
    case "students":
      return {
        primary: `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() || "Unknown Student",
        secondary: item.user?.email ?? item.email ?? "—",
        tertiary: item.courseOfStudy ?? "",
      };
    case "companies":
      return {
        primary: item.name ?? "Unknown Company",
        secondary: item.user?.email ?? item.email ?? "—",
        tertiary: item.industry ?? "",
      };
    case "opportunities":
      return {
        primary: item.title ?? "Untitled Opportunity",
        secondary: item.company?.name ?? "—",
        tertiary: item.location ?? "",
      };
    case "applications":
      return {
        primary: `${item.student?.firstName ?? ""} ${item.student?.lastName ?? ""}`.trim() || "Unknown Student",
        secondary: item.opportunity?.title ?? "—",
        tertiary: item.status ?? "",
      };
  }
}

export default function DeletedData() {
  const [category, setCategory] = useState<DeletedCategory>("students");
  const [search, setSearch] = useState("");
  const [confirmPurge, setConfirmPurge] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useDeletedData(category);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-deleted", category] });

  const { execute: restore, isExecuting: isRestoring } = useAction(restoreRecord, {
    onSuccess: () => { toast.success("Record restored successfully."); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to restore."),
  });

  const { execute: purge, isExecuting: isPurging } = useAction(purgeRecord, {
    onSuccess: () => { toast.success("Record permanently deleted."); setConfirmPurge(null); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to delete."),
  });

  const filtered = data.filter((item: any) => {
    const { primary, secondary, tertiary } = getLabel(item, category);
    const q = search.toLowerCase();
    return (
      primary.toLowerCase().includes(q) ||
      secondary.toLowerCase().includes(q) ||
      (tertiary ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Trash2 size={18} className="text-red-500" />
        <h2 className="font-semibold text-gray-800">Soft-Deleted Records</h2>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setCategory(cat.key); setSearch(""); setConfirmPurge(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              category === cat.key
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search deleted ${category}...`}
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400 py-8 text-center">
          No deleted {category} found{search ? ` matching "${search}"` : ""}.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">
                  {category === "applications" ? "Student" : category === "opportunities" ? "Title" : "Name"}
                </th>
                <th className="px-4 py-3">
                  {category === "students" || category === "companies" ? "Email" : category === "opportunities" ? "Company" : "Opportunity"}
                </th>
                <th className="px-4 py-3">
                  {category === "students" ? "Course" : category === "companies" ? "Industry" : category === "opportunities" ? "Location" : "Status"}
                </th>
                <th className="px-4 py-3">Deleted At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item: any, i: number) => {
                const { primary, secondary, tertiary } = getLabel(item, category);
                const isConfirming = confirmPurge === item.id;
                return (
                  <tr key={item.id ?? i} className="hover:bg-red-50/40 transition">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{primary}</td>
                    <td className="px-4 py-3 text-gray-500">{secondary}</td>
                    <td className="px-4 py-3 text-gray-500">{tertiary || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-medium">Sure?</span>
                          <button
                            disabled={isPurging}
                            onClick={() => purge({ id: item.id, category })}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {isPurging ? "Deleting..." : "Yes, delete"}
                          </button>
                          <button
                            onClick={() => setConfirmPurge(null)}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            disabled={isRestoring}
                            onClick={() => restore({ id: item.id, category })}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                          >
                            <RotateCcw size={11} /> Restore
                          </button>
                          <button
                            onClick={() => setConfirmPurge(item.id)}
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 border-t">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </div>
        </div>
      )}
    </div>
  );
}
