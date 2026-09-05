import Image from "next/image";
import { cn } from "@/utils/tailwind";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/placeit-logo.png"
      height={117}
      width={456}
      priority={true}
      alt="PlaceIT"
      className={cn("h-auto w-auto", className)}
    />
  );
}
