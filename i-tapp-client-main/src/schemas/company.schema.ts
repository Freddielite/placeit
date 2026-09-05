// import * as z from "zod";
// import { companyProfileSchema, opportunityFormSchema } from "./auth.schema";

// export const offerSchema = z.object({
//   startDate: z.string().min(1, "Start date is required"),
//   endDate: z.string().optional(),
//   stipend: z.string().optional(),
//   offerLetter: z
//     .custom<File>((v) => v instanceof File, "File is required")
//     .refine((file) => file.size <= 10 * 1024 * 1024, "Max file size is 10MB")
//     .refine(
//       (file) =>
//         ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
//           file.type,
//         ),
//       "Only PDF, JPG, PNG, or WEBP allowed",
//     ),
// });

// export const profileFormSchema = z.object({
//   industry: z.string().min(1, "Industry is required"),

//   companySize: z.enum([
//     "1-10",
//     "11-50",
//     "51-200",
//     "201-500",
//     "501-1000",
//     "1000+",
//   ]),
//   foundedYear: z
//     .string()
//     .regex(/^\d{4}$/, "Enter a valid year")
//     .optional(),
//   website: z.url("Invalid URL").optional(),
//   phone: z.string().min(7, "Phone number is too short").optional(),
//   address: z.string().min(5, "Address is required"),
//   city: z.string().min(2, "City is required"),
//   state: z.string().min(2, "State is required"),
//   bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
// });

// // 10MB
// export const MAX_FILE_SIZE = 10 * 1024 * 1024;
// export const ACCEPTED_MIME_TYPES = [
//   "application/pdf",
//   "image/jpeg",
//   "image/png",
//   "image/webp",
// ];

// export const fileSchema = z
//   .custom<File>((v) => v instanceof File, "File is required")
//   .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB")
//   .refine(
//     (file) => ACCEPTED_MIME_TYPES.includes(file.type),
//     "Only PDF, JPG, PNG, or WEBP allowed",
//   );

// export const kycFormSchema = z.object({
//   // include this if you didn't collect it earlier or you want to confirm it
//   registrationNumber: z.string().min(3, "Registration number is required"),

//   // Confirm the address you already collected on Step 2, or allow editing here
//   // confirmAddress: z.boolean().refine((v) => v === true, {
//   //   message: "You must confirm the address matches your proof document",
//   // }),

//   // required documents
//   cacDocument: fileSchema,
//   proofOfAddress: fileSchema.optional(), // make optional if you want to collect later or it's not always required

//   // optional extras
//   repId: z
//     .custom<File | undefined>((v) => v === undefined || v instanceof File)
//     .refine(
//       (file) => !file || file.size <= MAX_FILE_SIZE,
//       "Max file size is 10MB",
//     )
//     .refine(
//       (file) => !file || ACCEPTED_MIME_TYPES.includes(file.type),
//       "Only PDF, JPG, PNG, or WEBP allowed",
//     )
//     .optional(),
// });

// export const onBoardCompanySchema = profileFormSchema.extend(
//   kycFormSchema.shape,
// );
// export type OfferFormData = z.infer<typeof offerSchema>;
// export type CompanyProfileFormSchema = z.infer<typeof profileFormSchema>;
// export type KycFormValues = z.infer<typeof kycFormSchema>;
// export type OnboardingData = z.infer<typeof onBoardCompanySchema>;
// export type OnboardingDraft = Partial<OnboardingData>;
// export type FormValues = z.infer<typeof opportunityFormSchema>;
// export type ProfileFormData = z.infer<typeof companyProfileSchema>;

import * as z from "zod";
import { companyProfileSchema, opportunityFormSchema } from "./auth.schema";
import { error } from "console";

// Added create company schema here
export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  email: z.email("Invalid email address"),
  industry: z
    .string()
    .min(1, "Industry is required")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
});

export const offerSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  stipend: z.string().optional(),
  offerLetter: z
    .custom<File>((v) => v instanceof File, "File is required")
    .refine((file) => file.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (file) =>
        ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Only PDF, JPG, PNG, or WEBP allowed",
    ),
});

export const profileFormSchema = z.object({
  industry: z
    .string({ error: "Industry is required" })
    .min(1, { error: "Industry is required" }),

  companySize: z
    .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .optional(),
  foundedYear: z
    .union([z.literal(""), z.string().regex(/^\d{4}$/, "Enter a valid year")])
    .optional(),
  website: z
    .union([
      z.literal(""),
      z.url({ message: "Must be a valid URL starting with http:// or https://" }),
    ])
    .optional(),
  phone: z.string().min(10, "Phone number is too short"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  description: z
    .string({ error: "Bio is required" })
    .min(1, "Bio is required")
    .max(500, "Bio must be at most 500 characters"),
});

// 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const fileSchema = z
  .custom<File>((v) => v instanceof File, "File is required")
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB")
  .refine(
    (file) => ACCEPTED_MIME_TYPES.includes(file.type),
    "Only PDF, JPG, PNG, or WEBP allowed",
  );

export const kycFormSchema = z.object({
  registrationNumber: z
    .union([z.literal(""), z.string().min(3, "Invalid registration number")])
    .optional(),
  cacDocument: fileSchema.optional(),
  proofOfAddress: fileSchema.optional(),
  repId: z
    .custom<File | undefined>((v) => v === undefined || v instanceof File)
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 10MB",
    )
    .refine(
      (file) => !file || ACCEPTED_MIME_TYPES.includes(file.type),
      "Only PDF, JPG, PNG, or WEBP allowed",
    )
    .optional(),
});

export const onBoardCompanySchema = profileFormSchema.extend(
  kycFormSchema.shape,
);

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type OfferFormData = z.infer<typeof offerSchema>;
export type CompanyProfileFormSchema = z.infer<typeof profileFormSchema>;
export type KycFormValues = z.infer<typeof kycFormSchema>;
export type OnboardingData = z.infer<typeof onBoardCompanySchema>;
export type OnboardingDraft = Partial<OnboardingData>;
export type FormValues = z.infer<typeof opportunityFormSchema>;
export type ProfileFormData = z.infer<typeof companyProfileSchema>;
