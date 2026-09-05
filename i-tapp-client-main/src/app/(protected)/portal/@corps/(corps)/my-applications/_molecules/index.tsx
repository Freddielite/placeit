"use client";

import { useState } from "react";
import { useFetchCorpsApplications } from "@/queries/corps";
import { withdrawPPAApplication } from "@/actions";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MapPin, Clock, Building2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/utils/tailwind";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700",
  shortlisted: "bg-yellow-50 text-yellow-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export default function CorpsMyApplications() {
  const [filterStatus, setFilterStatus] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetchCorpsApplications(
    filterStatus === "all" ? undefined : filterStatus
  );
  const applications: any[] = data?.data?.applications ?? [];

  const { execute: withdraw, isExecuting: isWithdrawing } = useAction(withdrawPPAApplication, {
    onSuccess: () => {
      toast.success("Application withdrawn.");
      queryClient.invalidateQueries({ queryKey: ["corps-applications"] });
    },
    onError: () => toast.error("Failed to withdraw."),
  });

  const statuses = ["all", "applied", "shortlisted", "accepted", "rejected"];

  return (
    <Wrapper className="pt-14 pb-10">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            <p className="text-gray-500 mt-1 text-sm">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                  filterStatus === s
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm mt-1">Browse PPA listings to get started</p>
            <Link href="/portal/find-ppa" className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
              Find PPA
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app: any) => {
              const opp = app.opportunity;
              const company = opp?.company;
              return (
                <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0">
                      {company?.name?.charAt(0) ?? "P"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{opp?.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />{company?.name}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp?.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp?.duration}</span>
                        <span>Applied {formatDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", STATUS_COLORS[app.status] ?? "bg-gray-100 text-gray-500")}>
                      {app.status}
                    </span>
                    {app.status === "applied" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isWithdrawing}
                        onClick={() => withdraw({ id: opp?.id })}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
