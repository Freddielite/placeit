"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Call, Location, Note1, Sms } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import moment from "moment";
import { Download, GraduationCap } from "lucide-react";
import {
  useFetchApplicationDetails,
  useFetchCorpsDetails,
  useFetchOpportunityDetails,
  useFetchStudentDetails,
} from "@/hooks/query";
import { useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import OfferModal from "./send-offer";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/tailwind";
import {
  acceptApplication,
  createOffer,
  declineApplication,
  deleteOffer,
} from "@/actions";
import { ApplicationStatus } from "@/types/enums";
import { OfferFormData } from "@/schemas";

export default function CandidateProfile() {
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const { studentId } = useParams();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunityId");
  const isCorps = searchParams.get("role") === "corps";
  const queryClient = useQueryClient();

  const { data: studentData, isLoading: studentLoading } = useFetchStudentDetails(
    !isCorps ? (studentId as string) : undefined,
  );
  const { data: corpsData, isLoading: corpsLoading } = useFetchCorpsDetails(
    isCorps ? (studentId as string) : undefined,
  );
  const studentDetails = isCorps ? corpsData : studentData;
  const isLoading = isCorps ? corpsLoading : studentLoading;

  const { data: applicationDetails, isLoading: applicationLoading } =
    useFetchApplicationDetails(opportunityId as string);

  const { data: opportunityDetails } = useFetchOpportunityDetails(
    opportunityId ?? undefined,
  );

  const studentLocation = (isCorps ? studentDetails?.location : studentDetails?.preferredLocation)?.trim().toLowerCase();
  const opportunityLocation = opportunityDetails?.location?.trim().toLowerCase();
  const isLocationMismatch =
    !!studentLocation &&
    !!opportunityLocation &&
    !opportunityLocation.includes(studentLocation) &&
    !studentLocation.includes(opportunityLocation);

  const offerId = applicationDetails?.offer?.id;

  const name = studentDetails?.firstName + " " + studentDetails?.lastName;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["application-details", opportunityId] });
  };

  const { execute: createAction, isExecuting: isCreating } = useAction(
    createOffer,
    {
      onSuccess: () => {
        toast.success("Offer sent successfully!");
        invalidate();
        setOfferFormOpen(false);
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "An error occurred.");
      },
    },
  );

  const { execute: acceptAction, isExecuting: isAccepting } = useAction(
    acceptApplication,
    {
      onSuccess: () => {
        toast.success("Application accepted successfully!");
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "An error occurred.");
      },
    },
  );

  const { execute: declineAction, isExecuting: isDeclining } = useAction(
    declineApplication,
    {
      onSuccess: () => {
        toast.success("Application declined successfully!");
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "An error occurred.");
      },
    },
  );

  const { execute: withdrawOffer, isExecuting: isWithdrawing } = useAction(
    deleteOffer,
    {
      onSuccess: () => {
        toast.success("Offer withdrawn successfully!");
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "An error occurred.");
      },
    },
  );

  const handleCreate = (things: OfferFormData) => {
    if (opportunityId) {
      createAction({ ...things, id: opportunityId });
    }
  };

  if (isLoading) {
    return <Spinner placeholder="Loading candidate details..." />;
  }

  const corps = isCorps ? studentDetails : null;
  const student = isCorps ? null : studentDetails;

  const profileImage = corps?.profileImage ?? student?.profileImageUrl ?? "/applicant.png";
  const email = corps?.user?.email ?? student?.user?.email ?? "Not provided";
  const phone = corps?.phone ?? student?.phone ?? "Not provided";

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border rounded-xl px-6 py-5 mb-4 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
          <div className="rounded-full border-2 border-gray-100 h-20 w-20 shrink-0 overflow-hidden bg-gray-50">
            <Image src={profileImage} alt={name} width={100} height={100} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-xl text-foreground">{name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{studentDetails?.courseOfStudy} · {studentDetails?.school}</p>
            {isCorps && corps?.nyscRegNumber && (
              <span className="mt-1.5 inline-block text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{corps.nyscRegNumber}</span>
            )}
          </div>
        </div>

        {/* Location mismatch warning */}
        {isLocationMismatch && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
            <span className="mt-0.5 text-amber-500 shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-bold text-amber-800">Location mismatch</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Candidate&apos;s preferred location is{" "}
                <span className="font-semibold capitalize">{corps?.location ?? student?.preferredLocation}</span>,
                but this opportunity is in{" "}
                <span className="font-semibold capitalize">{opportunityDetails?.location}</span>.
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left — profile details */}
          <div className="flex flex-col gap-4 w-full lg:w-[420px] shrink-0">
            <SectionWrapper className="flex flex-col gap-4">
              <HeaderLabel title="About" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {studentDetails?.bio || "No bio available."}
              </p>
            </SectionWrapper>

            <SectionWrapper className="flex flex-col gap-3">
              <HeaderLabel title="Education" />
              <InfoCard icon={GraduationCap} label="School" value={studentDetails?.school || "Not provided"} />
              <InfoCard icon={Note1} label="Course of Study" value={studentDetails?.courseOfStudy || "Not provided"} />
              {isCorps && (
                <>
                  <InfoCard icon={Note1} label="Degree" value={corps?.degreeType || "Not provided"} />
                  <InfoCard icon={Note1} label="Graduation Year" value={corps?.graduationYear?.toString() || "Not provided"} />
                  {corps?.gpa && <InfoCard icon={Note1} label="GPA" value={corps.gpa} />}
                </>
              )}
            </SectionWrapper>

            {isCorps && (
              <SectionWrapper className="flex flex-col gap-3">
                <HeaderLabel title="NYSC Info" />
                <InfoCard icon={Note1} label="Reg Number" value={corps?.nyscRegNumber || "Not provided"} />
                <InfoCard icon={Note1} label="State Code" value={corps?.stateCode || "Not provided"} />
                <InfoCard icon={Note1} label="Batch Year" value={corps?.batchYear?.toString() || "Not provided"} />
                <InfoCard icon={Note1} label="Stream" value={corps?.stream?.replace(/stream_?/i, "Stream ").toUpperCase() || "Not provided"} />
                <InfoCard icon={Location} label="State of Deployment" value={corps?.stateOfDeployment || "Not provided"} />
              </SectionWrapper>
            )}

            <SectionWrapper className="flex flex-col gap-3">
              <HeaderLabel title="Contact" />
              <InfoCard icon={Sms} label="Email" value={email} />
              <InfoCard icon={Call} label="Phone" value={phone} />
              <InfoCard icon={Location} label="Location" value={corps?.location ?? student?.address ?? "Not provided"} />
            </SectionWrapper>

            {!isCorps && (
              <SectionWrapper className="flex flex-col gap-3">
                <HeaderLabel title="Placement Preference" />
                <InfoCard icon={Location} label="Preferred IT Location" value={student?.preferredLocation || "Not provided"} />
              </SectionWrapper>
            )}

            {isCorps && corps?.preferredIndustry?.length > 0 && (
              <SectionWrapper className="flex flex-col gap-3">
                <HeaderLabel title="Preferences" />
                <InfoCard icon={Note1} label="Preferred Industry" value={corps.preferredIndustry.join(", ")} />
                {corps?.internshipDuration && <InfoCard icon={Note1} label="Available Duration" value={corps.internshipDuration} />}
                {corps?.availableStartDate && <InfoCard icon={Note1} label="Available From" value={corps.availableStartDate} />}
              </SectionWrapper>
            )}
          </div>

          {/* Right — actions */}
          <div className="flex flex-col gap-4 w-full">
            <SectionWrapper className="flex flex-col gap-3">
              <HeaderLabel title="Application" />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xs font-semibold capitalize">
                  {applicationDetails?.status?.replace(/_/g, " ") ?? "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Applied</p>
                <p className="text-xs font-semibold">
                  {applicationDetails?.appliedAt ? moment(applicationDetails.appliedAt).format("ll") : "N/A"}
                </p>
              </div>
            </SectionWrapper>

            <SectionWrapper className="flex flex-col gap-4">
              <HeaderLabel title="Documents" />
              {(() => {
                const docs = isCorps
                  ? [
                      { label: "Call-Up Letter", url: corps?.callUpLetter },
                      { label: "CV", url: corps?.cv },
                      { label: "Relocation Letter", url: corps?.relocationLetter },
                    ]
                  : [
                      { label: "IT Letter", url: student?.itLetter },
                      { label: "CV", url: student?.cv },
                    ];
                const available = docs.filter((d) => !!d.url);
                if (available.length === 0) return <p className="text-xs text-muted-foreground">No documents uploaded</p>;
                return (
                  <div className="flex flex-wrap gap-2">
                    {available.map((doc) => (
                      <a
                        key={doc.label}
                        href={doc.url!}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors"
                      >
                        <Download size={13} />
                        {doc.label}
                      </a>
                    ))}
                  </div>
                );
              })()}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {renderApplicationActions({
                  application: applicationDetails,
                  offer: applicationDetails?.offer,
                  setOfferFormOpen,
                  declineAction,
                  withdrawOffer,
                  isDeclining,
                  isWithdrawing,
                  isCorps,
                })}
              </div>
            </SectionWrapper>
          </div>
        </div>

        <OfferModal
          offerFormOpen={offerFormOpen}
          onClose={() => setOfferFormOpen(false)}
          onCreate={(things: OfferFormData) => handleCreate(things)}
        />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 ">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="text-gray-600 size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className=" text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function HeaderLabel({ title }: { title: string }) {
  return <h1 className="font-semibold text-sm">{title}</h1>;
}

function SectionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(`bg-white p-4 border rounded-lg`, className)}>
      {children}
    </div>
  );
}

type ApplicationActionProps = {
  application: any;
  offer: any;
  setOfferFormOpen: (open: boolean) => void;
  declineAction: (data: { id: string }) => void;
  withdrawOffer: (data: { id: string }) => void;
  isDeclining: boolean;
  isWithdrawing: boolean;
  isCorps: boolean;
};

function renderApplicationActions({
  application,
  offer,
  setOfferFormOpen,
  declineAction,
  withdrawOffer,
  isDeclining,
  isWithdrawing,
  isCorps,
}: ApplicationActionProps) {
  const status = application?.status;
  const offerStatus = offer?.status;

  if (
    status === ApplicationStatus.IN_REVIEW ||
    status === ApplicationStatus.SHORTLISTED
  ) {
    return (
      <>
        <Button
          onClick={() => setOfferFormOpen(true)}
          className="flex-1 w-full sm:w-auto bg-green-600 text-white"
        >
          Send Offer
        </Button>
        <Button
          disabled={isDeclining}
          onClick={() => declineAction({ id: application.opportunityId })}
          className="flex-1 w-full sm:w-auto bg-red-600 text-white"
        >
          Decline
        </Button>
      </>
    );
  }

  if (status === ApplicationStatus.OFFERED) {
    if (offerStatus === "sent") {
      return (
        <>
          <p className="flex-1 bg-yellow-100 text-yellow-700 text-center py-2 rounded">
            Waiting for {isCorps ? "corps member" : "student"} response
          </p>

          <Button
            disabled={isWithdrawing}
            onClick={() => withdrawOffer({ id: offer.id })}
          >
            Withdraw Offer
          </Button>
        </>
      );
    }

    if (offerStatus === "accepted") {
      return <StatusBadge color="green">Hired</StatusBadge>;
    }

    if (offerStatus === "declined") {
      return <StatusBadge color="red">Student Declined Offer</StatusBadge>;
    }
  }

  if (status === "rejected") {
    return <StatusBadge color="red">Rejected</StatusBadge>;
  }

  if (status === "hired") {
    return <StatusBadge color="green">Hired</StatusBadge>;
  }

  return null;
}

function StatusBadge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "red";
}) {
  return (
    <div
      className={`px-4 py-2 rounded ${
        color === "green"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}
