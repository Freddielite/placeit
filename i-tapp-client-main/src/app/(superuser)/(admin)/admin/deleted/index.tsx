"use client";

import DeletedData from "../applications/_molecules/deleted-data";

export default function DeletedRecordsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Deleted Records</h1>
      <DeletedData />
    </div>
  );
}
