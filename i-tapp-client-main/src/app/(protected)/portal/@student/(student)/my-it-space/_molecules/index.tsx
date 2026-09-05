"use client";
import { useState } from "react";

import OfferCard from "../[offerId]/_molecules/offer-card";
import CompanyDetailsPage from "../[offerId]/_molecules";
import EmptyState from "./empty-space";
import { useFetchOffers } from "@/hooks/query";
import { Spinner } from "@/components/spinner";

// Mock data for multiple offers
const mockOffers = [
  {
    id: "1",
    name: "TechBridge Innovations",
    location: "Lekki Phase 1, Lagos, Nigeria",
    startDate: "2025-05-12",
    endDate: "2025-09-20",
    founded: "2014",
    industry: "Software Engineering & Digital Solutions",
    duration: 4,
    capacity: "150+ Employees",
    website: "techbridge.africa",
    description:
      "Leading African software engineering company helping enterprises build scalable applications.",
    status: "Offer Received",
  },
  {
    id: "2",
    name: "Lala Inc. (Shell)",
    location: "Abuja, Nigeria",
    startDate: "2025-03-01",
    endDate: "2025-05-29",
    founded: "2024",
    industry: "Oil & Gas / Testing",
    duration: 3,
    capacity: "90,000+ Employees",
    website: "shell.com",
    description:
      "Global group of energy and petrochemicals companies with operations in more than 70 countries.",
    status: "Offer Received",
  },
  {
    id: "3",
    name: "DataCore Analytics",
    location: "Victoria Island, Lagos, Nigeria",
    startDate: "2025-04-15",
    endDate: "2025-08-15",
    founded: "2018",
    industry: "Data Science & Analytics",
    duration: 4,
    capacity: "75+ Employees",
    website: "datacore.ng",
    description:
      "Specializing in big data analytics, machine learning, and business intelligence solutions.",
    status: "Offer Received",
  },
];

const MyItSpace = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { data, isLoading } = useFetchOffers();

  if (isLoading) return <Spinner />;

  const offers = data || [];

  const TransformData = (data: any) => {
    return data.map((item: any) => ({
      id: item.id,
      name: item.company.name,
      location: item.company.address,
      startDate: item.opportunity.startDate,
      endDate: item.opportunity.endDate,
      founded: item.company.foundedYear,
      industry: item.company.industry,
      duration: item.opportunity.duration,
      capacity: item.company.size,
      website: item.company.website,
      description: item.company.description,
      status: "Offer Received",
    }));
  };

  // If a company is selected, show detail view
  if (selectedCompany) {
    return (
      <CompanyDetailsPage
      // company={selectedCompany}
      // onBack={() => setSelectedCompany(null)}
      />
    );
  }

  // Otherwise, show the offers list
  return (
    <OffersListView offers={offers} onSelectCompany={setSelectedCompany} />
  );
};

// Offers List View Component
const OffersListView = ({ offers, onSelectCompany }: any) => {
  return (
    <div className=" min-h-screen mt-5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My IT Placement Offers
          </h1>
          <p className="text-gray-600">
            You have{" "}
            <span className="font-semibold text-blue-600">{offers.length}</span>{" "}
            placement offer{offers.length !== 1 ? "s" : ""} to review
          </p>
        </div>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((company: any) => {
              const applicationData = company?.application;
              const opportunityData = applicationData?.opportunity;
              const companyData = company?.company;
              return (
                <OfferCard
                  key={company.id}
                  id={company.id}
                  opportunity={opportunityData}
                  company={companyData}
                  application={applicationData}
                  onSelect={onSelectCompany}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItSpace;
