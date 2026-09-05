"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Simple, robust fade+scale crossfade on every route change - same
// animation regardless of navigation direction. No popstate listening, no
// history-stack tracking, no back/forward detection - that logic kept
// producing edge cases. This is a smaller surface: one animation, always
// correct, still reads as "app" rather than "web page swap" (this pattern
// is what Android's own default activity transitions use).
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
