"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toggleUserActive } from "@/actions";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function UsersTable({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { execute: toggle, isExecuting } = useAction(toggleUserActive, {
    onSuccess: () => {
      toast.success("User status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
    },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to update."),
  });

  if (isLoading) return <div className="p-4">Loading users...</div>;

  const filtered = (data ?? []).filter((u: any) => {
    const q = search.toLowerCase();
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.firstName ?? "").toLowerCase().includes(q) ||
      (u.lastName ?? "").toLowerCase().includes(q) ||
      (u.role ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by name, email, or role…"
          className="border px-3 py-2 rounded w-72 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 font-medium text-gray-600">ID</th>
            <th className="p-3 font-medium text-gray-600">Email</th>
            <th className="p-3 font-medium text-gray-600">First Name</th>
            <th className="p-3 font-medium text-gray-600">Last Name</th>
            <th className="p-3 font-medium text-gray-600">Role</th>
            <th className="p-3 font-medium text-gray-600">Created</th>
            <th className="p-3 font-medium text-gray-600">Onboarded</th>
            <th className="p-3 font-medium text-gray-600">Active</th>
            <th className="p-3 font-medium text-gray-600">Verified</th>
            <th className="p-3 font-medium text-gray-600">Paid</th>
            <th className="p-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u: any) => (
            <tr key={u.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3 text-gray-400 text-xs font-mono">{u.id?.slice(0, 8)}…</td>
              <td className="p-3">{u.email ?? "—"}</td>
              <td className="p-3">{u.firstName ?? "—"}</td>
              <td className="p-3">{u.lastName ?? "—"}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                  {u.role ?? "—"}
                </span>
              </td>
              <td className="p-3 text-gray-500 whitespace-nowrap">
                {u.createdAt ? format(new Date(u.createdAt), "dd MMM yyyy") : "—"}
              </td>
              <td className="p-3">
                <StatusDot value={u.isOnboarded} />
              </td>
              <td className="p-3">
                <StatusDot value={u.isActive} />
              </td>
              <td className="p-3">
                <StatusDot value={u.isVerified} />
              </td>
              <td className="p-3">
                <StatusDot value={u.hasPaid} />
              </td>
              <td className="p-3">
                <button
                  disabled={isExecuting}
                  onClick={() => toggle({ userId: u.id, isActive: !u.isActive })}
                  className={`px-3 py-1 text-xs rounded font-medium disabled:opacity-50 cursor-pointer transition ${
                    u.isActive
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={11} className="text-center p-6 text-gray-400">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusDot({ value }: { value: boolean | undefined }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${value ? "text-emerald-600" : "text-gray-400"}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${value ? "bg-emerald-500" : "bg-gray-300"}`}
      />
      {value ? "Yes" : "No"}
    </span>
  );
}
