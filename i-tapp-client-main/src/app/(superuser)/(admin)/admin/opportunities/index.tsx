"use client";

import { useFetchOpportunities } from "@/hooks/query";
import OpportunityTable from "./_molecules/opportunity-table";
import { useState } from "react";

export default function OpportunitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useFetchOpportunities({}, currentPage, 10);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading opportunities.</div>;
  }

  // console.log("Opportunities data:", data);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Opportunities</h1>
      <OpportunityTable
        data={data?.items}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
