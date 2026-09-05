"use client";

import { ReactNode } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function SummaryCard({
  title = "Title text",
  number = 0,
  component,
  data, // trend data for sparkline
}: {
  title: string;
  number: number;
  component?: ReactNode;
  data?: number[];
}) {
  return (
    <div className="flex flex-col justify-between border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Top: Title */}
      <h6 className="text-gray-500 text-sm font-semibold">{title}</h6>

      {/* Number */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mt-1.5">
        {number.toLocaleString()}
      </h2>

      {/* Trend sparkline — only render when there's a meaningful range */}
      {data && data.length > 1 && Math.min(...data) !== Math.max(...data) && (
        <div className="mt-3">
          <Sparklines data={data} width={100} height={20} min={Math.min(...data) - 1} max={Math.max(...data) + 1}>
            <SparklinesLine
              color="#6366F1"
              style={{ strokeWidth: 3, fill: "transparent" }}
            />
          </Sparklines>
        </div>
      )}

      {/* Extra info */}
      {component && (
        <div className="mt-2 text-sm text-gray-400">{component}</div>
      )}
    </div>
  );
}
