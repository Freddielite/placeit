"use server";

import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  companySignupSchema,
  corpsSignupSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "@/schemas";

import { setAuthCookies } from "@/utils/cookies";
import * as z from "zod";

export const signin = actionClient
  .inputSchema(signinSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const response = await mutate("/auth/signin", { email, password });
    const payload = response?.data ?? response;
    const { user, token, profile } = payload;
    await setAuthCookies(token, user.role);
    return { user, token, profile };
  });

export const signinStudent = signin;

export const signinCompany = signin;

export const signinAdmin = signin;

export const studentSignup = actionClient
  .inputSchema(signupSchema)
  .action(
    async ({
      parsedInput: {
        email,
        firstName,
        lastName,
        password,
        matriculation,
        school,
      },
    }) => {
      const response = await mutate("/auth/signup/student", {
        firstName,
        lastName,
        email,
        password,
        matriculationNumber: matriculation,
        school,
      });
    },
  );

export const claimAccount = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { npassword, token, cpassword } }) => {
    const response = await mutate(`/admin/claim?token=${token}`, {
      password: cpassword,
    });
    return response;
  });

export const requestPasswordReset = actionClient
  .inputSchema(
    z.object({
      email: z.email("Please enter a valid email address"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/auth/password-reset/request", {
      email,
    });
    return response;
  });

export const verifyEmail = actionClient
  .inputSchema(
    z.object({
      token: z.string().min(1, "Token is required"),
    }),
  )
  .action(async ({ parsedInput: { token } }) => {
    const response = await query(`/auth/verify?token=${token}`);
    return response;
  });

export const resendEmailVerification = actionClient
  .inputSchema(
    z.object({
      email: z.string().min(1, "Email is required"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/auth/resend-verification", { email });
    return response;
  });

export const changePassword = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { npassword, token } }) => {
    const response = await mutate(
      `/auth/password-reset/confirm?token=${encodeURIComponent(token!)}`,
      {
        password: npassword,
      },
    );
    return response;
  });

export const companySignup = actionClient
  .inputSchema(companySignupSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate("/auth/signup/company", parsedInput);
    return response;
  });

export const signinCorps = signin;

export const claimListings = actionClient
  .inputSchema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: { token } }) => {
    const response = await mutate(`/auth/claim-listings?token=${token}`, {});
    return response;
  });

export const corpsSignup = actionClient
  .inputSchema(corpsSignupSchema)
  .action(
    async ({
      parsedInput: { email, password, firstName, lastName, phone },
    }) => {
      const response = await mutate("/auth/signup/corps", {
        email,
        password,
        firstName,
        lastName,
        phone,
      });
      return response;
    },
  );
