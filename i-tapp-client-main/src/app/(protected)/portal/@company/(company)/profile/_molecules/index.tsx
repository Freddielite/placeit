"use client";

import { useState } from "react";
import ProfileForm from "./profile-form";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Hash,
  Calendar,
  FileText,
  Edit3,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import InfoCard from "@/components/info-card";
import ProfileHeaderBanner from "@/components/profile-header-banner";
import { useFetchCompanyProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import { useLogout } from "@/hooks/use-logout";

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const { data: companyProfile, isLoading } = useFetchCompanyProfile();
  const logout = useLogout();

  if (isLoading) return <Spinner />;

  return (
    <>
      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          style={{ animation: "backdropIn 200ms ease forwards" }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />
          <div
            className="relative w-full md:max-w-2xl md:mx-4 bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              maxHeight: "92dvh",
              animation: "sheetIn 300ms cubic-bezier(0.32,0.72,0,1) forwards",
            }}
          >
            <div className="h-1 w-full bg-primary shrink-0" />
            <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">
                  Edit Company Profile
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your company details
                </p>
              </div>
              <button
                title="close"
                type="button"
                onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-5 md:px-8">
              <ProfileForm onClose={() => setEditing(false)} />
            </div>
            <div className="shrink-0 border-t border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/80">
              <button
                type="button"
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} /> Sign out
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="company-profile-form"
                  className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (min-width: 768px) {
          @keyframes sheetIn {
            from { transform: translateY(12px) scale(0.97); opacity: 0; }
            to   { transform: translateY(0)    scale(1);    opacity: 1; }
          }
        }
      `}</style>

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <ProfileHeaderBanner
              profile={{
                type: "company",
                profileImage: companyProfile?.logo,
                bannerImage: companyProfile?.banner,
              }}
              icon={<Building2 className="w-16 h-16 text-white" />}
            />

            {/* Edit / Logout buttons */}
            <div className="pt-6 px-4 md:px-8 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex gap-2 items-center px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium text-sm"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex gap-2 items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            {/* Company Name & Basic Info */}
            <div className="pt-20 px-8 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {companyProfile?.name || "Company Name"}
              </h1>
              {companyProfile?.industry && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {companyProfile.industry}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {companyProfile?.description && (
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {companyProfile?.description}
                </p>
              </div>
            )}

            {/* Contact & Details Grid */}
            <div className="p-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  value={companyProfile?.user?.email ?? companyProfile?.email}
                  href={
                    companyProfile?.user?.email
                      ? `mailto:${companyProfile.user.email}`
                      : undefined
                  }
                />
                <InfoCard
                  icon={<Phone className="w-5 h-5" />}
                  label="Contact Phone Number"
                  value={companyProfile?.phone}
                  href={
                    companyProfile?.phone
                      ? `tel:${companyProfile.phone}`
                      : undefined
                  }
                />
                <InfoCard
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Industry"
                  value={companyProfile?.industry}
                />
                <InfoCard
                  icon={<Users className="w-5 h-5" />}
                  label="Company Size"
                  value={companyProfile?.companySize}
                />
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Founded Year"
                  value={companyProfile?.foundedYear}
                />
                <InfoCard
                  icon={<Globe className="w-5 h-5" />}
                  label="Website"
                  value={companyProfile?.website}
                  href={companyProfile?.website}
                  external
                />
                <InfoCard
                  icon={<Hash className="w-5 h-5" />}
                  label="RC / Registration Number"
                  value={companyProfile?.registrationNumber}
                />
                <InfoCard
                  icon={<MapPin className="w-5 h-5" />}
                  label="City"
                  value={companyProfile?.city}
                />
                <InfoCard
                  icon={<MapPin className="w-5 h-5" />}
                  label="State"
                  value={companyProfile?.state}
                />
                <InfoCard
                  icon={<MapPin className="w-5 h-5" />}
                  label="Full Address"
                  value={companyProfile?.address}
                  fullWidth
                />
              </div>
            </div>

            {/* Documents */}
            <div className="px-8 py-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">CAC Document</p>
                  {companyProfile?.cacDocument ? (
                    <Link
                      href={companyProfile.cacDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Proof of Address</p>
                  {companyProfile?.proofOfAddress ? (
                    <Link
                      href={companyProfile.proofOfAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
