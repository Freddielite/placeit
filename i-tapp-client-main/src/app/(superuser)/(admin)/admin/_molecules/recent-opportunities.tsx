"use client";

import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/api";
import Link from "next/link";
import moment from "moment";

export default function RecentOpportunities() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-recent-opportunities"],
    queryFn: async () => {
      const res = await query("/admin/opportunities/recent?limit=6");
      return res as { id: string; title: string; company: { name: string }; createdAt: string; status: string; programType?: string }[];
    },
  });

  const programBadge: Record<string, string> = {
    siwes: "bg-sky-50 text-sky-700",
    ppa: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg">Recent Opportunities</h4>
        <Link href="/admin/opportunities" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="text-sm text-gray-400 py-4 text-center">No opportunities yet</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.map((op) => (
            <Link key={op.id} href={`/admin/opportunities/${op.id}`} className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 rounded transition">
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{op.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-gray-400 truncate">{op.company?.name}</p>
                  {op.programType && (
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${programBadge[op.programType] ?? ""}`}>
                      {op.programType}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">{moment(op.createdAt).fromNow()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
