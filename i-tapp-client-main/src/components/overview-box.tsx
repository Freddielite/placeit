import React from "react";
import Link from "next/link";

export function OverviewBox({
  title,
  number,
  icon = <></>,
  link,
}: {
  title: string;
  number: string | number;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <div
      className="flex
           flex-col justify-between
          bg-primary rounded-xl text-white px-4 py-4 w-full md:w-1/3 lg:w-1/4 md:cursor-pointer hover:opacity-90 transition-opacity duration-200
        "
    >
      {/* Top number */}
      <h6 className="font-semibold text-2xl">{number ?? 0}</h6>
      {/* Bottom row */}
      <div className="flex items-end gap-6 justify-between">
        <p className="text-sm font-medium ">{title} applicant</p>

        {icon && (
          <div
            className="
              bg-gray-100/20 text-white
              rounded-lg size-8
              flex items-center justify-center
              shrink-0
          
            "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
