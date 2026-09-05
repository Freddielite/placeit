import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";

import {
  acceptSchema,
  companyProfileSchema,
  onBoardCompanySchema,
  opportunityFormSchema,
  updateOpportunitySchema,
} from "@/schemas";
import { onboardingSchema } from "@/schemas/site.schema";
import * as z from "zod";

export const updateCompanyBanner = actionClient
  .inputSchema(
    z.object({
      banner: z.instanceof(File),
    }),
  )
  .action(async ({ parsedInput: { banner } }) => {
    const formData = new FormData();
    if (banner) {
      formData.append("banner", banner);
    }
    const response = await mutate("/c/profile/banner", formData, "PATCH");
    return response;
  });

export const updateCompanyLogo = actionClient
  .inputSchema(
    z.object({
      logo: z.instanceof(File),
    }),
  )
  .action(async ({ parsedInput: { logo } }) => {
    const formData = new FormData();
    if (logo) {
      formData.append("logo", logo);
    }
    const response = await mutate("/c/profile/logo ", formData, "PATCH");
    return response;
  });

/* -------------------------- Profile Actions -------------------------- */
export const updateCompanyProfile = actionClient
  .inputSchema(companyProfileSchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();

    if (parsedInput.logoImage) {
      formData.append("logo", parsedInput.logoImage);
    }

    if (parsedInput.bannerImage) {
      formData.append("banner", parsedInput.bannerImage);
    }

    if (parsedInput.website) {
      formData.append("website", parsedInput.website);
    }
    if (parsedInput.address) {
      formData.append("address", parsedInput.address);
    }

    if (parsedInput.description) {
      formData.append("description", parsedInput.description);
    }

    if (parsedInput.phone) {
      formData.append("phone", parsedInput.phone);
    }

    if (parsedInput.industry) {
      formData.append("industry", parsedInput.industry);
    }

    if (parsedInput.city) {
      formData.append("city", parsedInput.city);
    }

    if (parsedInput.state) {
      formData.append("state", parsedInput.state);
    }

    if (parsedInput.foundedYear) {
      formData.append("foundedYear", parsedInput.foundedYear);
    }

    if (parsedInput.companySize) {
      formData.append("companySize", parsedInput.companySize);
    }

    if (parsedInput.registrationNumber) {
      formData.append("registrationNumber", parsedInput.registrationNumber);
    }

    if (parsedInput.cacDocument) {
      formData.append("cacDocument", parsedInput.cacDocument);
    }

    if (parsedInput.proofOfAddress) {
      formData.append("proofOfAddress", parsedInput.proofOfAddress);
    }

    try {
      const response = await mutate("/c/profile/update", formData, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

/* -------------------------- Opportunity / Job Actions -------------------------- */
const createOpportunity = actionClient
  .inputSchema(opportunityFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await mutate("/o", parsedInput);
      return response.data;
    } catch (error) {
      throw error;
    }
  });

export const closeOpportunity = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/o/${id}/`, { status: "closed" }, "PATCH");
      return response.data;
    } catch (error) {
      throw error;
    }
  });

export const updateOpportunity = actionClient
  .inputSchema(updateOpportunitySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...updateData } = parsedInput;
    try {
      const response = await mutate(`/o/${id}`, updateData, "PATCH");
      return response.data;
    } catch (error) {
      throw error;
    }
  });

export const fetchCompanyJobs = actionClient.action(async () => {
  try {
    const response = await query("/c/jobs/all");
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
});

/* -------------------------- Application Actions -------------------------- */
export const fetchAllCompanyApplications = actionClient.action(async () => {
  try {
    const response = await query("/c/all/category");
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
});

export const deleteOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/offers/${id}/`, undefined, "DELETE");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const createOffer = actionClient
  .inputSchema(
    z.object({
      id: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      file: z.any().optional(),
      stipend: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const formData = new FormData();
    if (parsedInput.startDate) {
      formData.append("startDate", parsedInput.startDate);
    }

    if (parsedInput.endDate) {
      formData.append("endDate", parsedInput.endDate);
    }
    if (parsedInput.stipend) {
      formData.append("stipend", parsedInput.stipend);
    }
    if (parsedInput.file) {
      formData.append("letter", parsedInput.file);
    }

    try {
      const response = await mutate(
        `/offers/${parsedInput.id}/create-offer/`,
        formData,
        "POST",
      );
      return response;
    } catch (error) {
      throw error;
    }
  });

export const acceptApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/a/${id}/accept/`, undefined, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const declineApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/a/${id}/reject/`, undefined, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const bookmarkApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/c/applicants/accept/`, id, "PATCH");
    return response;
  });

export const shortlistApplicant = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/a/${id}/shortlist`, undefined, "PATCH");
    return response;
  });

export const onBoardCompany = actionClient
  .inputSchema(onBoardCompanySchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();
    Object.entries(parsedInput).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await mutate("/c/onboarding", formData, "POST");
    return response;
  });

export const quickCreateCompany = actionClient
  .inputSchema(onboardingSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate("/c/quick-create", parsedInput, "POST");
    return response.data;
  });

export { createOpportunity };
