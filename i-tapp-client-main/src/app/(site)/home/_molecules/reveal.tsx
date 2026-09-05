"use client";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/utils/tailwind";
import type { ReactNode, CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const { ref, inView } = useInView();

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : `translateY(${y}px)`,
    transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={cn(className)} style={style}>
      {children}
    </div>
  );
}
