import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// type OpportunitiesFilter = {
//   duration?: { checked: boolean; time: string }[];
//   industry?: { checked: boolean; industry: string }[];
//   status?: { checked: boolean; status: string }[];
//   location?: string;
// };

function buildOpportunityParams(filter: any, page: number, limit: number) {
  const queryObject: Record<string, any> = { page, limit };

  const selectedDuration = filter?.duration?.find(
    (d: { checked: boolean; time: string }) => d.checked,
  )?.time;
  if (selectedDuration) queryObject.duration = Number(selectedDuration);

  const selectedIndustry =
    filter?.industry
      ?.filter((i: { checked: boolean; industry: string }) => i.checked)
      .map((i: { checked: boolean; industry: string }) => i.industry) ?? [];
  if (selectedIndustry.length) queryObject.industry = selectedIndustry.join(",");

  const selectedStatus =
    filter?.status
      ?.filter((s: { checked: boolean; status: string }) => s.checked)
      .map((s: { checked: boolean; status: string }) => s.status) ?? [];
  if (selectedStatus.length) queryObject.status = selectedStatus.join(",");

  if (filter?.location?.trim()) queryObject.location = filter.location.trim();
  if (filter?.search?.trim()) queryObject.search = filter.search.trim();
  if (filter?.sortBy === "oldest") queryObject.sort = "oldest";

  return new URLSearchParams(queryObject).toString();
}

function parseOpportunityResponse(response: any) {
  const items = Array.isArray(response?.data) ? response.data : (response?.data?.data ?? response?.data ?? []);
  const total = response?.pagination?.totalItems ?? response?.data?.pagination?.totalItems ?? response?.total ?? items.length;
  return { items, total };
}

// Public / admin — all open opportunities
export const useFetchOpportunities = (filter?: any, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["opportunities", filter ?? {}, page, limit],
    staleTime: 0,
    queryFn: async () => {
      const qs = buildOpportunityParams(filter, page, limit);
      const response = await query(`/o${qs ? `?${qs}` : ""}`);
      return parseOpportunityResponse(response);
    },
  });
};

// Student portal — SIWES only
export const useFetchStudentOpportunities = (filter?: any, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["student-opportunities", filter ?? {}, page, limit],
    staleTime: 0,
    queryFn: async () => {
      const qs = buildOpportunityParams(filter, page, limit);
      const response = await query(`/o/browse${qs ? `?${qs}` : ""}`);
      return parseOpportunityResponse(response);
    },
  });
};

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const response = await query("/s/profile");
      return response;
    },
  });
};

export const useFetchCompanyProfile = () => {
  return useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const response = await query("/c/profile");
      return response;
    },
  });
};

export const useFetchCompanyDetails = (id?: string) => {
  return useQuery({
    queryKey: ["company-details", id],
    queryFn: async () => {
      const response = await query(`/c/profile/${id}/`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchApplication = () => {
  return useQuery({
    queryKey: ["application"],
    queryFn: async () => {
      const response = await query("/a/my-application");
      return response;
    },
  });
};

export const useFetchSavedApplication = () => {
  return useQuery({
    queryKey: ["saved-application"],
    queryFn: async () => {
      const response = await query("/s/saved/applications");
      return response;
    },
  });
};

export const useFetchOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await query("/offers/my-offers");
      return response;
    },
  });
};

export const useFetchOfferDetails = (id?: string) => {
  return useQuery({
    queryKey: ["offer-details", id],
    queryFn: async () => {
      const response = await query(`/offers/${id}/`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchAllCompanyApplications = () => {
  return useQuery({
    queryKey: ["company-application"],
    queryFn: async () => {
      const response = await query("/a/applicants");
      return response;
    },
  });
};

export const useFetchCompanyJobs = () => {
  return useQuery({
    queryKey: ["company-jobs"],
    queryFn: async () => {
      const response = await query("/c/jobs/all");
      return response;
    },
  });
};

export const useFetchCompanyOpportunities = () => {
  return useQuery({
    queryKey: ["company-opportunities"],
    queryFn: async () => {
      const response = await query("/o/me");
      return response;
    },
  });
};

export const useFetchOpportunityDetails = (id?: string) => {
  return useQuery({
    queryKey: ["opportunity-details", id],
    queryFn: async () => {
      const response = await query(`/o/${id}/details`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchOpportunityPublicDetails = (id?: string) => {
  return useQuery({
    queryKey: ["opportunity-public-details", id],
    queryFn: async () => {
      const response = await query(`/o/${id}`);
      return response;
    },
    enabled: Boolean(id),
    staleTime: 0,
  });
};

export const useFetchStudentDetails = (id?: string) => {
  return useQuery({
    queryKey: ["student-details", id],
    queryFn: async () => {
      const response = await query(`/s/${id}/`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchCorpsDetails = (id?: string) => {
  return useQuery({
    queryKey: ["corps-details", id],
    queryFn: async () => {
      const response = await query(`/corps/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchApplicationDetails = (id?: string) => {
  return useQuery({
    queryKey: ["application-details", id],
    queryFn: async () => {
      const response = await query(`/a/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await query("/auth/me");
      return response;
    },
  });
};

export const useFetchMyTransactions = () => {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: async () => {
      const response = await query("/payments/my-transactions");
      return response as Array<{
        id: string;
        reference: string;
        amount: number;
        status: "pending" | "success" | "failed";
        purpose: string;
        metadata: { opportunityId?: string; coverLetter?: string };
        createdAt: string;
      }>;
    },
  });
};
