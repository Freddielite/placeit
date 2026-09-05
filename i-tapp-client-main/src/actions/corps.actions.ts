"use server";

import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import * as z from "zod";

export const applyToPPA = actionClient
  .inputSchema(z.object({
    id: z.string().min(1),
    coverLetter: z.string().optional(),
    resumeUrl: z.string().optional(),
  }))
  .action(async ({ parsedInput: { id, coverLetter, resumeUrl } }) => {
    const response = await mutate(`/corps/ppa/${id}/apply`, { coverLetter, resumeUrl }, "POST");
    return response;
  });

export const initializeCorpsPayment = actionClient
  .inputSchema(z.object({
    opportunityId: z.string(),
    coverLetter: z.string().optional(),
    resumeUrl: z.string().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const response = await mutate("/payments/initialize/corps", parsedInput, "POST");
    return response as { authorizationUrl: string; reference: string };
  });

export const withdrawPPAApplication = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/corps/ppa/${id}/withdraw`, undefined, "PATCH");
    return response;
  });

export const saveCorpsPPA = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/corps/ppa/${id}/save`, undefined, "POST");
    return response;
  });

export const acceptCorpsOffer = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/corps/offers/${id}/accept`, undefined, "PATCH");
    return response;
  });

export const declineCorpsOffer = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    const response = await mutate(`/corps/offers/${id}/decline`, undefined, "PATCH");
    return response;
  });
