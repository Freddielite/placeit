"use client";

import { useState } from "react";
import ApplicationList from "./_molecules/application-list";
import ApplicationDetail from "./_molecules/application-detail";
import { useFetchAllApplications } from "@/queries/admin";
import CompanyList from "./_molecules/company-list";

export default function ApplicationsPage() {
  const [selected, setSelected] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  return (
    <div className="w-full h-full flex">
      {/* LEFT PANEL */}
      <div className="w-[350px] border-r h-full overflow-hidden relative">
        <div
          className={`flex h-full w-[700px] transition-transform duration-300 ease-out
      ${selectedCompany ? "-translate-x-[350px]" : "translate-x-0"}`}
        >
          {/* Company list */}
          <div className="w-[350px] h-full overflow-y-auto shrink-0">
            <CompanyList
              onSelect={setSelectedCompany}
              selectedId={selectedCompany?.id}
              selectedCompany={selectedCompany}
            />
          </div>

          {/* Application / Student list */}
          <div className="w-[350px] h-full overflow-y-auto shrink-0">
            <ApplicationList
              onSelect={setSelected}
              onBack={() => setSelectedCompany(null)}
              selectedId={selected?.id}
              selectedCompany={selectedCompany}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 h-full overflow-y-auto">
        {selected ? (
          <ApplicationDetail data={selected} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  );
}
