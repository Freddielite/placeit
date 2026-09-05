"use client";

import { useFetchMyProfile } from "@/hooks/query";
import { useFetchCorpsApplications, useFetchCorpsOffers } from "@/queries/corps";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { MapPin, Search, FileText, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function CorpsDashboardPage() {
  const { data, isLoading } = useFetchMyProfile();
  const { data: appsData } = useFetchCorpsApplications();
  const { data: offersData } = useFetchCorpsOffers();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;

  const corps = data?.corps;
  const name = corps ? `${corps.firstName ?? ""} ${corps.lastName ?? ""}`.trim() : "Corps Member";
  const applicationsCount = appsData?.data?.total ?? 0;
  const offersCount = (offersData ?? []).length;
  const isApproved = corps?.isApproved ?? false;

  return (
    <Wrapper className="pt-14 pb-10">
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Your NYSC PPA dashboard</p>
        </div>

        {/* Approval banner */}
        {!isApproved && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Profile pending admin approval</p>
              <p className="text-xs text-amber-600 mt-0.5">Once approved, you'll be matched with PPA listings in your deployment state.</p>
            </div>
          </div>
        )}

        {/* Deployment info */}
        {corps?.stateOfDeployment && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Deployment State</p>
              <p className="font-semibold text-gray-900 mt-0.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-500" />
                {corps.stateOfDeployment}{corps.stream ? ` · Stream ${corps.stream}` : ""}
              </p>
            </div>
            {corps.nyscRegNumber && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">NYSC Reg No.</p>
                <p className="font-semibold text-gray-900 mt-0.5">{corps.nyscRegNumber}</p>
              </div>
            )}
            {corps.batchYear && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Batch</p>
                <p className="font-semibold text-gray-900 mt-0.5">{corps.batchYear}</p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Applications</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{applicationsCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Offers</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{offersCount}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/portal/find-ppa", icon: Search, label: "Browse PPA Listings", desc: "Find opportunities in your state", color: "text-blue-600 bg-blue-50" },
            { href: "/portal/my-applications", icon: FileText, label: "My Applications", desc: `${applicationsCount} application${applicationsCount !== 1 ? "s" : ""}`, color: "text-violet-600 bg-violet-50" },
            { href: "/portal/my-ppa-space", icon: Briefcase, label: "My PPA Space", desc: `${offersCount} offer${offersCount !== 1 ? "s" : ""}`, color: "text-emerald-600 bg-emerald-50" },
          ].map(({ href, icon: Icon, label, desc, color }) => (
            <Link key={href} href={href} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md hover:border-primary/20 transition-all group">
              <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
