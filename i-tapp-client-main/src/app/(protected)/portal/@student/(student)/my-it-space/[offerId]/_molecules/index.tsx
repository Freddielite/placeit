import React from "react";
import Image from "next/image";
import moment from "moment";
import {
  MapPin,
  Calendar,
  Building2,
  Globe,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import somPng from "@/assets/images/company.png";
import { useParams } from "next/navigation";
import { useFetchOfferDetails } from "@/hooks/query";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import DownloadOfferLetterSection from "./offer-letter";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import Loading from "@/components/loading";
import { acceptOffer, declineOffer } from "@/actions";

// ---- Mock Data for this specific page view ----
// This represents the data fetched for the single company being viewed
const companyDetails = {
  id: 1,
  name: "Lala Inc. (Shell)",
  location: "Abuja, Nigeria",
  bannerUrl: somPng, // Using your import
  startDate: "2025-03-01",
  endDate: "2025-05-29",
  founded: "2024",
  headquarters: "N/A",
  industry: "Oil & Gas / Testing",
  duration: 3,
  capacity: "N/A",
  website: "ask.com",
  status: "Offer Received",
  description:
    "We are a global group of energy and petrochemicals companies with over 90,000 employees in more than 70 countries and territories. Our operations are divided into Upstream, Integrated Gas and New Energies, Downstream, and Projects & Technology.",
};
// --------------------------------------------------

const CompanyDetailsPage = () => {
  const { offerId } = useParams();
  const company = companyDetails;
  const queryClient = useQueryClient();

  const { data: offerDetails, isLoading } = useFetchOfferDetails(
    offerId as string,
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["offer-details", offerId] });
  };

  const { execute: acceptOfferExecute, isExecuting: isAccepting } = useAction(
    acceptOffer,
    {
      onSuccess: () => {
        toast.success("Offer accepted!");
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "Failed to accept offer.");
      },
    },
  );

  const { execute: declineOfferExecute, isExecuting: isDeclining } = useAction(
    declineOffer,
    {
      onSuccess: () => {
        toast.success("Offer declined.");
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.error?.serverError || "Failed to decline offer.");
      },
    },
  );

  const companyDetail = offerDetails?.company || company;
  const applicationDetails = offerDetails?.application || null;
  const opportunityDetails = applicationDetails?.opportunity || null;

  const status = applicationDetails?.status || "offered";

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* 1. Hero Banner Image */}
      <div className="w-full h-64 md:h-80 relative">
        <Image
          src={company.bannerUrl}
          alt={`${company.name} Banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent"></div>
      </div>

      {/* Main Content Container that overlaps the banner slightly */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">
        {/* 2. Header Card: Identity & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Placeholder Logo */}
            <div className="flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-full text-3xl font-bold shadow-sm border-4 border-white">
              {companyDetail.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {companyDetail.name}
                </h1>
                {/* Status Pill */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 size={16} className="mr-1" /> {company.status}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={18} className="mr-1 text-gray-400" />
                <p>{companyDetail.address}</p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="w-full md:w-auto">
            {/* Conditional Buttons based on status */}
            {status === "offered" && (
              <div className="mt-4 flex gap-4">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => acceptOfferExecute({ id: offerId as string })}
                  disabled={isAccepting || isDeclining}
                >
                  Accept Offer {isAccepting && <Loading />}
                </Button>
                <Button
                  variant="destructive"
                  className="text-white hover:bg-red-700"
                  onClick={() => declineOfferExecute({ id: offerId as string })}
                  disabled={isAccepting || isDeclining}
                >
                  Decline Offer {isDeclining && <Loading />}
                </Button>
              </div>
            )}

            {status === "accepted" && (
              <p className="mt-4 text-green-700 font-semibold">
                You have accepted this offer.
              </p>
            )}

            {status === "declined" && (
              <p className="mt-4 text-red-600 font-semibold">
                You have declined this offer.
              </p>
            )}
          </div>
        </div>

        {/* 3. Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Details (Span 2 of 3 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Placement Timeline Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Placement Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4 text-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {moment(offerDetails.startDate).format("MMMM Do, YYYY")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4 text-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {moment(offerDetails.endDate).format("MMMM Do, YYYY")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center text-gray-600">
                <Clock size={18} className="mr-2 text-gray-400" />
                <span>
                  Total Duration:{" "}
                  <span className="font-semibold text-gray-900">
                    {opportunityDetails.duration} Months
                  </span>
                </span>
              </div>
            </section>

            {/* Description Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Company
              </h3>
              <div className="prose max-w-none text-gray-700">
                <p>{companyDetail.description || "No description provided."}</p>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Stats (Span 1 of 3 columns) */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Company Snapshot
              </h3>

              {/* Modernized List instead of Grid */}
              <ul className="space-y-5">
                <StatItem
                  icon={<Building2 size={20} />}
                  label="Industry"
                  value={companyDetail.industry}
                />
                <StatItem
                  icon={<MapPin size={20} />}
                  label="Headquarters"
                  value={companyDetail.headquarters}
                />
                <StatItem
                  icon={<Globe size={20} />}
                  label="Website"
                  value={companyDetail.website}
                  isLink={
                    !!companyDetail.website && companyDetail.website !== "N/A"
                  }
                />
                <StatItem
                  icon={<Clock size={20} />}
                  label="Founded"
                  value={companyDetail.founded}
                />
                <StatItem
                  icon={<Users size={20} />}
                  label="Company Size"
                  value={companyDetail.capacity}
                />
              </ul>
            </section>

            <DownloadOfferLetterSection offerDetails={offerDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the sidebar stats items to keep code clean
const StatItem = ({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLink?: boolean;
}) => {
  const displayValue = value || "N/A";
  return (
    <li className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center text-gray-500">
        <span className="mr-3 text-gray-400">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900 text-right max-w-[50%] truncate">
        {isLink ? (
          <a
            href={`https://${displayValue}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {displayValue}
          </a>
        ) : (
          displayValue
        )}
      </div>
    </li>
  );
};

export default CompanyDetailsPage;
