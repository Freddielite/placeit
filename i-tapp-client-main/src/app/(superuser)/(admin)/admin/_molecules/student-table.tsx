"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentStatusStyle } from "@/utils/admin-status-style";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import {
  approveStudent,
  rejectStudent,
  bulkApprove,
  bulkReject,
  resendActivation,
} from "@/actions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Square, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentTable({
  data,
  isLoading,
}: {
  isLoading: boolean;
  data: any;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-all-students"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const { execute: approve, isExecuting: isApproving } = useAction(
    approveStudent,
    {
      onSuccess: () => {
        toast.success("Student approved!");
        invalidate();
      },
      onError: (e) =>
        toast.error(e?.error?.serverError || "Failed to approve."),
    },
  );
  const { execute: reject, isExecuting: isRejecting } = useAction(
    rejectStudent,
    {
      onSuccess: () => {
        toast.success("Student removed.");
        invalidate();
      },
      onError: (e) => toast.error(e?.error?.serverError || "Failed to remove."),
    },
  );
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

  if (isLoading) return <div className="p-4">Loading students...</div>;

  const filteredStudents = (data ?? []).filter((s: any) => {
    const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.toLowerCase();
    const email = s.user?.email?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      (s.courseOfStudy ?? "").toLowerCase().includes(q)
    );
  });

  const isActing = isApproving || isRejecting || bulkingApp || bulkingRej;

  const toggleAll = () => {
    if (
      selected.size === filteredStudents.length &&
      filteredStudents.length > 0
    )
      setSelected(new Set());
    else setSelected(new Set(filteredStudents.map((s: any) => s.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      <div className="p-4 flex justify-between items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search students..."
          className="border px-3 py-2 rounded w-64 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href="student/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add Student
        </Link>
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
              bulkApp({ type: "student", ids: Array.from(selected) })
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
              bulkRej({ type: "student", ids: Array.from(selected) })
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
                {selected.size === filteredStudents.length &&
                filteredStudents.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </th>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Program</th>
            <th className="p-3">Account</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s: any, index: number) => (
            <tr
              key={s.id}
              className="border-b hover:bg-gray-100 transition cursor-pointer"
              onClick={() => router.push(`student/${s.id}`)}
            >
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleOne(s.id)}>
                  {selected.has(s.id) ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </td>
              <td className="p-3">
                <div className="rounded-full h-10 w-10">
                  <Image
                    src={s?.profileImage || "/applicant.png"}
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
              </td>
              <td className="p-3">
                {s.firstName} {s.lastName}
              </td>
              <td className="p-3">{s?.user?.email}</td>
              <td className="p-3">{s?.courseOfStudy}</td>
              <td className="p-3">
                {s?.user?.isActive ? "Active" : "Inactive"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${studentStatusStyle[s.status as keyof typeof studentStatusStyle]}`}
                >
                  {s.status}
                </span>
              </td>
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <button
                    disabled={isActing}
                    onClick={() => approve({ studentId: s.id })}
                    className="px-3 py-1 cursor-pointer text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isActing}
                    onClick={() => reject({ studentId: s.id })}
                    className="px-3 py-1 cursor-pointer text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                  >
                    Remove
                  </button>
                  {!s.user?.isActive && s.user?.email && (
                    <button
                      disabled={isResending}
                      onClick={() => resend({ email: s.user.email })}
                      className="px-3 py-1 cursor-pointer text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
