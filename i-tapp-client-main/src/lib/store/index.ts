import { create } from "zustand";

interface CommonState {
  theme: "light" | "dark";
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userType: "student" | "company" | null;
  setTheme: (theme: "light" | "dark") => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  setAuth: (auth: {
    isAuthenticated: boolean;
    userType: "student" | "company" | null;
  }) => void;
}

export const useCommonStore = create<CommonState>((set) => ({
  theme: "light",
  loading: false,
  error: null,
  isAuthenticated: false,
  userType: null,
  setTheme: (theme) => set({ theme }),
  setLoading: (value) => set({ loading: value }),
  setError: (message) => set({ error: message }),
  setAuth: (auth) => set(auth),
}));

export * from "./company/index";
export * from "./student/index";
// export * from './admin/index';
