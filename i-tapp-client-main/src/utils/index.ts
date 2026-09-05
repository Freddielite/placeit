import { Env } from "@/types";

export const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value ?? defaultValue ?? "";
};

export const env = (defaultValue?: string): Env => {
  return {
    appEnv: getEnv("NEXT_PUBLIC_APP_ENV", defaultValue),
    appName: getEnv("NEXT_PUBLIC_APP_NAME", defaultValue),
    apiBaseUrl: getEnv("NEXT_PUBLIC_APP_BACKEND_API_URL"),
    frontendUrl: getEnv("NEXT_PUBLIC_APP_SITE_URL", defaultValue),
  };
};

export function prepareUrlSearchParams(params?: {
  [key: string]: string;
}): string {
  return new URLSearchParams(params).toString();
}
