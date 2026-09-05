"use client";

import { useState } from "react";
import { useFetchAllUsers } from "@/queries/admin";
import UsersTable from "./_molecules/users-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT = 30;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFetchAllUsers(page, LIMIT);

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500">
          All registered users across roles.{" "}
          {total > 0 && <span className="text-gray-400">({total} total)</span>}
        </p>
      </div>

      <UsersTable data={data?.data ?? []} isLoading={isLoading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
