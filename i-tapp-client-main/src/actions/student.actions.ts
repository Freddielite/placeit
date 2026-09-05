import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  corpsOnboardingSchema,
  studentOnboardingSchema,
  verifyStudentIdentitySchema,
} from "@/schemas";
import * as z from "zod";

const applyJ = z.object({
  id: z.string(),
});

export const acceptOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/offers/${id}/accept/`,
        undefined,
        "PATCH",
      );
      return response;
    } catch (error) {
      throw error;
    }
  });

export const declineOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/offers/${id}/decline/`,
        undefined,
        "PATCH",
      );
      return response;
    } catch (error) {
      throw error;
    }
  });

export const apply = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/a/${id}/apply`);
    return response;
  });

export const initializePayment = actionClient
  .inputSchema(
    z.object({
      opportunityId: z.string(),
      coverLetter: z.string().optional(),
      resumeUrl: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const response = await mutate("/payments/initialize", parsedInput, "POST");
    return response as { authorizationUrl: string; reference: string };
  });

export const withdraw = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/a/${id}/withdraw`, undefined, "PATCH");
      return response?.data;
    } catch (error) {
      throw error;
    }
  });

export const save = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/o/${id}/saved`, undefined);
      return response;
    } catch (error) {
      throw error;
    }
  });

export const StudentProfileSchema = z.object({
  phone: z.string().optional(),
  bio: z.string().optional(),
  // gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  techSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  preferredIndustry: z.string().optional(),
});

export const updateStudentProfile = actionClient

  .inputSchema(StudentProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await mutate("/s/profile", parsedInput, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const updateStudentProfilePicture = actionClient
  .inputSchema(
    z.object({
      profileImage: z.instanceof(File),
    }),
  )
  .action(async ({ parsedInput: { profileImage } }) => {
    const formData = new FormData();

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await mutate("/s/profile-picture", formData, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const verifyStudentIdentity = actionClient
  .inputSchema(verifyStudentIdentitySchema)
  .action(async ({ parsedInput: { matNo } }) => {
    const response = await query(`/s/matric/${encodeURIComponent(matNo)}`, {
    });
    return response;
  });

function appendToFormData(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    fd.append(key, value, value.name);
    return;
  }

  if (value instanceof Blob) {
    fd.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    fd.append(key, JSON.stringify(value));
    return;
  }

  if (typeof value === "object") {
    fd.append(key, JSON.stringify(value));
    return;
  }
  fd.append(key, String(value));
}

export const onBoardStudent = actionClient
  .inputSchema(studentOnboardingSchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(parsedInput)) {
      appendToFormData(formData, key, value);
    }

    const response = await mutate("/s/onboarding", formData, "POST");
    return response;
  });

export const onBoardCorps = actionClient
  .inputSchema(corpsOnboardingSchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(parsedInput)) {
      appendToFormData(formData, key, value);
    }
    const response = await mutate("/corps/onboarding", formData, "POST");
    return response;
  });

export const updateCorpsProfile = actionClient
  .inputSchema(StudentProfileSchema.extend({
    stateOfDeployment: z.string().optional(),
    stateCode: z.string().optional(),
    nyscRegNumber: z.string().optional(),
    batchYear: z.string().optional(),
    stream: z.enum(["A", "B"]).optional(),
    degreeType: z.string().optional(),
    school: z.string().optional(),
    graduationYear: z.string().optional(),
    gpa: z.string().optional(),
    gender: z.string().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const response = await mutate("/corps/profile", parsedInput, "PATCH");
    return response;
  });

export const markNotificationRead = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/notifications/${id}/read`, {}, "PATCH");
    return response;
  });

export const markAllNotificationsRead = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    const response = await mutate("/notifications/read-all", {}, "PATCH");
    return response;
  });

export const deleteNotification = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/notifications/${id}`, {}, "DELETE");
    return response;
  });
