"use client";

import { useEffect, useState } from "react";
import { usePersona } from "@/app/(site)/_context/persona";
import { useInView } from "@/hooks/use-in-view";

type StatItem = { num: number; suffix: string; label: string };

const data: Record<string, StatItem[]> = {
  default: [
    { num: 3200, suffix: "+", label: "Registered Users" },
    { num: 50,   suffix: "+", label: "Verified Companies" },
    { num: 36,   suffix: "",  label: "States & FCT" },
    { num: 48,   suffix: "h", label: "Avg. Verification Time" },
  ],
  student: [
    { num: 2000, suffix: "+", label: "Students Registered" },
    { num: 50,   suffix: "+", label: "Verified Companies" },
    { num: 36,   suffix: "",  label: "States & FCT" },
    { num: 48,   suffix: "h", label: "Avg. Verification Time" },
  ],
  corps: [
    { num: 1200, suffix: "+", label: "Corps Members" },
    { num: 50,   suffix: "+", label: "PPA Slots Listed" },
    { num: 36,   suffix: "",  label: "States & FCT" },
    { num: 3,    suffix: "",  label: "Week Camp Window" },
  ],
  company: [
    { num: 3200, suffix: "+", label: "Talent Pool" },
    { num: 50,   suffix: "+", label: "Active Listings" },
    { num: 36,   suffix: "",  label: "States & FCT" },
    { num: 48,   suffix: "h", label: "Avg. Time to First Applicant" },
  ],
};

function CountUp({ num, suffix, inView }: { num: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const duration = 1600;
    const totalSteps = duration / 16;
    const increment = num / totalSteps;

    const timer = setInterval(() => {
      current = Math.min(current + increment, num);
      setCount(Math.floor(current));
      if (current >= num) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, num]);

  const formatted = count >= 1000 ? count.toLocaleString() : String(count);
  return <>{formatted}{suffix}</>;
}

export function Stats() {
  const { persona } = usePersona();
  const items = data[persona ?? "default"];
  const { ref, inView } = useInView({ threshold: 0.3 });

  return (
    <div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative bg-primary overflow-hidden"
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  <CountUp num={item.num} suffix={item.suffix} inView={inView} />
                </p>
                <p className="text-sm mt-1 font-medium text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave transition to next section */}
      <div className="bg-primary" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 52"
          preserveAspectRatio="none"
          className="w-full block text-[#f7f8fc]"
          style={{ height: "52px" }}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,26 C240,52 480,0 720,26 C960,52 1200,0 1440,26 L1440,52 L0,52 Z"
          />
        </svg>
      </div>
    </div>
  );
}
