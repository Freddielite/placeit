"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown2 } from "iconsax-reactjs";

export function Sort() {
  const [sort, setSort] = React.useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="sm:flex bg-[#F9FBFF] cursor-pointer align-middle gap-3 my-auto py-1.5 px-4 rounded-lg text-[#7E7E7E] hidden">
          <span className="">
            Sort by: <span className="text-[#3D3C42]"> {sort}</span>
          </span>
          <ArrowDown2 color="black" size="24" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="Newest">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Oldest">Oldest</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
