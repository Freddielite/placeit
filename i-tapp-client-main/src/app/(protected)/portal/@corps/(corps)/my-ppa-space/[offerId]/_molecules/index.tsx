"use client";

import { useFetchCorpsOfferDetail } from "@/queries/corps";
import { acceptCorpsOffer, declineCorpsOffer } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, Building2, Globe, ArrowLeft } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default function CorpsOfferDetail() {
  const { offerId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: offer, isLoading } = useFetchCorpsOfferDetail(offerId as string);

  const updateStatus = (status: string) => {
    queryClient.setQueryData(["corps-offer-detail", offerId], (old: any) =>
      old ? { ...old, status } : old,
    );
    queryClient.invalidateQueries({ queryKey: ["corps-offers"] });
  };

  const { execute: accept, isExecuting: isAccepting } = useAction(acceptCorpsOffer, {
    onSuccess: () => { toast.success("Offer accepted!"); updateStatus("ACCEPTED"); },
    onError: () => toast.error("Failed to accept offer."),
  });

  const { execute: decline, isExecuting: isDeclining } = useAction(declineCorpsOffer, {
    onSuccess: () => { toast.success("Offer declined."); updateStatus("DECLINED"); },
    onError: () => toast.error("Failed to decline offer."),
  });

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  if (!offer) return <div className="flex justify-center items-center min-h-screen text-gray-400">Offer not found.</div>;

  const status = offer.status?.toLowerCase();
  const company = offer.company;
  const opp = offer.application?.opportunity;

  return (
    <div className="pt-14 min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My PPA Space
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-2xl flex items-center justify-center border-2 border-white shadow-sm">
              {company?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{company?.industry}</p>
              {company?.address && (
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />{company.address}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="shrink-0">
            {(status === "sent" || status === "offered") && (
              <div className="flex gap-3">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => accept({ id: offerId as string })}
                  disabled={isAccepting || isDeclining}
                >
                  {isAccepting ? "Accepting..." : "Accept Offer"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => decline({ id: offerId as string })}
                  disabled={isAccepting || isDeclining}
                >
                  {isDeclining ? "Declining..." : "Decline"}
                </Button>
              </div>
            )}
            {(status === "accepted") && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-lg text-sm">You accepted this offer</span>
            )}
            {(status === "declined") && (
              <span className="text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-lg text-sm">You declined this offer</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Placement Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600"><Calendar className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="font-semibold text-gray-900">{offer.startDate ? moment(offer.startDate).format("MMM D, YYYY") : "TBD"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600"><Calendar className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-gray-400">End Date</p>
                    <p className="font-semibold text-gray-900">{offer.endDate ? moment(offer.endDate).format("MMM D, YYYY") : "TBD"}</p>
                  </div>
                </div>
              </div>
              {opp?.duration && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Duration: <span className="font-semibold text-gray-900">{opp.duration}</span>
                </div>
              )}
            </section>

            {/* Company description */}
            {company?.description && (
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">About the Company</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
              </section>
            )}

            {/* Offer letter */}
            {offer.letterUrl && (
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Offer Letter</h3>
                <a
                  href={offer.letterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Download Offer Letter
                </a>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <section className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Company Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  {company?.industry ?? "N/A"}
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  {company?.headquarters ?? company?.address ?? "N/A"}
                </li>
                {company?.website && (
                  <li>
                    <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Globe className="w-4 h-4 shrink-0" />{company.website}
                    </a>
                  </li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
