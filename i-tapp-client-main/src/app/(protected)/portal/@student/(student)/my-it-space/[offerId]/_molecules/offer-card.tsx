"use client";

import React from "react";
import { formatDate } from "@/utils/format-date";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Calendar,
  Globe,
  Clock,
  Users,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Individual Offer Card Component
const OfferCard = ({
  company,
  opportunity,
  onSelect,
  application,
  id,
}: any) => {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
      // onClick={() => onSelect(company)}
      onClick={() => router.push(`/portal/my-it-space/${id}`)}
    >
      {/* Company Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg text-xl font-bold">
              {company?.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {company?.name ?? "Unknown Company"}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 size={12} className="mr-1" /> {application?.status ?? "Offered"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={16} className="mr-1 text-gray-400" />
          <span className="truncate">{company?.address ?? "Location not available"}</span>
        </div>

        {/* Key Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <Building2 size={16} className="mr-2 text-gray-400" />
            <span className="text-gray-600 truncate">{company?.industry ?? "—"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span className="text-gray-600">
              {company?.startDate ? formatDate(company.startDate) : "—"}{" "}
              {company?.endDate ? `- ${formatDate(company.endDate)}` : ""}
            </span>
          </div>
          {opportunity?.duration && (
            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-600">
                {opportunity.duration} Months Duration
              </span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {company?.description ?? ""}
        </p>

        {/* View Details Button */}
        <button className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm group-hover:bg-blue-600 group-hover:text-white">
          View Details
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
