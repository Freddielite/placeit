"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { approveCorps, rejectCorps, softDelete } from "@/actions";
import { useFetchCorpsDetails } from "@/hooks/query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, ExternalLink } from "lucide-react";
import { studentStatusStyle } from "@/utils/admin-status-style";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

export default function CorpsDetailsPage() {
  const { corpsId } = useParams<{ corpsId: string }>();
  const { data: corps, isLoading } = useFetchCorpsDetails(corpsId);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Personal Information");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["corps-details", corpsId] });

  const { execute: approve, isExecuting: isApproving } = useAction(
    approveCorps,
    {
      onSuccess: () => { toast.success("Corps member approved!"); invalidate(); },
      onError: (e) => toast.error(e?.error?.serverError || "Failed to approve."),
    },
  );

  const { execute: reject, isExecuting: isRejecting } = useAction(rejectCorps, {
    onSuccess: () => { toast.success("Corps member rejected."); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to reject."),
  });

  const { execute: deactivate, isExecuting: isDeactivating } = useAction(
    softDelete,
    {
      onSuccess: () => { toast.success("Account deactivated."); invalidate(); },
      onError: (e) => toast.error(e?.error?.serverError || "Failed to deactivate."),
    },
  );

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading corps member...</div>;
  }

  if (!corps) {
    return <div className="p-6 text-red-500">Corps member not found.</div>;
  }

  const name = `${corps.firstName ?? ""} ${corps.lastName ?? ""}`.trim();
  const tabs = ["Personal Information", "NYSC Details", "Skills", "Documents"];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back */}
      <Link
        href="/admin/corps"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Corps Members
      </Link>

      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{name}</h1>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                studentStatusStyle[corps.status as keyof typeof studentStatusStyle] ??
                "bg-gray-100 text-gray-600"
              }`}
            >
              {corps.status ?? "pending"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Corps member profile (ID: {corpsId})
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-56 flex flex-col items-center gap-4 py-6">
          <div className="w-28 h-28 rounded-full border bg-gray-100 overflow-hidden flex items-center justify-center">
            {corps.profileImageUrl ? (
              <Image
                src={corps.profileImageUrl}
                alt={name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-300">
                {corps.firstName?.[0]}{corps.lastName?.[0]}
              </span>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-gray-500">{corps.user?.email}</p>
            <p className={`text-xs font-medium ${corps.user?.isVerified ? "text-emerald-600" : "text-gray-400"}`}>
              {corps.user?.isVerified ? "Email Verified" : "Email Not Verified"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              disabled={isApproving || isRejecting}
              onClick={() => approve({ corpsId })}
              className="w-full"
            >
              {isApproving ? "Approving…" : "Approve"}
            </Button>
            <Button
              variant="outline"
              disabled={isApproving || isRejecting}
              onClick={() => reject({ corpsId })}
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              {isRejecting ? "Rejecting…" : "Reject"}
            </Button>
            <Button
              variant="link"
              disabled={isDeactivating}
              onClick={() => deactivate({ id: corps.user?.id })}
              className="text-red-500 text-xs"
            >
              {isDeactivating ? "Deactivating…" : "Deactivate (soft delete)"}
            </Button>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1">
          <div className="flex border-b mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3 p-1">
            {activeTab === "Personal Information" && (
              <div className="space-y-2">
                <InfoRow label="Full Name" value={name} />
                <InfoRow label="Email" value={corps.user?.email} />
                <InfoRow label="Phone" value={corps.phone ?? corps.user?.phone} />
                <InfoRow label="Gender" value={corps.gender} />
                <InfoRow label="Bio" value={corps.bio} />
                <InfoRow label="Account Status" value={corps.user?.isActive ? "Active" : "Inactive"} />
                <InfoRow label="Last Login" value={corps.user?.lastLoginAt ? new Date(corps.user.lastLoginAt).toLocaleString() : undefined} />
              </div>
            )}

            {activeTab === "NYSC Details" && (
              <div className="space-y-2">
                <InfoRow label="State of Deployment" value={corps.stateOfDeployment} />
                <InfoRow label="State Code" value={corps.stateCode} />
                <InfoRow label="NYSC Reg. Number" value={corps.nyscRegNumber} />
                <InfoRow label="Batch Year" value={corps.batchYear} />
                <InfoRow label="Stream" value={corps.stream ? `Stream ${corps.stream}` : undefined} />
                <InfoRow label="Institution" value={corps.school} />
                <InfoRow label="Course of Study" value={corps.courseOfStudy} />
                <InfoRow label="Degree Type" value={corps.degreeType} />
                <InfoRow label="Graduation Year" value={corps.graduationYear} />
                <InfoRow label="CGPA" value={corps.gpa} />
              </div>
            )}

            {activeTab === "Skills" && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Technical Skills</p>
                  {corps.techSkills?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {corps.techSkills.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{s}</span>)}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">—</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Soft Skills</p>
                  {corps.softSkills?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {corps.softSkills.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">{s}</span>)}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">—</p>}
                </div>
              </div>
            )}

            {activeTab === "Documents" && (
              <div className="space-y-3">
                <DocumentLink label="Call-Up Letter" url={corps.callUpLetterUrl} />
                <DocumentLink label="CV / Resume" url={corps.cvUrl} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentLink({ label, url }: { label: string; url?: string }) {
  if (!url) {
    return (
      <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FileText className="w-4 h-4" />
          {label}
        </div>
        <span className="text-xs text-gray-400">Not uploaded</span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white hover:bg-gray-50 transition group"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <FileText className="w-4 h-4 text-primary" />
        {label}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition" />
    </a>
  );
}
