import { Inter } from "next/font/google";

export interface Applicant {
  id: string;
  name: string;
  university: string;
  accepted: boolean;
  student: Student;
  startDate?: string;
  endDate?: string;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
  role: string;
}

export interface Company {
  id: string;
  industry: string;
  name: string;
  registrationNumber: string;
  address: string;
  city?: string;
  state?: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  studentCapacity: number;
  foundedYear?: string;
  companySize?: string;

  description: string;

  phone: string;
  email: string;
  avatarUrl: string;
  logo: string;

  status: string;

  role: string;
  // user?: User;
}

export interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  role: string;
  status?: string;
  stateOfDeployment?: string;
  stateCode?: string;
  nyscRegNumber?: string;
  batchYear?: string;
  stream?: "A" | "B";
  courseOfStudy?: string;
  degreeType?: string;
  school?: string;
  graduationYear?: string;
  gpa?: string;
  techSkills?: string[];
  softSkills?: string[];
  bio?: string;
  cvUrl?: string;
  callUpLetterUrl?: string;
  user: {
    id: string;
    email?: string;
    role?: string;
    isVerified?: boolean;
    isActive?: boolean;
    phone?: string | null;
    lastLoginAt?: string;
    avatarUrl?: string;
  };
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  profileImageUrl: string;
  matriculationNumber: string;
  level: string;
  // user: User;
  phone: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  role: string;
  dob: string;
  address: string;
  courseOfStudy?: string;
  softSkills?: string[];
  techSkills?: string[];
  preferredIndustry?: string;
  preferredLocation?: string;
  goals?: string;
  bio?: string;
  user: {
    id: string;
    email?: string;
    role?: string;
    isVerified?: boolean;
    isActive?: boolean;
    phone?: string | null;
    lastLoginAt?: string;
    avatarUrl?: string;
  };
}

type OpportunityStatus = "open" | "closed" | "draft";

export interface Opportunity {
  id: string;

  title: string;
  description: string;
  location: string;

  type: string;
  programType?: "siwes" | "ppa";
  mode: string;
  status: OpportunityStatus;

  duration: number;
  department: string[];
  industry: string;
  totalApplications: number;

  autoCloseOnDeadline: boolean;

  resumeRequired: boolean;

  schoolLetterRequired: boolean;
  maxApplicants: number;

  skills: string;
  applicationDeadline: string;
  hasApplied: boolean;
  createdAt: string;
  company: Company;
  applications: Application[];
  // applicants?: Applicant[];

  preferredFields?: { id: string; field: string }[];
  preferredFieldsOfStudy?: { id: string; field: string }[];
}

export interface Application {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  opportunity: Opportunity;
  student: Student | null;
  corpsMember?: { id: string; firstName: string; lastName: string; email: string | null; nyscRegNumber: string | null; profileImage: string | null } | null;
}

export interface Offers {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  stipend: number;
  // opportunity: Opportunity;
  // student: Student;

  offerLetter: string;
  acceptedAt?: string;
  declinedAt?: string;
  expiredAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Env {
  appEnv?: string;
  appName?: string;
  apiBaseUrl?: string;
  frontendUrl?: string;
}

export const departments = [
  "Science",
  "Law",
  "Management Sciences / Business Administration",
  "Social Sciences",
  "Arts / Humanities",
  "Education",
  "Environmental Sciences",
  "Agriculture",
  "Engineering / Technology",
  "Health Sciences / Medical Sciences",
];
