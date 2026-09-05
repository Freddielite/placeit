import * as z from "zod";

export const adminSigninSchema = z.object({
  //   username: z.string().min(1, "Username or email is required"),
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export type AdminSigninInput = z.infer<typeof adminSigninSchema>;
