"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

// WhatsApp/iOS-style directional navigation:
// - Going deeper (forward): the new page slides in from the right, fully
//   covering the previous one. The previous page stays underneath,
//   shifting slightly left and dimming (parallax) rather than fully
//   leaving - this is the detail that makes it read as "app" instead of
//   "web page swap."
// - Going back: it's the exact reverse - the current page slides fully
//   off to the right, revealing the previous page sliding back in from
//   its dimmed, shifted-left position to normal.
//
// Direction is inferred by watching for the browser's popstate event
// (fired on back/forward navigation, i.e. router.back() or a hardware/
// gesture back) vs a normal push (Link click, router.push) which doesn't
// fire popstate before the pathname changes.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const isPopRef = useRef(false);
  const directionRef = useRef<"forward" | "back">("forward");

  useEffect(() => {
    const onPopState = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (pathname !== prevPathnameRef.current) {
    directionRef.current = isPopRef.current ? "back" : "forward";
    isPopRef.current = false;
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
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          style={{ width: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
