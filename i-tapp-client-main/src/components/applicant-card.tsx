"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArchiveAdd,
  ArrowRight,
  CloseCircle,
  SmsEdit,
  TickCircle,
} from "iconsax-reactjs";

import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { Applicant } from "@/types";
import {
  acceptApplication,
  bookmarkApplication,
  declineApplication,
} from "@/actions";

export function ApplicantCard({ applicant }: { applicant: Applicant }) {
  const { id, accepted } = applicant;
  const student = applicant.student;
  const studentId = student.id;

  const {
    execute: acceptAction,
    isExecuting: isAccepting,
    hasErrored: hasAcceptError,
  } = useAction(acceptApplication, {
    onSuccess: (data) => {
      toast.success("Application accepted successfully!");
    },
    onError: (error) => {
      const { serverError } = error?.error;
      const errorMessage = serverError || "An error occurred.";
      toast.error(errorMessage);
    },
  });

  const {
    execute: declineAction,
    isExecuting: isDeclining,
    hasErrored: hasDeclineError,
  } = useAction(declineApplication, {
    onSuccess: () => {
      toast.success("Application declined successfully!");
    },
    onError: (error) => {
      const { serverError } = error?.error;
      const errorMessage = serverError || "An error occurred.";
      toast.error(errorMessage);
    },
  });

  const {
    execute: bookmarkAction,
    isExecuting: isBookmarking,
    hasErrored: hasBookmarkError,
  } = useAction(bookmarkApplication, {
    onSuccess: () => {
      toast.success("Application bookmarked successfully!");
    },
    onError: (error) => {
      const { serverError } = error?.error;
      const errorMessage = serverError || "An error occurred.";
      toast.error(errorMessage);
    },
  });

  const handleViewProfile = () => {
  };

  return (
    <div className="py-4">
      <div className="flex justify-between gap-2 mb-3">
        <div className="flex gap-6">
          <Image
            src={student?.profileImageUrl || "/applicant.png"}
            alt="applicant"
            width={48}
            height={48}
            className="h-10 w-10 border rounded-full object-cover"
          />

          <div className="flex-wrap px-2">
            <p className="font-semibold text-md">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm pt-1.5 pr-2.5 text-gray-500">
              {student.school || "Not specified"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 self-center items-center">
          <button
            onClick={() => bookmarkAction({ id: studentId })}
            disabled={isBookmarking}
            className="disabled:opacity-50"
          >
            <ArchiveAdd size={24} />
          </button>
          {applicant.accepted ? (
            <>
              {" "}
              <a
                href={`mailto:${student.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SmsEdit size={24} />
              </a>
              <Link
                href={`/portal/candidates/${id}`}
                onClick={handleViewProfile}
              >
                <div className="flex flex-row justify-center gap-2 py-3 px-4 rounded-lg bg-secondary">
                  View profile <ArrowRight size={24} />
                </div>
              </Link>{" "}
            </>
          ) : (
            <>
              <button
                onClick={() => acceptAction({ id: studentId })}
                disabled={isAccepting}
                className="disabled:opacity-50"
              >
                <TickCircle
                  size={24}
                  color="#27AE60"
                  className="cursor-pointer"
                />
              </button>
              <button
                onClick={() => declineAction({ id: studentId })}
                disabled={isDeclining}
                className="disabled:opacity-50"
              >
                <CloseCircle
                  size={24}
                  color="#EB5757"
                  className="cursor-pointer"
                />
              </button>
              <Link
                href={`/portal/candidates/${id}`}
                onClick={handleViewProfile}
              >
                <div className="flex flex-row justify-center gap-2 py-3 px-4 rounded-lg bg-secondary">
                  View profile <ArrowRight size={24} />
                </div>
              </Link>{" "}
            </>
          )}
        </div>
      </div>
      {/* {accepted && (
        <div className="flex flex-col gap-1">
          <span>
            Start Date: <strong>Monday, 12th Feb, 2024</strong>
          </span>
          <span>
            End Date: <strong>Monday, 12th May, 2024</strong>
          </span>
        </div>
      )} */}
    </div>
  );
}
