import React from "react";
import Link from "next/link";

export function Overview({
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
    <Link href={link}>
      <div className="w-40 h-15  bg-primary flex rounded-md text-white gap-4 p-3 content-center justify-between">
        <h3 className="font-medium text-base truncate">{title}</h3>

        <div className="bg-white text-black rounded h-8 w-8 flex items-center justify-center text-sm font-semibold">
          {number}
        </div>
      </div>
    </Link>
  );
}
