"use client";

import { useFetchCorpsSavedPPA } from "@/queries/corps";
import { saveCorpsPPA } from "@/actions";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MapPin, Clock, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/tailwind";

export default function SavedPPAPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchCorpsSavedPPA();
  const saved: any[] = data?.data ?? [];

  const { execute: unsave } = useAction(saveCorpsPPA, {
    onSuccess: () => {
      toast.success("Removed from saved.");
      queryClient.invalidateQueries({ queryKey: ["corps-ppa-saved"] });
    },
    onError: () => toast.error("Failed to unsave."),
  });

  return (
    <Wrapper className="pt-14 pb-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved PPA Listings</h2>
          <p className="text-gray-500 mt-1 text-sm">{saved.length} saved</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No saved listings</p>
            <p className="text-sm mt-1">Bookmark PPA listings to find them here</p>
            <Link href="/portal/find-ppa" className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
              Browse PPAs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map((ppa: any) => (
              <div key={ppa.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0">
                    {ppa.company?.name?.charAt(0) ?? "P"}
                  </div>
                  <button
                    onClick={() => unsave({ id: ppa.id })}
                    className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
                <p className="font-semibold text-gray-900 truncate">{ppa.title}</p>
                <p className="text-sm text-gray-500">{ppa.company?.name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ppa.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ppa.duration}</span>
                </div>
                <Link
                  href={`/portal/find-ppa`}
                  className="mt-4 block text-center text-sm text-primary font-medium hover:underline"
                >
                  View listing →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
