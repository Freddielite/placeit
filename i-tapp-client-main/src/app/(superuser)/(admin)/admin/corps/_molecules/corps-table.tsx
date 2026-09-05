"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  approveCorps,
  rejectCorps,
  bulkApprove,
  bulkReject,
  resendActivation,
} from "@/actions";
import { toast } from "react-toastify";
import { studentStatusStyle } from "@/utils/admin-status-style";
import { CheckSquare, Square, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CorpsTable({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-all-corps"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const { execute: approve, isExecuting: isApproving } = useAction(
    approveCorps,
    {
      onSuccess: () => {
        toast.success("Corps member approved!");
        invalidate();
      },
      onError: (e) =>
        toast.error(e?.error?.serverError || "Failed to approve."),
    },
  );
  const { execute: reject, isExecuting: isRejecting } = useAction(rejectCorps, {
    onSuccess: () => {
      toast.success("Corps member removed.");
      invalidate();
    },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to remove."),
  });
  const { execute: bulkApp, isExecuting: bulkingApp } = useAction(bulkApprove, {
    onSuccess: () => {
      toast.success("Bulk approved!");
      setSelected(new Set());
      invalidate();
    },
    onError: (e) => toast.error(e?.error?.serverError || "Bulk approve failed"),
  });
  const { execute: bulkRej, isExecuting: bulkingRej } = useAction(bulkReject, {
    onSuccess: () => {
      toast.success("Bulk rejected.");
      setSelected(new Set());
      invalidate();
    },
    onError: (e) => toast.error(e?.error?.serverError || "Bulk reject failed"),
  });
  const { execute: resend, isExecuting: isResending } = useAction(
    resendActivation,
    {
      onSuccess: () => toast.success("Activation email resent."),
      onError: (e) => toast.error(e?.error?.serverError || "Failed to resend."),
    },
  );

  if (isLoading) return <div className="p-4">Loading corps members...</div>;

  const filtered = data.filter((c: any) => {
    const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
    const email = (c.user?.email ?? "").toLowerCase();
    const q = search.toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      (c.callUpNumber ?? "").toLowerCase().includes(q)
    );
  });

  const isActing = isApproving || isRejecting || bulkingApp || bulkingRej;

  const toggleAll = () => {
    if (selected.size === filtered.length && filtered.length > 0)
      setSelected(new Set());
    else setSelected(new Set(filtered.map((c: any) => c.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search corps members..."
          className="border px-3 py-2 rounded w-64 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 mx-4 mb-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
          <span className="text-sm font-semibold text-primary">
            {selected.size} selected
          </span>
          <Button
            size="sm"
            disabled={isActing}
            onClick={() =>
              bulkApp({ type: "corps", ids: Array.from(selected) })
            }
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Approve All
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isActing}
            onClick={() =>
              bulkRej({ type: "corps", ids: Array.from(selected) })
            }
            className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5" /> Reject All
          </Button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">
              <button onClick={toggleAll}>
                {selected.size === filtered.length && filtered.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">State</th>
            <th className="p-3">NYSC Reg. No.</th>
            <th className="p-3">Account</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c: any) => (
            <tr
              key={c.id}
              className="border-b hover:bg-gray-50 transition cursor-pointer"
              onClick={() => router.push(`corps/${c.id}`)}
            >
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleOne(c.id)}>
                  {selected.has(c.id) ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </td>
              <td className="p-3 font-medium">
                {c.firstName} {c.lastName}
              </td>
              <td className="p-3 text-gray-500">{c.user?.email}</td>
              <td className="p-3">{c.stateOfDeployment ?? "—"}</td>
              <td className="p-3">{c.nyscRegNumber ?? "—"}</td>
              <td className="p-3">
                {c.user?.isActive ? "Active" : "Inactive"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${studentStatusStyle[c.status as keyof typeof studentStatusStyle] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {c.status ?? "pending"}
                </span>
              </td>
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <button
                    disabled={isActing}
                    onClick={() => approve({ corpsId: c.id })}
                    className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isActing}
                    onClick={() => reject({ corpsId: c.id })}
                    className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 cursor-pointer"
                  >
                    Remove
                  </button>
                  {!c.user?.isActive && c.user?.email && (
                    <button
                      disabled={isResending}
                      onClick={() => resend({ email: c.user.email })}
                      className="px-3 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 cursor-pointer"
                    >
                      {isResending ? "Sending..." : "Resend"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-6 text-gray-400">
                No corps members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
