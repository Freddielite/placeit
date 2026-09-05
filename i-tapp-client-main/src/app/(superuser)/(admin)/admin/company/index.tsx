"use client";
import CompanyTable from "./_molecules/company-table";

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Companies</h1>

      {/* Search / Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search companies..."
          className="border p-2 rounded flex-1"
        />
        <select className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <CompanyTable />
    </div>
  );
}
