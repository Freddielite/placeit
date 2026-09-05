"use client";

import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/api";
import Link from "next/link";

export default function TopCompanies() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-top-companies"],
    queryFn: async () => {
      const res = await query("/admin/companies/top?limit=6");
      return res as { id: string; name: string; applicationCount: number; opportunityCount: number }[];
    },
  });

  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg">Top Companies</h4>
        <Link href="/admin/company" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="text-sm text-gray-400 py-4 text-center">No companies yet</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.map((company, index) => (
            <Link key={company.id} href={`/admin/company/${company.id}`} className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 rounded transition">
              <span className="text-sm font-medium text-gray-800">
                {index + 1}. {company.name}
              </span>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">{company.applicationCount} applications</p>
                <p className="text-[11px] text-gray-400">{company.opportunityCount} listings</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
