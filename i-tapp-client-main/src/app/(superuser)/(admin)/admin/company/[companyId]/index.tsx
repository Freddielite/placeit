"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";

import { reviewCompanyDocuments, updateCompanyStatus } from "@/actions";
import { useFetchCompanyDetails } from "@/hooks/query";
import { useFetchCompanyDocuments } from "@/queries";
import { CompanyStatus, DocumentReviewStatus } from "@/types/enums";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDelete } from "../../../danger";

export default function CompanyDetailPage() {
  const queryClient = useQueryClient();
  const { companyId } = useParams();

  const tabs = ["Overview", "Documents", "Reviews"];
  const [activeTab, setActiveTab] = useState("Overview");
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { executeDelete, isDeleting, executePurge, isPurging } = useDelete();

  const {
    data: companyDetails,
    isLoading,
    error,
  } = useFetchCompanyDetails(companyId as string);

  const { data: companyDocuments = [], isLoading: isDocumentsLoading } =
    useFetchCompanyDocuments(companyId as string);

  const { execute, isExecuting } = useAction(updateCompanyStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-details", companyId],
      });
      toast.success("Company status updated successfully");
    },
    onError: (err) => {
      toast.error("Error updating company status");
    },
  });

  const {
    execute: reviewCompanyDocumentsExecute,
    isExecuting: isReviewExecuting,
  } = useAction(reviewCompanyDocuments, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-details", companyId],
      });
      toast.success("Document review submitted successfully");
    },
    onError: (err) => {
      toast.error("Error submitting document review");
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading company details...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">Error loading company details.</div>
    );
  }

  const isSuspended = companyDetails?.status === CompanyStatus.SUSPENDED;
  const isApproved = companyDetails?.status === CompanyStatus.APPROVED;
  const isPending = companyDetails?.status === CompanyStatus.PENDING;

  const userId = companyDetails?.user?.id;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="border rounded-lg w-14 h-14 bg-gray-100"></div>
          <div>
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl font-bold">{companyDetails?.name}</h1>
              <p className="text-gray-500 text-sm">{companyDetails?.status}</p>
            </div>
            <p className="text-gray-500 text-sm">Company ID: {companyId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="outline">Edit Company</Button> */}
          {/* <Link
            href={`mailto:${companyDetails?.user?.email}`}
            className={buttonVariants({ variant: "default" })}
          >
            Message Company
          </Link> */}

          <div className="flex items-center gap-2">
            {/* Suspend */}
            {isApproved && (
              <Button
                variant="destructive"
                className="bg-orange-500"
                disabled={isExecuting}
                onClick={() =>
                  execute({
                    companyId: companyId as string,
                    status: CompanyStatus.SUSPENDED,
                  })
                }
              >
                Suspend Company
              </Button>
            )}

            {/* Reinstate */}
            {isSuspended && (
              <Button
                variant="default"
                disabled={isExecuting}
                onClick={() =>
                  execute({
                    companyId: companyId as string,
                    status: CompanyStatus.APPROVED,
                  })
                }
              >
                Reinstate Company
              </Button>
            )}

            <Button
              variant="link"
              disabled={isDeleting}
              onClick={() =>
                executeDelete({
                  id: userId as string,
                })
              }
              aria-description="deactivate company and remove access to dashboard"
            >
              {isDeleting ? "Deactivating..." : "Deactivate (soft delete)"}
            </Button>

            {/* <Button
              variant="link"
              disabled={isExecuting}
              onClick={() =>
                execute({
                  companyId: companyId as string,
                  status: CompanyStatus.APPROVED,
                })
              }
              aria-description="deactivate company and remove access to dashboard"
            >
              Deactivate (soft delete)
            </Button> */}
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="flex flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <div className="flex flex-col gap-6 w-1/3">
          {/* COMPANY DETAILS */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-3">Company Details</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {companyDetails?.address}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {companyDetails?.user?.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                <ol className="list-inside list-disc ml-1">
                  <li className="text-xs">
                    Personal: {companyDetails?.user?.phone ?? "N/A"}
                  </li>
                  <li className="text-xs">
                    Work: {companyDetails?.phone ?? "N/A"}
                  </li>
                </ol>
              </p>
              <p>
                <span className="font-medium">Industry:</span>{" "}
                {companyDetails?.industry}
              </p>
              <p>
                <span className="font-medium">Registration Date:</span>{" "}
                {companyDetails?.foundedYear ?? "N/A"}
              </p>
            </div>
          </div>

          {/* ADMIN ROLES */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-3">Admin Roles</h2>

            <p className="text-gray-600 text-sm">
              List of company admins will appear here.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 border rounded-lg bg-white shadow flex flex-col">
          {/* TABS */}
          <div className="border-b flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 p-4 text-sm font-medium ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-4">
            {activeTab === "Overview" && (
              <p className="text-gray-700">
                {companyDetails?.description ?? "No description available."}
              </p>
            )}

            {activeTab === "Documents" && (
              <div className="space-y-3">
                {isDocumentsLoading ? (
                  <p className="text-sm text-gray-500">Loading documents…</p>
                ) : companyDocuments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No documents uploaded yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {companyDocuments.map((doc: any) => (
                      <DocumentItem
                        key={doc.id}
                        item={doc}
                        companyId={companyId as string}
                        rejectingDocId={rejectingDocId}
                        setRejectingDocId={setRejectingDocId}
                        rejectionReason={rejectionReason}
                        setRejectionReason={setRejectionReason}
                        reviewCompanyDocumentsExecute={
                          reviewCompanyDocumentsExecute
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "Placements" && (
              <p className="text-gray-700">
                List of placements/opportunities will go here.
              </p>
            )}

            {activeTab === "Reviews" && <p> Reviews will go here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

type ReviewStatusInput = Exclude<
  DocumentReviewStatus,
  DocumentReviewStatus.PENDING
>;

const DocumentItem = ({
  item,
  companyId,
  rejectingDocId,
  setRejectingDocId,
  rejectionReason,
  setRejectionReason,
  reviewCompanyDocumentsExecute,
}: {
  item: {
    id: string;
    type: string;
    url: string;
    reviewStatus: DocumentReviewStatus;
  };
  companyId: string;
  rejectingDocId: string | null;
  setRejectingDocId: (id: string | null) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  reviewCompanyDocumentsExecute: ({
    companyId,
    documentType,
    reviewStatus,
    rejectionReason,
  }: {
    companyId: string;
    documentType: string;
    reviewStatus: ReviewStatusInput;
    rejectionReason?: string;
  }) => void;
}) => {
  const isRejectingThisDoc = rejectingDocId === item.id;

  return (
    <div className="flex flex-col gap-2 border rounded-md p-3">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm font-semibold">{item.type}</p>
          <span className="text-xs">{item.reviewStatus}</span>
        </div>

        <div className="flex flex-row gap-2">
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href={item.url}
            target="_blank"
          >
            View
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs bg-green-500 text-white"
            disabled={item.reviewStatus === DocumentReviewStatus.APPROVED}
            onClick={() => {
              if (isRejectingThisDoc) {
                setRejectingDocId(null);
                setRejectionReason("");
              }

              reviewCompanyDocumentsExecute({
                companyId,
                documentType: item.type,
                reviewStatus: DocumentReviewStatus.APPROVED,
              });
            }}
          >
            Approve
          </Button>

          {!isRejectingThisDoc ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={item.reviewStatus === DocumentReviewStatus.REJECTED}
              className="bg-red-500 text-white text-xs"
              onClick={() => {
                setRejectingDocId(item.id);
                setRejectionReason("");
              }}
            >
              Reject
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="bg-gray-200 text-xs"
              onClick={() => {
                setRejectingDocId(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isRejectingThisDoc && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold">Rejection reason</label>
          <textarea
            className="border rounded px-2 py-1 text-sm"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain what’s wrong (blurred, mismatch name, missing page...)"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              reviewCompanyDocumentsExecute({
                companyId,
                documentType: item.type,
                reviewStatus: DocumentReviewStatus.REJECTED,
                rejectionReason: rejectionReason || "No reason provided",
              });

              setRejectingDocId(null);
              setRejectionReason("");
            }}
          >
            Confirm Reject
          </Button>
        </div>
      )}
    </div>
  );
};
