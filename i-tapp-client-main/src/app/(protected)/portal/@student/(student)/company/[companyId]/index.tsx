"use client";
import InfoCard from "@/components/info-card";
import ProfileHeaderBanner from "@/components/profile-header-banner";
import { Spinner } from "@/components/spinner";
import { useFetchCompanyDetails } from "@/hooks/query";
import {
  Briefcase,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

type Company = {
  id: string;
  name: string;
};

type ProfileHeaderBannerProps = {
  data: Company;
  icon?: React.ReactNode;
};

export default function CompanyDetails() {
  const { companyId } = useParams();

  const { data: companyDetails, isLoading } = useFetchCompanyDetails(
    companyId as string,
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen mt-12  py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}

          <ProfileHeaderBanner
            // data={companyDetails}
            profile={{
              type: "company",
              bannerImage: "",
            }}
            // setEditing={setEditing}
            // onLogout={handleLogout}
            icon={<Building2 className="w-16 h-16 text-white" />}
          />

          {/* Company Name & Basic Info */}
          <div className="pt-20 px-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {companyDetails?.name || "Company Name"}
            </h1>
            {companyDetails?.industry && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {companyDetails?.industry}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {companyDetails?.description && (
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {companyDetails?.description}
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
                value={companyDetails?.user?.email}
                href={
                  companyDetails?.user?.email
                    ? `mailto:${companyDetails.user.email}`
                    : undefined
                }
              />
              <InfoCard
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={companyDetails?.phone}
                href={
                  companyDetails?.phone
                    ? `tel:${companyDetails.phone}`
                    : undefined
                }
              />
              <InfoCard
                icon={<Globe className="w-5 h-5" />}
                label="Website"
                value={companyDetails?.website}
                href={companyDetails?.website}
                external
              />
              <InfoCard
                icon={<Users className="w-5 h-5" />}
                label="Student Capacity"
                value={companyDetails.studentCapacity?.toString()}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5" />}
                label="Address"
                value={companyDetails?.address}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
