"use client";

import { useState } from "react";
import SummaryCard from "../_molecules/summary-card";
import CorpsTable from "./_molecules/corps-table";
import { useFetchAllCorps, useFetchAdminCorpsApplications } from "@/queries/admin";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

function CorpsApplicationsTab() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useFetchAdminCorpsApplications({ status: statusFilter || undefined });
  const applications: any[] = data?.data?.applications ?? data?.data ?? data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="border rounded-xl overflow-x-auto bg-white shadow">
        {isLoading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Corps Member</th>
                <th className="p-3">PPA</th>
                <th className="p-3">State</th>
                <th className="p-3">Applied</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any) => (
                <tr key={app.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">
                    {app.corps?.firstName} {app.corps?.lastName}
                    <div className="text-xs text-gray-400">{app.corps?.user?.email}</div>
                  </td>
                  <td className="p-3">{app.ppa?.organisationName ?? app.ppa?.name ?? "—"}</td>
                  <td className="p-3">{app.ppa?.state ?? "—"}</td>
                  <td className="p-3 text-gray-500">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[app.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {app.status ?? "pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminCorpsPage() {
  const [tab, setTab] = useState<"members" | "applications">("members");
  const { data, isLoading } = useFetchAllCorps();

  const corps: any[] = data ?? [];
  const pending = corps.filter((c) => c.status === "pending").length;
  const approved = corps.filter((c) => c.status === "approved").length;

  const summaryItems = [
    { title: "Total Corps Members", number: corps.length, component: "" },
    { title: "Approved", number: approved, component: "" },
    { title: "Pending Approval", number: pending, component: "" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Corps Members</h1>

      <div className="flex flex-wrap gap-6">
        {summaryItems.map((item) => (
          <SummaryCard key={item.title} title={item.title} number={item.number} component={item.component} />
        ))}
      </div>

      <div className="flex gap-1 border-b">
        {(["members", "applications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition capitalize ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t === "members" ? "Corps Members" : "PPA Applications"}
          </button>
        ))}
      </div>

      {tab === "members" ? (
        <CorpsTable data={corps} isLoading={isLoading} />
      ) : (
        <CorpsApplicationsTab />
      )}
    </div>
  );
}
