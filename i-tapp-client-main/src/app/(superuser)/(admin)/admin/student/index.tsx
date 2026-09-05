"use client";

import SummaryCard from "../_molecules/summary-card";
import StudentTable from "../_molecules/student-table";
import { useFetchAllStudents, useFetchStudentStats } from "@/queries/admin";

export default function AdminStudentPage() {
  const { data, isLoading } = useFetchAllStudents();
  const { data: stats } = useFetchStudentStats();

  const summaryItems = [
    { title: "Total Students", number: stats?.total ?? 0, component: "" },
    { title: "Active Students", number: stats?.active ?? 0, component: "" },
    { title: "Pending Approval", number: stats?.pending ?? 0, component: "" },
    { title: "Removed", number: stats?.removed ?? 0, component: "" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Students</h1>

      <div className="flex flex-wrap gap-6">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            number={item.number}
            component={item.component}
          />
        ))}
      </div>

      <StudentTable data={data} isLoading={isLoading} />
    </div>
  );
}
