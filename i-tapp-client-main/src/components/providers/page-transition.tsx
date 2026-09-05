"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

// WhatsApp/iOS-style directional navigation:
// - Going deeper (forward): the new page slides in from the right, fully
//   covering the previous one. The previous page stays underneath,
//   shifting slightly left and dimming (parallax) rather than fully
//   leaving - this is the detail that makes it read as "app" instead of
//   "web page swap."
// - Going back: the exact reverse - the current page slides fully off to
//   the right, revealing the previous page sliding back in from its
//   dimmed, shifted-left position to normal.
//
// Direction is determined from our OWN tracked navigation stack, not the
// browser's popstate event. popstate timing can race with React's render
// cycle and misfire (this was the cause of "back" occasionally animating
// wrong or not at all) - comparing against a stack we maintain ourselves,
// synchronously, during render, is deterministic and has no such race.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const stackRef = useRef<string[]>([pathname]);
  const prevPathnameRef = useRef(pathname);
  const directionRef = useRef<"forward" | "back">("forward");

  if (pathname !== prevPathnameRef.current) {
    const stack = stackRef.current;
    const isBackToPrevious =
      stack.length >= 2 && stack[stack.length - 2] === pathname;

    if (isBackToPrevious) {
      directionRef.current = "back";
      stack.pop();
    } else {
      directionRef.current = "forward";
      stack.push(pathname);
    }
    prevPathnameRef.current = pathname;
  }

  const direction = directionRef.current;

  const variants = {
    initial: (dir: "forward" | "back") => ({
      x: dir === "forward" ? "100%" : "-28%",
      opacity: dir === "forward" ? 1 : 0.55,
      zIndex: dir === "forward" ? 2 : 1,
    }),
    animate: (dir: "forward" | "back") => ({
      x: "0%",
      opacity: 1,
      zIndex: dir === "forward" ? 2 : 1,
    }),
    exit: (dir: "forward" | "back") => ({
      x: dir === "forward" ? "-28%" : "100%",
      opacity: dir === "forward" ? 0.55 : 1,
      zIndex: dir === "forward" ? 1 : 2,
    }),
  };

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
