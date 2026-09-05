"use client";

import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/api";
import moment from "moment";

export default function Activity() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const res = await query("/admin/activity?limit=8");
      return res as { text: string; time: string; type?: string }[];
    },
  });

  const typeColor: Record<string, string> = {
    signup: "bg-primary/10 text-primary",
    approval: "bg-emerald-50 text-emerald-700",
    rejection: "bg-red-50 text-red-600",
    opportunity: "bg-amber-50 text-amber-700",
    default: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="flex flex-col border rounded-xl p-4 bg-white shadow-sm">
      <h4 className="font-semibold text-lg mb-3">Recent Activity</h4>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="text-sm text-gray-400 py-4 text-center">No recent activity</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${typeColor[item.type ?? "default"] ?? typeColor.default}`}>
                  {item.type ?? "event"}
                </span>
                <span className="text-sm text-gray-700 truncate">{item.text}</span>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {moment(item.time).fromNow()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
