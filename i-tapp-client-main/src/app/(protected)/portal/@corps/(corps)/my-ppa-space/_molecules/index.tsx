"use client";

import { useFetchCorpsOffers } from "@/queries/corps";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/utils/tailwind";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  offered: "bg-blue-50 text-blue-700",
  accepted: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
};

export default function MyPPASpace() {
  const { data, isLoading } = useFetchCorpsOffers();
  const offers: any[] = data ?? [];

  return (
    <Wrapper className="pt-14 pb-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My PPA Space</h2>
          <p className="text-gray-500 mt-1 text-sm">
            You have <span className="font-semibold text-emerald-600">{offers.length}</span> offer{offers.length !== 1 ? "s" : ""} to review
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No offers yet</p>
            <p className="text-sm mt-1">Apply to PPA listings and wait for companies to respond</p>
            <Link href="/portal/find-ppa" className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
              Find PPA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer: any) => (
              <Link
                key={offer.id}
                href={`/portal/my-ppa-space/${offer.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0">
                    {offer.company?.name?.charAt(0) ?? "P"}
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", STATUS_COLORS[offer.status] ?? "bg-gray-100 text-gray-500")}>
                    {offer.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{offer.company?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{offer.opportunity?.title}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                  {offer.company?.address && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{offer.company.address}</span>
                  )}
                  {offer.opportunity?.duration && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{offer.opportunity.duration}</span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-end text-primary text-sm font-medium group-hover:gap-2 transition-all gap-1">
                  View offer <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
