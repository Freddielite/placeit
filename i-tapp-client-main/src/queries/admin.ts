import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

const useFetchCompanies = () => {
  return useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const response = await query("/c");
      return response;
    },
  });
};

const useFetchAdmins = () => {
  return useQuery({
    queryKey: ["admin-admins"],
    queryFn: async () => {
      const response = await query("/admin");
      return response;
    },
  });
};

const useFetchOffers = () => {
  return useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const response = await query("/offers");
      return response;
    },
  });
};

const useFetchCompanyApplications = (companyId: string) => {
  return useQuery({
    queryKey: ["admin-company-applications", companyId],
    queryFn: async () => {
      const response = await query(`/a/company/${companyId}`);
      return response;
    },
    enabled: !!companyId,
  });
};

const useFetchAllStudents = () => {
  return useQuery({
    queryKey: ["admin-all-students"],
    queryFn: async () => {
      const response = await query("/s");
      return response;
    },
  });
};

const useFetchAdminProfile = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await query("/admin/profile");
      return response;
    },
  });
};

const useFetchAllApplications = () => {
  return useQuery({
    queryKey: ["admin-all-applications"],
    queryFn: async () => {
      const response = await query("/a/all");
      return response;
    },
  });
};

const useFetchCompanyDocuments = (companyId: string) => {
  return useQuery({
    queryKey: ["admin-company-documents", companyId],
    queryFn: async () => {
      const response = await query(`/c/documents/${companyId}`);
      return response;
    },
    enabled: !!companyId,
  });
};

const useFetchStudentStats = () => {
  return useQuery({
    queryKey: ["admin-student-stats"],
    queryFn: async () => {
      const response = await query("/admin/students/stats");
      return response;
    },
  });
};

const useFetchAllCorps = () => {
  return useQuery({
    queryKey: ["admin-all-corps"],
    queryFn: async () => {
      const response = await query("/admin/corps");
      return response;
    },
  });
};

const useFetchAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await query("/admin/stats");
      return response;
    },
  });
};

const useFetchPendingApprovals = () => {
  return useQuery({
    queryKey: ["admin-pending-approvals"],
    queryFn: async () => {
      const response = await query("/admin/pending");
      return response as { students: any[]; corps: any[] };
    },
  });
};

const useFetchAdminSearch = (q: string) => {
  return useQuery({
    queryKey: ["admin-search", q],
    queryFn: async () => {
      const response = await query(`/admin/search?q=${encodeURIComponent(q)}`);
      return response as { students: any[]; corps: any[]; companies: any[]; opportunities: any[] };
    },
    enabled: q.trim().length >= 2,
  });
};

const useFetchAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await query("/admin/analytics");
      return response;
    },
  });
};

const useFetchAuditLog = (page = 1) => {
  return useQuery({
    queryKey: ["admin-audit-log", page],
    queryFn: async () => {
      const response = await query(`/admin/audit-log?page=${page}&limit=20`);
      return response;
    },
  });
};

const useFetchFlaggedOpportunities = () => {
  return useQuery({
    queryKey: ["admin-flagged-opportunities"],
    queryFn: async () => {
      const response = await query("/admin/opportunities/flagged");
      return response;
    },
  });
};

const useFetchAdminPPA = (params?: { state?: string; status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["admin-ppa", params],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.state) search.set("state", params.state);
      if (params?.status) search.set("status", params.status);
      if (params?.page) search.set("page", String(params.page));
      if (params?.limit) search.set("limit", String(params.limit));
      const response = await query(`/admin/ppa?${search.toString()}`);
      return response;
    },
  });
};

const useFetchAdminPPAStats = () => {
  return useQuery({
    queryKey: ["admin-ppa-stats"],
    queryFn: async () => {
      const response = await query("/admin/ppa/stats");
      return response as { total: number; active: number; closed: number; paused: number };
    },
  });
};

const useFetchAdminCorpsApplications = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["admin-corps-applications", params],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.status) search.set("status", params.status);
      if (params?.page) search.set("page", String(params.page));
      if (params?.limit) search.set("limit", String(params.limit));
      const response = await query(`/admin/corps/applications?${search.toString()}`);
      return response;
    },
  });
};

const useFetchAllUsers = (page = 1, limit = 30) => {
  return useQuery({
    queryKey: ["admin-all-users", page, limit],
    queryFn: async () => {
      const response = await query(`/admin/users?page=${page}&limit=${limit}`);
      return response as { data: any[]; total: number; page: number; limit: number };
    },
  });
};

export {
  useFetchAllUsers,
  useFetchCompanies,
  useFetchAllStudents,
  useFetchStudentStats,
  useFetchAdminProfile,
  useFetchAllApplications,
  useFetchCompanyApplications,
  useFetchOffers,
  useFetchAdmins,
  useFetchCompanyDocuments,
  useFetchAllCorps,
  useFetchAdminStats,
  useFetchPendingApprovals,
  useFetchAdminSearch,
  useFetchAdminAnalytics,
  useFetchAuditLog,
  useFetchFlaggedOpportunities,
  useFetchAdminPPA,
  useFetchAdminPPAStats,
  useFetchAdminCorpsApplications,
};
