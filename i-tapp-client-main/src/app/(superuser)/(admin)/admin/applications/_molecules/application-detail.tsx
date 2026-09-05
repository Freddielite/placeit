"use client";

import { Button } from "@/components/ui/button";

export default function ApplicationDetail({ data }: any) {
  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            {data.student?.firstName ?? "—"} {data.student?.lastName ?? ""}
          </h1>
          <p className="text-sm text-gray-500">Application details</p>
        </div>

        {/* <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
          <Button variant="destructive">Decline</Button>
        </div> */}
      </div>

      {/* STUDENT INFORMATION */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Student Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 shadow-sm">
          <p className="text-gray-700">
            Name: {data.student?.firstName ?? "—"} {data.student?.lastName ?? ""}
          </p>
          <p className="text-gray-700">Program: {data.student?.courseOfStudy ?? "—"}</p>
        </div>
      </div>

      {/* OPPORTUNITY */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Opportunity</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 shadow-sm">
          <p className="text-gray-700">{data.opportunity?.title ?? "—"}</p>
          {/* <p className="text-gray-700">Company: {data.company.name}</p> */}
        </div>
      </div>

      {/* STATUS */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Status</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-gray-700">{data.status}</p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Documents</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 shadow-sm">
          <p>
            CV:{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Download
            </span>
          </p>
          <p>
            School Letter:{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Download
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
