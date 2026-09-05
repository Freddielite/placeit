import * as z from "zod";

export const industries = [
  "tech",
  "education",
  "manufacturing",
  "health",
  "engineering",
  "other",
] as const;

export const studyFields = [
  "agriculture & related technology",
  "engineering and technology",
  "environmental science",
  "education",
  "medical science",
  "sciences",
  "management",
  "social sciences",
  "hospitality",
  "communications",
  "art",
  "other",
] as const;

export const onboardingSchema = z.object({
  // Company info
  companyName: z.string().min(2, "Company name is required"),
  address: z.string().min(1, "Office Address is required"),
  industry: z.string().min(1, "Industry is required"),
  industryOther: z.string().optional(),
  acceptingStudents: z.enum(["Yes", "No", "Soon"]),

  // Internship / Opportunity info
  internshipTitle: z.string().min(1, "Internship title is required"),
  stipend: z.enum(["stipend provided", "unpaid", "depends"]),
  duration: z.string().min(0, "Duration must be a positive number"),
  location: z.string().optional(), // default to "Remote" if missing
  // .min(1, "Porvide a location")
  // type: z.enum(["INTERNSHIP", "JOB"]),
  mode: z.enum(["remote", "onsite", "hybrid", "flexible"]).optional(),
  preferredFieldsOfStudy: z
    .array(z.enum(studyFields))
    .min(1, "At least one field of study must be selected"),

  // Contact person info
  contact: z.object({
    name: z.string().min(2, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    position: z.string().optional(),
  }),
});

export const forStudentsSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  school: z.string().min(2, "School is required"),
  courseOfStudy: z.string().min(2, "Course of study is required"),
  matriculationNumber: z.string().min(2, "Matriculation number is required"),
  preferredLocation: z.enum([
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  ], { error: "Please select a preferred IT location" }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type ForStudentsData = z.infer<typeof forStudentsSchema>;
