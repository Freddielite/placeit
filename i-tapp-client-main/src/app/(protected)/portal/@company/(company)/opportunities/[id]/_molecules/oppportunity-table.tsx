import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { User, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { ArchiveAdd, ArrowRight2, SmsEdit } from "iconsax-reactjs";
import { Application } from "@/types";
import { useState } from "react";
import { cn } from "@/utils/tailwind";
import { StatusBadge } from "@/components/application-status";
import { ApplicationStatus } from "@/types/enums";
import { useAction } from "next-safe-action/hooks";
import { shortlistApplicant } from "@/actions";
import { toast } from "react-toastify";

export default function OpportunityTable({
  data,
  opportunityId,
}: {
  data: Application[];
  opportunityId: string;
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const { execute } = useAction(shortlistApplicant, {
    onSuccess(data) {
      toast.success("Applicant shortlisted successfully");
    },
    onError(error) {
    },
  });

  // Calculate stats from real data
  const stats = {
    total: data?.length || 0,
    shortlisted:
      data?.filter((app) => app.status === "shortlisted")?.length || 0,
    interviewing:
      data?.filter((app) => app.status === "interviewing")?.length || 0,
    approved:
      data?.filter(
        (app) => app.status === "approved" || app.status === "accepted",
      )?.length || 0,
  };

  const overview = [
    {
      title: "Total Applicants",
      number: stats.total,
      icon: <User size={20} />,
    },
    {
      title: "Shortlisted",
      number: stats.shortlisted,
      icon: <User size={20} />,
    },
    {
      title: "Interviewing",
      number: stats.interviewing,
      icon: <User size={20} />,
    },
    {
      title: "Offers Extended",
      number: stats.approved,
      icon: <User size={20} />,
    },
  ];

  // Filter data based on active filter
  const filteredData = data?.filter((app) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "shortlisted") return app.status === "shortlisted";
    if (activeFilter === "interviewing") return app.status === "interviewing";
    return true;
  });

  const filterTabs = [
    { label: "All Applicants", value: "all", count: stats.total },
    { label: "Shortlisted", value: "shortlisted", count: stats.shortlisted },
    { label: "Interviewing", value: "interviewing", count: stats.interviewing },
  ];

  const handleShortlist = () => {
    execute({ id: opportunityId });
  };

  return (
    <div className="space-y-6 rounded-md">
      {/* Overview Cards */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overview.map((item, index) => (
          <Overview
            key={index}
            title={item.title}
            number={item.number}
            icon={item.icon}
            link="#"
          />
        ))}
      </div> */}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-md transition-all
              ${
                activeFilter === tab.value
                  ? "bg-primary text-white border-b-2 border-primary"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Applicant</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Applied Date</TableHead>
              <TableHead className="text-center font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData?.length > 0 ? (
              filteredData.map((applicant) => {
                const person = applicant?.student ?? applicant?.corpsMember;

                return (
                  <TableRow key={applicant.id} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <ApplicantProfile person={person} />
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge
                        status={applicant.status as ApplicationStatus}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {new Date(applicant.appliedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Shortlist"
                          onClick={() => execute({ id: applicant.id })}
                        >
                          <ArchiveAdd size={18} />
                        </Button>

                        <Link href={`mailto:${person?.email}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Send Email"
                          >
                            <SmsEdit size={18} />
                          </Button>
                        </Link>

                        <Link
                          href={`/portal/candidates/${person?.id}?opportunityId=${applicant?.id}${applicant?.corpsMember ? "&role=corps" : ""}`}
                          className={cn(
                            buttonVariants({
                              variant: "secondary",
                              size: "sm",
                            }),
                          )}
                        >
                          View Profile
                          <ArrowRight2 size={16} className="ml-1" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="text-center py-12">
                    <User size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No applicants found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {activeFilter !== "all"
                        ? "Try changing the filter or check back later"
                        : "Applications will appear here once candidates apply"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredData?.length > 0 ? (
          filteredData.map((applicant) => {
            const person = applicant?.student ?? applicant?.corpsMember;

            return (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                student={person}
              />
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <User size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No applicants found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeFilter !== "all"
                ? "Try changing the filter"
                : "Applications will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile Card Component
function ApplicantCard({
  applicant,
  student,
}: {
  applicant: Application;
  student: any;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-3">
        <ApplicantProfile person={student} />
        <StatusBadge status={applicant.status as ApplicationStatus} />
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-3 border-b">
        <Calendar size={14} />
        <span>
          Applied on{" "}
          {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          title="Shortlist"
        >
          <ArchiveAdd size={16} className="mr-1" />
          Shortlist
        </Button>
        <Link href={`mailto:${student?.email}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            title="Send Email"
          >
            <Mail size={16} className="mr-1" />
            Email
          </Button>
        </Link>
        <Link
          href={`/portal/candidates/${student?.id}${applicant?.corpsMember ? "?role=corps" : ""}`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "flex-1 justify-center",
          )}
        >
          View
          <ArrowRight2 size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}

// Applicant Profile Component
export function ApplicantProfile({ person }: { person: any }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={person?.profileImage || "/applicant.png"}
        alt={`${person?.firstName || "Unknown"} ${person?.lastName || "User"}`}
        width={40}
        height={40}
        className="h-10 w-10 border-2 border-gray-200 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900">
          {person?.firstName && person?.lastName
            ? `${person.firstName} ${person.lastName}`
            : "Unknown Applicant"}
        </p>
        <p className="text-xs text-gray-500">
          {person?.school ?? person?.nyscRegNumber ?? "N/A"}
        </p>
      </div>
    </div>
  );
}

// Status Badge Component
