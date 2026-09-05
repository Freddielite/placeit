"use client";

import { useFetchAdminAnalytics } from "@/queries/admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  applied: "#6366f1",
  in_review: "#f59e0b",
  shortlisted: "#8b5cf6",
  offered: "#0ea5e9",
  accepted: "#10b981",
  rejected: "#ef4444",
  withdrawn: "#9ca3af",
};

const PROGRAM_COLORS = { siwes: "#0ea5e9", ppa: "#8b5cf6" };

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading } = useFetchAdminAnalytics();

  const statusData = data?.applicationsByStatus
    ? Object.entries(data.applicationsByStatus).map(([name, value]) => ({ name, value: value as number }))
    : [];

  const programData = data?.applicationsByProgram
    ? [
        { name: "SIWES", value: data.applicationsByProgram.siwes ?? 0 },
        { name: "PPA", value: data.applicationsByProgram.ppa ?? 0 },
      ]
    : [];

  const weeklyData: any[] = data?.weeklyApplications ?? [];

  const topCompanies: any[] = data?.topCompaniesByApplications ?? [];

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-3xl font-bold">Application Analytics</h1>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={data?.totalApplications ?? 0} />
        <StatCard label="Placement Rate" value={data?.placementRate ? `${data.placementRate}%` : "—"} sub="accepted / total" />
        <StatCard label="SIWES Applications" value={data?.applicationsByProgram?.siwes ?? 0} />
        <StatCard label="PPA Applications" value={data?.applicationsByProgram?.ppa ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by status */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Applications by Status</h3>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
        </div>

        {/* SIWES vs PPA split */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">SIWES vs PPA Split</h3>
          {programData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={programData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {programData.map((entry) => (
                    <Cell key={entry.name} fill={PROGRAM_COLORS[entry.name.toLowerCase() as keyof typeof PROGRAM_COLORS] ?? "#9ca3af"} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
        </div>

        {/* Weekly applications trend */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Weekly Applications (Last 8 weeks)</h3>
          {weeklyData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
        </div>
      </div>

      {/* Top companies by applications */}
      {topCompanies.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Top Companies by Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium">#</th>
                  <th className="p-3 text-left font-medium">Company</th>
                  <th className="p-3 text-left font-medium">Listings</th>
                  <th className="p-3 text-left font-medium">Applications</th>
                  <th className="p-3 text-left font-medium">Accepted</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((c: any, i: number) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3 text-gray-400">{i + 1}</td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{c.opportunityCount}</td>
                    <td className="p-3">{c.applicationCount}</td>
                    <td className="p-3">
                      <span className="text-emerald-600 font-semibold">{c.acceptedCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
