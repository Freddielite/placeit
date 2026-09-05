"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFetchAdminSearch } from "@/queries/admin";
import Link from "next/link";
import { Users, BadgeCheck, Building2, Briefcase, SearchX } from "lucide-react";

function ResultSection({ title, icon, items, renderItem }: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  if (!items?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
        <span className="text-primary">{icon}</span>
        <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
        <span className="ml-auto text-xs text-gray-400">{items.length} result{items.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="divide-y divide-gray-50">
        {items.map((item) => renderItem(item))}
      </div>
    </div>
  );
}

function AdminSearchContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const { data, isLoading } = useFetchAdminSearch(q);

  const total = (data?.students?.length ?? 0) + (data?.corps?.length ?? 0) +
    (data?.companies?.length ?? 0) + (data?.opportunities?.length ?? 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Search Results</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {q ? <>Results for <strong>"{q}"</strong></> : "Enter a search term above"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : q.trim().length < 2 ? (
        <p className="text-gray-400 text-sm">Type at least 2 characters to search.</p>
      ) : total === 0 ? (
        <div className="text-center py-16">
          <SearchX className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No results found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different name, email, or ID</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ResultSection
            title="Students"
            icon={<Users className="w-4 h-4" />}
            items={data?.students ?? []}
            renderItem={(s) => (
              <Link key={s.id} href={`/admin/student/${s.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-gray-400">{s.user?.email} · {s.school ?? "—"}</p>
                </div>
                <span className="text-xs text-gray-400">{s.status}</span>
              </Link>
            )}
          />
          <ResultSection
            title="Corps Members"
            icon={<BadgeCheck className="w-4 h-4" />}
            items={data?.corps ?? []}
            renderItem={(c) => (
              <Link key={c.id} href={`/admin/corps/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-gray-400">{c.user?.email} · {c.stateOfDeployment ?? "—"}</p>
                </div>
                <span className="text-xs text-gray-400">{c.status}</span>
              </Link>
            )}
          />
          <ResultSection
            title="Companies"
            icon={<Building2 className="w-4 h-4" />}
            items={data?.companies ?? []}
            renderItem={(co) => (
              <Link key={co.id} href={`/admin/company/${co.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">{co.name}</p>
                  <p className="text-xs text-gray-400">{co.industry ?? "—"} · {co.city ?? co.state ?? "—"}</p>
                </div>
                <span className="text-xs text-gray-400">{co.status}</span>
              </Link>
            )}
          />
          <ResultSection
            title="Opportunities"
            icon={<Briefcase className="w-4 h-4" />}
            items={data?.opportunities ?? []}
            renderItem={(op) => (
              <Link key={op.id} href={`/admin/opportunities/${op.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">{op.title}</p>
                  <p className="text-xs text-gray-400">{op.company?.name ?? "—"} · {op.location ?? "—"}</p>
                </div>
                <span className="text-xs text-gray-400">{op.status}</span>
              </Link>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminSearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading...</div>}>
      <AdminSearchContent />
    </Suspense>
  );
}
