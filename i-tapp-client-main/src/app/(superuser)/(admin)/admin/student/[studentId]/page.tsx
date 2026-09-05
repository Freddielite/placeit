"use client";

import { updateStudentStatus } from "@/actions";
import { Button } from "@/components/ui/button";
import { useFetchStudentDetails } from "@/hooks/query";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDelete } from "../../../danger";
import Image from "next/image";
import { toast } from "react-toastify";

export default function StudentDetailsPage() {
  const { studentId } = useParams();
  const { executeDelete, isDeleting, executePurge, isPurging } = useDelete();

  const { data, isLoading } = useFetchStudentDetails(studentId as string);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const userId = data?.user?.id;
  const student = data;

  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(updateStudentStatus, {
    onSuccess: () => {
      toast.success("Student status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["student-details", studentId],
      });
    },
    onError: (err) => {
      if (err.error.serverError) {
        toast.error(err.error.serverError, { data });
      }
    },
  });

  const tabs = [
    "Personal Information",
    // "Applications",
    // "Activities",
    // "Messages",
  ];

  if (isLoading) {
    return <div className="p-4">Loading student details...</div>;
  }

  const name = data?.firstName + " " + data?.lastName;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row items-center gap-3">
            {" "}
            <h1 className="text-2xl font-bold">{name}</h1> -{" "}
            <p>{data?.status}</p>
          </div>
          <p className="text-gray-500 text-sm">
            Student profile (ID: {studentId})
          </p>
        </div>

        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Assign Placement
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-6">
        {/* Sidebar / Info */}
        <div className="min-w-[230px] flex flex-col items-center py-6 gap-4">
          <div className="rounded-full border w-[150px] h-[150px] bg-gray-100 flex items-center justify-center">
            {/* Avatar Placeholder */}

            {student.avatar ? (
              <Image
                src={data?.profileImage || "/applicant.png"}
                alt={name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Avatar</span>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">
              Matric No: {data?.matriculationNumber}
            </p>
            <p
              className={`text-xs font-medium ${
                data?.user?.isVerified ? "text-green-600" : "text-gray-600"
              }`}
            >
              {data?.user?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {/* <Button>Verify Student</Button> */}

            <Button
              variant="default"
              onClick={() =>
                execute({
                  studentId: studentId as string,
                  status: "approved",
                })
              }
            >
              Approve Account
            </Button>

            {/* {data?.status === "suspended" && (
              <Button
                variant="default"
                onClick={() =>
                  execute({
                    studentId: studentId as string,
                    status: "active",
                  })
                }
              >
                Reactivate Account
              </Button>
            )} */}

            <Button
              variant="link"
              disabled={isDeleting}
              className="text-red-600 font-semibold"
              onClick={() =>
                executeDelete({
                  id: userId as string,
                })
              }
              aria-description="deactivate company and remove access to dashboard"
            >
              {isDeleting ? "Deactivating..." : "Deactivate (soft delete)"}
            </Button>

            {/* <Button variant="outline">More Options</Button> */}
          </div>
        </div>

        {/* Tabs / Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 font-medium ${
                  activeTab === tab
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-600 hover:border-amber-600 hover:text-amber-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 space-y-3">
            {activeTab === "Personal Information" && student && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium">
                    {student.firstName} {student.lastName}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Matric Number</span>
                  <span className="font-medium">
                    {student.matriculationNumber}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">School</span>
                  <span className="font-medium">{student.school}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-medium">{student.courseOfStudy}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">{student.level}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">phone</span>
                  <span className="font-medium">
                    {student.phone ?? student?.user?.phone ?? "N/A"}
                  </span>
                </div>

                {student.gender && (
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{student.gender}</span>
                  </div>
                )}

                {student.dob && (
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Date of Birth</span>
                    <span className="font-medium">{student.dob}</span>
                  </div>
                )}

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">
                    Preferred IT Location
                  </span>
                  <span className="font-medium">
                    {student?.preferredLocation || "N/A"}
                  </span>
                </div>
              </div>
            )}
            {/* {activeTab === "Applications" && <p>Applications content...</p>}
            {activeTab === "Activities" && <p>Activities content...</p>}
            {activeTab === "Messages" && <p>Messages content...</p>} */}
          </div>
        </div>
      </div>
    </div>
  );
}
