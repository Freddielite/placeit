"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SitePagination } from "@/components/ui/site-pagination";
import { useAction } from "next-safe-action/hooks";
import { updateOpportunityStatus } from "@/actions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Flag, FlagOff } from "lucide-react";

export default function OpportunityTable({
  data,
  isLoading,
  currentPage,
  setCurrentPage,
}: {
  data: any[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { execute: updateStatus, isExecuting } = useAction(updateOpportunityStatus, {
    onSuccess: () => {
      toast.success("Opportunity updated.");
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to update."),
  });

  if (isLoading) return <div>Loading...</div>;

  const filtered = (data ?? []).filter(
    (item: any) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.company?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: "bg-emerald-100 text-emerald-700",
      closed: "bg-gray-100 text-gray-600",
      flagged: "bg-red-100 text-red-700",
      draft: "bg-amber-50 text-amber-700",
    };
    return map[status] ?? "bg-gray-100 text-gray-500";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <Input
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Program</th>
              <th className="text-left p-3 font-medium">Location</th>
              <th className="text-left p-3 font-medium">Applications</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-500 py-6 italic">No matching opportunities</td></tr>
            )}
            {filtered.map((item: any) => (
              <tr key={item.id} className={`border-b hover:bg-gray-50 transition ${item.status === "flagged" ? "bg-red-50/40" : ""}`}>
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3 text-gray-600">{item?.company?.name ?? "N/A"}</td>
                <td className="p-3">
                  {item.programType && (
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${item.programType === "ppa" ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"}`}>
                      {item.programType}
                    </span>
                  )}
                </td>
                <td className="p-3">{item.location}</td>
                <td className="p-3">{item.totalApplications ?? 0}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/opportunities/${item.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    {item.status === "flagged" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isExecuting}
                        onClick={() => updateStatus({ opportunityId: item.id, status: "open" })}
                        className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <FlagOff className="w-3.5 h-3.5" /> Unflag
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isExecuting}
                        onClick={() => updateStatus({ opportunityId: item.id, status: "flagged" })}
                        className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Flag className="w-3.5 h-3.5" /> Flag
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="text-center text-gray-500 py-4">
                <SitePagination currentPage={currentPage} postsPerPage={10} totalPosts={20} setCurrentPage={setCurrentPage} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
