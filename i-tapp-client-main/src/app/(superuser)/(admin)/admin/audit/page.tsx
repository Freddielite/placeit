"use client";

import { useState } from "react";
import { useFetchAuditLog } from "@/queries/admin";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const actionColor: Record<string, string> = {
  approve: "bg-emerald-50 text-emerald-700",
  reject: "bg-red-50 text-red-600",
  delete: "bg-red-100 text-red-800",
  restore: "bg-blue-50 text-blue-700",
  flag: "bg-amber-50 text-amber-700",
  unflag: "bg-gray-100 text-gray-600",
  create: "bg-primary/10 text-primary",
  update: "bg-sky-50 text-sky-700",
  default: "bg-gray-100 text-gray-500",
};

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFetchAuditLog(page);

  const entries: any[] = data?.entries ?? data ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">A record of all admin actions taken on the platform</p>
      </div>

      <div className="border rounded-xl overflow-x-auto bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No audit entries yet</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium">Time</th>
                <th className="p-3 text-left font-medium">Admin</th>
                <th className="p-3 text-left font-medium">Action</th>
                <th className="p-3 text-left font-medium">Target</th>
                <th className="p-3 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any, i: number) => (
                <tr key={entry.id ?? i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-400 whitespace-nowrap">
                    {moment(entry.createdAt ?? entry.timestamp).format("MMM D, YYYY HH:mm")}
                  </td>
                  <td className="p-3 font-medium">{entry.adminName ?? entry.admin?.email ?? "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${actionColor[entry.action ?? "default"] ?? actionColor.default}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    <span className="text-[11px] uppercase tracking-wide text-gray-400 mr-1">{entry.targetType}</span>
                    {entry.targetName ?? entry.targetId}
                  </td>
                  <td className="p-3 text-gray-500 text-xs max-w-xs truncate">{entry.details ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
