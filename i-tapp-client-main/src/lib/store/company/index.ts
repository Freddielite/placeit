import type { Company } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  company: Company | null;
  companyJobs: any[];
  selectedJob: any;
  totalApplicants: number;
  dismissed: boolean;
  acceptedApplicants: number;
  shortlistedApplicants: number;
  selectedApplicant: any;
  setDismissed: (dismissed: boolean) => void;
  setCompany: (c: Company | null) => void;
  setCompanyJobs: (jobs: any[]) => void;
  setTotalApplicants: (count: number) => void;
  setAcceptedApplicants: (count: number) => void;
  setSelectedJob: (job: any) => void;
  setShortlistedApplicants: (count: number) => void;
  setSelectedApplicant: (a: any) => void;
  updateCompanyProfile: (updates: Partial<Company>) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      company: null,
      dismissed: false,
      companyJobs: [],
      selectedJob: null,
      totalApplicants: 0,
      acceptedApplicants: 0,
      shortlistedApplicants: 0,
      selectedApplicant: null,

      setDismissed: (dismissed) => set({ dismissed }),
      setCompany: (c) => set({ company: c }),
      setSelectedJob: (job) => set({ selectedJob: job }),
      setCompanyJobs: (jobs) => set({ companyJobs: jobs }),
      setTotalApplicants: (count) => set({ totalApplicants: count }),
      setAcceptedApplicants: (count) => set({ acceptedApplicants: count }),
      setShortlistedApplicants: (count) =>
        set({ shortlistedApplicants: count }),
      setSelectedApplicant: (a) => set({ selectedApplicant: a }),

      updateCompanyProfile: (updates) =>
        set((state) => ({
          company: state.company ? { ...state.company, ...updates } : null,
        })),
    }),
    { name: "company-store" },
  ),
);
