import {
  OpportunityMode,
  OpportunityStatus,
  OpportunityType,
} from "@/types/enums";
import * as z from "zod";

const modeValues = Object.values(OpportunityMode) as string[];
const statusValues = Object.values(OpportunityStatus) as string[];
const typeValues = Object.values(OpportunityType) as string[];

export const signinSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const companyIdSchema = z.object({
  companyId: z.string(),
});

export const companyStatusSchema = z.object({
  companyId: z.string(),
  status: z.enum([
    "pending",
    "under_review",
    "approved",
    "rejected",
    "suspended",
  ]),
});

export const reviewDocumentSchema = z.object({
  companyId: z.string(),
  documentType: z.string(),
  reviewStatus: z.enum(["approved", "rejected"]),
});

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  school: z.string().min(1),
  matriculation: z.string().min(1),
});

export const resetPasswordSchema = z
  .object({
    npassword: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string().optional(),
  })
  .refine((data) => data.npassword === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"], // 👈 attach error to confirm field
  });

export const acceptSchema = z.object({
  id: z.string(),
});

export const verifyStudentIdentitySchema = z.object({
  matNo: z
    .string()
    .min(1, "Please provide school matric or registration number"),
  school: z.string().min(1),
});

export const studentSignupSchema = z
  .object({
    email: z.email(),
    phone: z.string().min(10, "Phone number is too short"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const companySignupSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  cacNumber: z
    .string()
    .min(1, "CAC number is required")
    .regex(/^(RC|BN)\s?\d{4,}$/i, "Enter a valid CAC number (e.g. RC 1210548 or BN 373466)"),
  claimToken: z.string().optional(),
});

export const companyProfileSchema = z.object({
  website: z.union([z.literal(""), z.url()]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  foundedYear: z.union([z.literal(""), z.string().regex(/^\d{4}$/, "Enter a valid year")]).optional(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional(),
  registrationNumber: z.union([z.literal(""), z.string().min(3, "RC number must be at least 3 characters")]).optional(),
  logoImage: z.instanceof(File).optional(),
  bannerImage: z.instanceof(File).optional(),
  cacDocument: z.instanceof(File).optional(),
  proofOfAddress: z.instanceof(File).optional(),
});

export const corpsSignupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CorpsSignupInput = z.infer<typeof corpsSignupSchema>;

export const opportunityFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.array(z.string()).min(1, "Department is required"),
  location: z.string().min(2, "Location is required"),
  mode: z.enum(modeValues),
  type: z.enum(typeValues),
  status: z.enum(statusValues),
  duration: z.number().int().positive(), // Remove z.coerce
  description: z.string().min(10, "Description must be at least 10 characters"),
  maxApplicants: z.number().optional(),
  applicationDeadline: z.string().optional(),
  autoCloseOnDeadline: z.boolean().optional(),
  preferredFieldsOfStudy: z.array(z.string()).optional(),
  programType: z.enum(["siwes", "ppa"], { error: "Please select a program type" }),
  // skills: z.string().optional(),
});

export const updateOpportunitySchema = opportunityFormSchema.extend({
  id: z.string().min(1, "Opportunity ID is required"),
});
