import * as z from "zod";
import { fileSchema } from "./company.schema";
import { StudentProfileSchema } from "@/actions";

export const documentStepSchema = z.object({
  itLetter: fileSchema,
  cv: fileSchema.optional(),
});

export const corpsDocumentStepSchema = z.object({
  callUpLetter: fileSchema,
  cv: fileSchema.optional(),
  relocationLetter: fileSchema.optional(),
});

export const corpsPersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is too short"),
  gender: z.enum(["male", "female", "other"], { message: "Select a gender" }),
  location: z.string().min(1, "Location is required"),
});

export const corpsInfoSchema = z.object({
  stateOfDeployment: z.string().min(1, "State of deployment is required"),
  stateCode: z.string().optional(),
  nyscRegNumber: z.string().min(1, "NYSC registration number is required"),
  batchYear: z.string().min(4, "Batch year is required"),
  stream: z.enum(["stream_i", "stream_ii"], { message: "Select a stream" }),
  courseOfStudy: z.string().min(1, "Course of study is required"),
  degreeType: z.enum(["OND", "HND", "BSC", "BTECH", "BEng", "BA", "MSC", "PGDIP"], { message: "Select degree type" }),
  school: z.string().min(1, "School name is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  gpa: z.string().optional(),
});

export const corpsSkillsSchema = z.object({
  techSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  preferredIndustry: z.array(z.string()).min(1, "Select at least one industry"),
  internshipDuration: z.string().min(1, "Duration is required"),
  availableStartDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date format",
  }),
});

export const corpsOnboardingSchema = corpsPersonalInfoSchema
  .extend(corpsInfoSchema.shape)
  .extend(corpsSkillsSchema.shape)
  .extend(corpsDocumentStepSchema.shape);

export type CorpsDocumentSchema = z.infer<typeof corpsDocumentStepSchema>;
export type CorpsPersonalInfoSchema = z.infer<typeof corpsPersonalInfoSchema>;
export type CorpsInfoSchema = z.infer<typeof corpsInfoSchema>;
export type CorpsSkillsSchema = z.infer<typeof corpsSkillsSchema>;
export type CorpsOnboardingSchema = z.infer<typeof corpsOnboardingSchema>;

export const schoolInfoSchema = z.object({
  school: z.string().min(1, "School name is required"),
  courseOfStudy: z.string().min(1, "Field of study is required"),
  level: z.string().min(1, "Level is required"),
  gpa: z.string().min(1, "CGPA is required"),
  degreeType: z.enum(["OND", "BSC", "MSC"], "Select a valid degree type"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  phone: z.string().min(10, "Phone number is too short"),
});

export const preferencesSchema = z.object({
  preferredWorkMode: z.enum(["remote", "onsite", "hybrid"]),
  internshipDuration: z.enum(["1-3 months", "3-6 months", "6+ months"]),
  preferredIndustry: z
    .array(z.string())
    .min(1, "Select at least one area of interest"),
  availableStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const studentOnboardingSchema = schoolInfoSchema
  .extend(preferencesSchema.shape)
  .extend(documentStepSchema.shape);

export type DocumentSchema = z.infer<typeof documentStepSchema>;
export type PreferencesSchema = z.infer<typeof preferencesSchema>;
export type SchoolInfoSchema = z.infer<typeof schoolInfoSchema>;
export type StudentProfileFormData = z.infer<typeof StudentProfileSchema>;
