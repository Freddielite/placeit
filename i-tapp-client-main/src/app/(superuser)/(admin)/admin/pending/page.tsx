"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { approveStudent, rejectStudent, approveCorps, rejectCorps, bulkApprove, bulkReject } from "@/actions";
import { useFetchPendingApprovals } from "@/queries/admin";
import { studentStatusStyle } from "@/utils/admin-status-style";
import { CheckSquare, Square, Users, BadgeCheck, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "students" | "corps";

function PendingRow({
  item,
  type,
  selected,
  onToggle,
  onApprove,
  onReject,
  isActing,
}: {
  item: any;
  type: Tab;
  selected: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  isActing: boolean;
}) {
  const name = `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim();
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        <button>{selected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-gray-300" />}</button>
      </td>
      <td className="p-3 font-medium text-sm">{name}</td>
      <td className="p-3 text-sm text-gray-500">{item.user?.email}</td>
      {type === "students" ? (
        <>
          <td className="p-3 text-sm">{item.school ?? "—"}</td>
          <td className="p-3 text-sm">{item.courseOfStudy ?? "—"}</td>
        </>
      ) : (
        <>
          <td className="p-3 text-sm">{item.stateOfDeployment ?? "—"}</td>
          <td className="p-3 text-sm">{item.nyscRegNumber ?? "—"}</td>
        </>
      )}
      <td className="p-3 text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td>
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2">
          <button disabled={isActing} onClick={onApprove} className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50">Approve</button>
          <button disabled={isActing} onClick={onReject} className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50">Reject</button>
        </div>
      </td>
    </tr>
  );
}

export default function PendingApprovalsPage() {
  const [tab, setTab] = useState<Tab>("students");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data, isLoading } = useFetchPendingApprovals();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
    queryClient.invalidateQueries({ queryKey: ["admin-all-students"] });
    queryClient.invalidateQueries({ queryKey: ["admin-all-corps"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const { execute: approveSt, isExecuting: approvingSt } = useAction(approveStudent, {
    onSuccess: () => { toast.success("Approved!"); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed"),
  });
  const { execute: rejectSt, isExecuting: rejectingSt } = useAction(rejectStudent, {
    onSuccess: () => { toast.success("Rejected."); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed"),
  });
  const { execute: approveCo, isExecuting: approvingCo } = useAction(approveCorps, {
    onSuccess: () => { toast.success("Approved!"); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed"),
  });
  const { execute: rejectCo, isExecuting: rejectingCo } = useAction(rejectCorps, {
    onSuccess: () => { toast.success("Rejected."); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed"),
  });
  const { execute: bulkApp, isExecuting: bulkingApp } = useAction(bulkApprove, {
    onSuccess: () => { toast.success("Bulk approved!"); setSelected(new Set()); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Bulk approve failed"),
  });
  const { execute: bulkRej, isExecuting: bulkingRej } = useAction(bulkReject, {
    onSuccess: () => { toast.success("Bulk rejected."); setSelected(new Set()); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Bulk reject failed"),
  });

  const students = data?.students ?? [];
  const corps = data?.corps ?? [];
  const items = tab === "students" ? students : corps;
  const isActing = approvingSt || rejectingSt || approvingCo || rejectingCo || bulkingApp || bulkingRej;

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i: any) => i.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "students", label: "Students", count: students.length, icon: <Users className="w-4 h-4" /> },
    { key: "corps", label: "Corps Members", count: corps.length, icon: <BadgeCheck className="w-4 h-4" /> },
  ];

  const colHeaders = tab === "students"
    ? ["", "Name", "Email", "School", "Course", "Signed Up", "Actions"]
    : ["", "Name", "Email", "State", "Call-Up No.", "Signed Up", "Actions"];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve new sign-ups before they access the platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelected(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              tab === t.key ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {t.icon}
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-primary">{selected.size} selected</span>
          <Button
            size="sm"
            disabled={isActing}
            onClick={() => bulkApp({ type: tab === "students" ? "student" : "corps", ids: Array.from(selected) })}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Approve All
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isActing}
            onClick={() => bulkRej({ type: tab === "students" ? "student" : "corps", ids: Array.from(selected) })}
            className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5" /> Reject All
          </Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl overflow-x-auto bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <CheckCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="font-semibold text-gray-700">All caught up!</p>
            <p className="text-sm text-gray-400 mt-1">No pending {tab} approvals</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">
                  <button onClick={toggleAll}>
                    {selected.size === items.length && items.length > 0
                      ? <CheckSquare className="w-4 h-4 text-primary" />
                      : <Square className="w-4 h-4 text-gray-300" />}
                  </button>
                </th>
                {colHeaders.slice(1).map((h) => (
                  <th key={h} className="p-3 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <PendingRow
                  key={item.id}
                  item={item}
                  type={tab}
                  selected={selected.has(item.id)}
                  onToggle={() => toggleOne(item.id)}
                  isActing={isActing}
                  onApprove={() =>
                    tab === "students"
                      ? approveSt({ studentId: item.id })
                      : approveCo({ corpsId: item.id })
                  }
                  onReject={() =>
                    tab === "students"
                      ? rejectSt({ studentId: item.id })
                      : rejectCo({ corpsId: item.id })
                  }
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
