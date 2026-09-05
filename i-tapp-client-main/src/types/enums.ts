export enum ApplicationStatus {
  APPLIED = "applied",
  IN_REVIEW = "in_review",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview", // Interview stage (optional but common)
  INTERVIEW_SCHEDULED = "interview_scheduled",
  OFFERED = "offered", // Company has given an offer letter
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  DECLINED = "declined",
  INTERVIEWING = "interviewing",
  APPROVED = "approved",

  WITHDRAWN = "withdrawn",
  EXPIRED = "expired", // Company didn't respond in time
}

export enum OpportunityStatus {
  OPEN = "open",
  CLOSED = "closed",
  DRAFT = "draft",
  PAUSED = "paused",
  FILLED = "filled",
  EXPIRED = "expired",
  REVIEW = "review", // when admin needs to approve
  FLAGGED = "flagged", // when reported for issues
}

export enum StudentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum OpportunityMode {
  REMOTE = "remote",
  ONSITE = "onsite",
  HYBRID = "hybrid",
  FLEXIBLE = "flexible",
}

export enum OpportunityType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  INTERNSHIP = "internship",
  CONTRACT = "contract",
  FREELANCE = "freelance",
}

export enum ProgramType {
  SIWES = "siwes",
  PPA = "ppa",
}

export enum OpportunityLevel {
  ENTRY = "entry",
  MID = "mid",
  SENIOR = "senior",
  LEAD = "lead",
  DIRECTOR = "director",
  EXECUTIVE = "executive",
}

export enum CompanyStatus {
  PENDING = "pending", // signed up, docs not reviewed
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended", // previously approved, later disabled
}

export enum DocumentReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum CompanyDocumentType {
  CAC_CERTIFICATE = "cac_certificate",
  ADDRESS_PROOF = "address_proof",
  OTHER = "other",
}
