"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/components/providers/theme-provider";

// react-toastify defaults to a light toast, which is blinding over a dark
// screen. Thin wrapper so layout.tsx can stay a server component.
export function ThemedToastContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      theme={theme}
    />
  );
}
