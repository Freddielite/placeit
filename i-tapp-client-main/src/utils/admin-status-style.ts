// import { ApplicationStatus } from "./application-status.enum";

import {
  ApplicationStatus,
  CompanyStatus,
  OpportunityStatus,
  StudentStatus,
} from "@/types/enums";

const baseStyle = "px-2 py-1 rounded-lg text-xs  ";

export const applicationStatusStyle: Record<ApplicationStatus, string> = {
  // early / neutral
  [ApplicationStatus.APPLIED]: `${baseStyle} bg-blue-100 text-blue-700`,
  [ApplicationStatus.IN_REVIEW]: `${baseStyle} bg-indigo-100 text-indigo-700`,
  [ApplicationStatus.SHORTLISTED]: `${baseStyle} bg-cyan-100 text-cyan-700`,
  [ApplicationStatus.INTERVIEW]: `${baseStyle} bg-purple-100 text-purple-700`,
  [ApplicationStatus.INTERVIEW_SCHEDULED]: `${baseStyle} bg-purple-100 text-purple-700`,
  [ApplicationStatus.OFFERED]: `${baseStyle} bg-emerald-100 text-emerald-700`,
  [ApplicationStatus.ACCEPTED]: `${baseStyle} bg-green-100 text-green-700`,
  [ApplicationStatus.REJECTED]: `${baseStyle} bg-red-100 text-red-700`,
  [ApplicationStatus.DECLINED]: `${baseStyle} bg-red-100 text-red-700`,
  [ApplicationStatus.WITHDRAWN]: `${baseStyle} bg-gray-100 text-gray-600`,
  [ApplicationStatus.EXPIRED]: `${baseStyle} bg-gray-100 text-gray-500`,
  [ApplicationStatus.INTERVIEWING]: `${baseStyle} bg-green-100 text-green-700`,
  [ApplicationStatus.APPROVED]: `${baseStyle} bg-green-100 text-green-700`,
};

export const companyStatusStyle: Record<CompanyStatus, string> = {
  [CompanyStatus.PENDING]: `${baseStyle} bg-yellow-100 text-yellow-700`,
  [CompanyStatus.UNDER_REVIEW]: `${baseStyle} bg-indigo-100 text-indigo-700`,
  [CompanyStatus.APPROVED]: `${baseStyle} bg-green-100 text-green-700`,
  [CompanyStatus.REJECTED]: `${baseStyle} bg-red-100 text-red-700`,
  [CompanyStatus.SUSPENDED]: `${baseStyle} bg-gray-100 text-gray-600`,
};

export const opportunityStatusStyle: Record<OpportunityStatus, string> = {
  [OpportunityStatus.DRAFT]: `${baseStyle} bg-gray-100 text-gray-600`,
  [OpportunityStatus.REVIEW]: `${baseStyle} bg-indigo-100 text-indigo-700`,
  [OpportunityStatus.OPEN]: `${baseStyle} bg-green-100 text-green-700`,
  [OpportunityStatus.PAUSED]: `${baseStyle} bg-yellow-100 text-yellow-700`,
  [OpportunityStatus.CLOSED]: `${baseStyle} bg-red-100 text-red-700`,
  [OpportunityStatus.FILLED]: `${baseStyle} bg-emerald-100 text-emerald-700`,
  [OpportunityStatus.EXPIRED]: `${baseStyle} bg-gray-100 text-gray-500`,

  // risk
  [OpportunityStatus.FLAGGED]: `${baseStyle} bg-orange-100 text-orange-700`,
};

export const studentStatusStyle: Record<StudentStatus, string> = {
  [StudentStatus.ACTIVE]: `${baseStyle} bg-green-100 text-green-700`,
  [StudentStatus.INACTIVE]: `${baseStyle} bg-gray-100 text-gray-600`,
  [StudentStatus.SUSPENDED]: `${baseStyle} bg-red-100 text-red-700`,
};

export const offerStatusStyle = {
  SENT: `${baseStyle} bg-blue-100 text-blue-700`,
  ACCEPTED: `${baseStyle} bg-green-100 text-green-700`,
  DECLINED: `${baseStyle} bg-red-100 text-red-700`,
  EXPIRED: `${baseStyle} bg-gray-100 text-gray-600`,
};
