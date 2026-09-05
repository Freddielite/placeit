"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Wraps route content so navigating between pages feels like a native
// app screen transition instead of a browser page load.
//
// mode="popLayout" (not "wait"): the outgoing page is pulled out of
// document flow immediately and cross-fades while the new page enters at
// the same time - no dead gap where the screen looks stuck, and no
// double-height layout jump from both pages being in flow at once.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.01 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
