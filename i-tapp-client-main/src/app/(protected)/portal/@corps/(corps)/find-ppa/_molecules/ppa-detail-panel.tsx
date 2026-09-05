"use client";

import { useFetchCorpsPPADetail, useFetchCorpsPPAApplicationStatus } from "@/queries/corps";
import { applyToPPA, withdrawPPAApplication, saveCorpsPPA, initializeCorpsPayment } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  X, MapPin, Clock, Globe, Building2, BookmarkIcon,
  Banknote, CalendarDays, Layers, CheckCircle2, Mail, Phone, User,
} from "lucide-react";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import dp from "@/assets/images/dp.png";
import { useState } from "react";
import { cn } from "@/utils/tailwind";

export default function PPADetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: ppa, isLoading } = useFetchCorpsPPADetail(id);
  const { data: appStatus } = useFetchCorpsPPAApplicationStatus(id);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pendingCoverLetter, setPendingCoverLetter] = useState<string | undefined>();
  const [paymentPrompt, setPaymentPrompt] = useState<{ fee: number } | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["corps-ppa-status", id] });
    queryClient.invalidateQueries({ queryKey: ["corps-applications"] });
  };

  const { execute: initPayment, isExecuting: isInitingPayment } = useAction(initializeCorpsPayment, {
    onSuccess: (res) => {
      if (res?.data?.authorizationUrl) {
        window.location.href = res.data.authorizationUrl;
      }
    },
    onError: () => toast.error("Failed to initialize payment. Please try again."),
  });

  const { execute: apply, isExecuting: isApplying } = useAction(applyToPPA, {
    onSuccess: (res) => {
      if (res?.data?.requiresPayment) {
        setShowApplyModal(false);
        setPaymentPrompt({ fee: res.data.fee ?? 1000 });
      } else {
        toast.success("Application submitted!");
        invalidate();
        setShowApplyModal(false);
      }
    },
    onError: () => toast.error("Application failed. Please try again."),
  });

  const { execute: withdraw, isExecuting: isWithdrawing } = useAction(withdrawPPAApplication, {
    onSuccess: () => { toast.success("Application withdrawn."); invalidate(); },
    onError: () => toast.error("Failed to withdraw application."),
  });

  const { execute: toggleSave } = useAction(saveCorpsPPA, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["corps-ppa-detail", id] }),
    onError: () => toast.error("Failed to save"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (!ppa) return null;

  const hasApplied = appStatus?.hasApplied;
  const appStatusValue = appStatus?.status;
  const companyName = ppa.contactDetails?.name ?? ppa.company?.name ?? null;
  const industry = ppa.sector ?? ppa.company?.industry ?? null;
  const logo = ppa.company?.logo ?? null;
  const contactDetails = ppa.contactDetails ?? null;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header bar ── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">PPA Detail</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleSave({ id })}
            title={ppa.isSaved ? "Unsave" : "Save"}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              ppa.isSaved ? "text-primary bg-primary/10" : "text-gray-400 hover:text-primary hover:bg-primary/10"
            )}
          >
            <BookmarkIcon className="w-4 h-4" fill={ppa.isSaved ? "currentColor" : "none"} />
          </button>
          <button
          title="close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Hero block */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-12 h-12 border border-gray-100 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src={logo ?? dp}
                alt={companyName ?? "Organisation"}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-gray-900 leading-snug">{ppa.title}</h2>
              {companyName && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{companyName}</p>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
              ppa.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", ppa.status === "open" ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
              {ppa.status}
            </span>
            {ppa.applicationDeadline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                <CalendarDays className="w-3 h-3" />
                Deadline: {formatDate(ppa.applicationDeadline)}
              </span>
            )}
          </div>
        </div>

        {/* Meta grid */}
        <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-gray-100">
          {ppa.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Location</p>
                <p className="text-sm text-gray-800 capitalize">{ppa.location}</p>
              </div>
            </div>
          )}
          {ppa.duration && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Duration</p>
                <p className="text-sm text-gray-800">{ppa.duration} month{ppa.duration !== 1 ? "s" : ""}</p>
              </div>
            </div>
          )}
          {ppa.mode && (
            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Work Mode</p>
                <p className="text-sm text-gray-800 capitalize">{ppa.mode}</p>
              </div>
            </div>
          )}
          {ppa.stipend && (
            <div className="flex items-start gap-2">
              <Banknote className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Stipend</p>
                <p className="text-sm text-gray-800 capitalize">{ppa.stipend}</p>
              </div>
            </div>
          )}
        </div>

        {/* Preferred fields */}
        {ppa.preferredFields?.length > 0 && (
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preferred Fields</p>
            <div className="flex flex-wrap gap-1.5">
              {ppa.preferredFields.map((f: string) => (
                <span key={f} className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium capitalize">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {ppa.description && (
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About this PPA</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ppa.description}</p>
          </div>
        )}

        {/* Company info */}
        {(companyName || industry || ppa.company?.website) && (
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Organisation</p>
            <div className="space-y-2">
              {companyName && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  {companyName}
                </div>
              )}
              {industry && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Layers className="w-4 h-4 text-gray-400 shrink-0" />
                  {industry}
                </div>
              )}
              {ppa.company?.website && (
                <a
                  href={ppa.company.website.startsWith("http") ? ppa.company.website : `https://${ppa.company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {ppa.company.website}
                </a>
              )}
            </div>
          </div>
        )}
        {/* Contact details */}
        {contactDetails && (
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2">
              {contactDetails.name && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  {contactDetails.name}
                </div>
              )}
              {contactDetails.email && (
                <a href={`mailto:${contactDetails.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Mail className="w-4 h-4 shrink-0" />
                  {contactDetails.email}
                </a>
              )}
              {contactDetails.phone && (
                <a href={`tel:${contactDetails.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="w-4 h-4 shrink-0" />
                  {contactDetails.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky CTA footer ── */}
      <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
        {hasApplied ? (
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Applied · {appStatusValue}
            </span>
            {appStatusValue === "applied" && (
              <Button variant="outline" size="sm" disabled={isWithdrawing} onClick={() => withdraw({ id })}>
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            )}
          </div>
        ) : showApplyModal ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              placeholder="Cover letter (optional) — tell this company why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2">
              <Button
                disabled={isApplying || isInitingPayment}
                onClick={() => {
                  const cl = coverLetter || undefined;
                  setPendingCoverLetter(cl);
                  apply({ id, coverLetter: cl });
                }}
                className="flex-1"
              >
                {isApplying || isInitingPayment ? "Submitting..." : "Submit Application"}
              </Button>
              <Button variant="outline" onClick={() => setShowApplyModal(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowApplyModal(true)} className="w-full">
            Apply to this PPA
          </Button>
        )}
      </div>

      {/* ── Payment confirmation modal ── */}
      {paymentPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Payment Required</h3>
              <p className="text-sm text-gray-500">
                A one-time application fee is required to proceed. You won&apos;t be charged again for future applications.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Amount</span>
              <span className="text-lg font-black text-gray-900">₦{paymentPrompt.fee.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPaymentPrompt(null)}
                disabled={isInitingPayment}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={isInitingPayment}
                onClick={() => {
                  initPayment({ opportunityId: id, coverLetter: pendingCoverLetter });
                  setPaymentPrompt(null);
                }}
              >
                {isInitingPayment ? "Redirecting..." : "Pay & Apply"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
