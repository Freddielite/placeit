"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosInstance } from "axios";
import { env } from "@/utils";

const API_BASE_URL = env().apiBaseUrl;

if (!API_BASE_URL) throw new Error("Missing API base URL (apiBaseUrl).");

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = (await cookies()).get("session-token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["G-PlaceIT-build"] = process.env.NEXT_PUBLIC_BUILD_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response?.data;
    const status = error.response?.status;
    const message =
      response?.message || error?.message || "An unexpected error occurred.";

    console.error("API Error:", { ...response });

    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (status === 401 && !isAuthEndpoint) {
      redirect("/signin");
    }

    const err = new Error(message);
    (err as any).data = response;
    (err as any).status = status;
    return Promise.reject(err);
  },
);
export async function api<T = any>(
  url: string,
  { method = "GET", data, headers, ...options }: any = {},
): Promise<T> {
  try {
    const requestUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const response = await axiosInstance.request<T>({
      url: requestUrl,
      method,
      data,
      headers,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw error; // Ensure the error is propagated back to the frontend
  }
}

// ✅ Mutate helper with your desired signature
export async function mutate<T = any>(
  url: string,
  data?: any,
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST",
): Promise<T> {
  return await api<T>(url, { method, data });
}

// ✅ Query helper (GET by default)
export async function query<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  return await api<T>(url, { method: "GET", ...options });
}
