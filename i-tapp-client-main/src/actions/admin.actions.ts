// import { createCompanySchema } from "@/app/(superuser)/(admin)/admin/company/new";
import { createCompanySchema } from "@/schemas/company.schema";
import { createStudentSchema } from "@/app/(superuser)/(admin)/admin/student/new";
import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  companyIdSchema,
  companyStatusSchema,
  reviewDocumentSchema,
} from "@/schemas";

import * as z from "zod";

export const approveCompany = actionClient
  .inputSchema(companyIdSchema)
  .action(async ({ parsedInput: { companyId } }) => {
    const response = await mutate(`/admin/company/approve`, { companyId });
    return { success: true, data: response };
  });

export const declineCompany = actionClient
  .inputSchema(companyIdSchema)
  .action(async ({ parsedInput: { companyId } }) => {
    const response = await mutate(`/admin/company/decline`, { companyId });
    return { success: true, data: response };
  });

export const updateCompanyStatus = actionClient
  .inputSchema(companyStatusSchema)
  .action(async ({ parsedInput: { companyId, status } }) => {
    const response = await mutate(
      `/c/${companyId}/status`,
      {
        companyId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const reviewCompanyDocuments = actionClient
  .inputSchema(reviewDocumentSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(
      `/c/documents/review/${parsedInput.companyId}`,
      parsedInput,
      "PATCH",
    );
    return { success: true, data: response };
  });

export const createStudent = actionClient
  .inputSchema(createStudentSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(`/admin/create-student`, parsedInput);
    return { success: true, data: response };
  });

export const inviteCompany = actionClient
  .inputSchema(createCompanySchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(`/admin/invite-company`, parsedInput);
    return { success: true, data: response };
  });

export const approveStudent = actionClient
  .inputSchema(z.object({ studentId: z.string().min(1) }))
  .action(async ({ parsedInput: { studentId } }) => {
    const response = await mutate(`/admin/students/${studentId}/approve`, {}, "PATCH");
    return { success: true, data: response };
  });

export const rejectStudent = actionClient
  .inputSchema(z.object({ studentId: z.string().min(1), reason: z.string().optional() }))
  .action(async ({ parsedInput: { studentId, reason } }) => {
    const response = await mutate(`/admin/students/${studentId}/reject`, reason ? { reason } : {}, "PATCH");
    return { success: true, data: response };
  });

export const updateStudentStatus = actionClient
  .inputSchema(
    z.object({
      studentId: z.string().min(1, "Student ID is required"),
      status: z.enum(["approved", "rejected", "suspended"]),
    }),
  )
  .action(async ({ parsedInput: { studentId, status } }) => {
    const response = await mutate(
      `/s/${studentId}/status`,
      {
        studentId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const updateOpportunityStatus = actionClient
  .inputSchema(
    z.object({
      opportunityId: z.string().min(1, "Opportunity ID is required"),
      status: z.enum(["open", "closed", "flagged"]),
    }),
  )
  .action(async ({ parsedInput: { opportunityId, status } }) => {
    const response = await mutate(
      `/o/${opportunityId}/admin/status`,
      {
        opportunityId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const createAdmin = actionClient
  .inputSchema(
    z.object({
      username: z.string().min(1, "Username is required"),
      email: z.email("Invalid email address"),
      role: z.enum(["superadmin", "admin", "moderator", "support"]),
    }),
  )
  .action(async ({ parsedInput: { username, email, role } }) => {
    const response = await mutate(`/admin/`, {
      email,
      username,
      role,
    });
    return { success: true, data: response };
  });

export const updateAdminRole = actionClient
  .inputSchema(
    z.object({
      adminId: z.string().min(1, "Admin ID is required"),
      role: z.enum(["superadmin", "admin", "moderator", "support"]),
    }),
  )
  .action(async ({ parsedInput: { adminId, role } }) => {
    const response = await mutate(
      `/admin/role/${adminId}`,
      {
        role,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const resendActivation = actionClient
  .inputSchema(z.object({ email: z.email("Invalid email") }))
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/admin/activation/resend", { email });
    return { success: true, data: response };
  });

export const resendCompanyInvite = actionClient
  .inputSchema(
    z.object({
      email: z.email("Invalid email address"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate(`/admin/invite-company/resend`, {
      email,
    });
    return { success: true, data: response };
  });

export const softDelete = actionClient
  .inputSchema(z.object({ id: z.string().min(1, "UserID is required") }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/admin/${id}`, {}, "DELETE");
    return { success: true, data: response };
  });

export const purge = actionClient
  .inputSchema(z.object({ id: z.string().min(1, "UserID is required") }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/admin/${id}/purge`, {}, "DELETE");
    return { success: true, data: response };
  });

export const restoreRecord = actionClient
  .inputSchema(z.object({
    id: z.string().min(1),
    category: z.enum(["students", "companies", "opportunities", "applications"]),
  }))
  .action(async ({ parsedInput: { id, category } }) => {
    const response = await mutate(`/admin/deleted/${category}/${id}/restore`, {}, "PATCH");
    return { success: true, data: response };
  });

export const purgeRecord = actionClient
  .inputSchema(z.object({
    id: z.string().min(1),
    category: z.enum(["students", "companies", "opportunities", "applications"]),
  }))
  .action(async ({ parsedInput: { id, category } }) => {
    const response = await mutate(`/admin/deleted/${category}/${id}`, {}, "DELETE");
    return { success: true, data: response };
  });

export const bulkApprove = actionClient
  .inputSchema(z.object({
    type: z.enum(["student", "corps"]),
    ids: z.array(z.string().min(1)).min(1),
  }))
  .action(async ({ parsedInput: { type, ids } }) => {
    const response = await mutate("/admin/bulk/approve", { type, ids }, "POST");
    return { success: true, data: response };
  });

export const bulkReject = actionClient
  .inputSchema(z.object({
    type: z.enum(["student", "corps"]),
    ids: z.array(z.string().min(1)).min(1),
    reason: z.string().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const response = await mutate("/admin/bulk/reject", parsedInput, "POST");
    return { success: true, data: response };
  });

export const updatePPAStatus = actionClient
  .inputSchema(z.object({
    ppaId: z.string().min(1),
    status: z.enum(["active", "inactive", "closed"]),
  }))
  .action(async ({ parsedInput: { ppaId, status } }) => {
    const response = await mutate(`/admin/ppa/${ppaId}/status`, { status }, "PATCH");
    return { success: true, data: response };
  });

export const createPPAListing = actionClient
  .inputSchema(z.object({
    title: z.string().min(2, "Title is required"),
    organisationName: z.string().min(1, "Organisation name is required"),
    sector: z.string().min(1, "Sector is required"),
    state: z.string().min(1, "State is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(10, "Description is required"),
    duration: z.number().int().positive("Duration must be positive"),
    maxApplicants: z.number().optional(),
    applicationDeadline: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const response = await mutate("/admin/ppa", {
      ...parsedInput,
      programType: "ppa",
      applicationDeadline: parsedInput.applicationDeadline
        ? new Date(parsedInput.applicationDeadline).toISOString()
        : undefined,
    });
    return { success: true, data: response };
  });

export const approveCorps = actionClient
  .inputSchema(z.object({ corpsId: z.string().min(1) }))
  .action(async ({ parsedInput: { corpsId } }) => {
    const response = await mutate(`/admin/corps/${corpsId}/approve`, {}, "PATCH");
    return { success: true, data: response };
  });

export const rejectCorps = actionClient
  .inputSchema(z.object({ corpsId: z.string().min(1), reason: z.string().optional() }))
  .action(async ({ parsedInput: { corpsId, reason } }) => {
    const response = await mutate(`/admin/corps/${corpsId}/reject`, reason ? { reason } : {}, "PATCH");
    return { success: true, data: response };
  });

export const sendSystemEmail = actionClient
  .inputSchema(
    z.object({
      subject: z.string().min(1, "Subject is required"),
      body: z.string().min(1, "Body is required"),
      recipients: z.array(
        z.object({
          email: z.string().email(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
        }),
      ).min(1, "At least one recipient required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const response = await mutate(`/admin/email/send`, parsedInput);
    return { success: true, data: response };
  });

export const toggleUserActive = actionClient
  .inputSchema(z.object({ userId: z.string().min(1), isActive: z.boolean() }))
  .action(async ({ parsedInput: { userId, isActive } }) => {
    const response = await mutate(`/admin/users/${userId}/active`, { isActive }, "PATCH");
    return { success: true, data: response };
  });

// export const logout = actionClient.schema(logoutSchema).action(async ({}) => {
//   (await cookies()).set("token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     expires: new Date(0),
//     path: "/",
//   });

//   return {};
// });
