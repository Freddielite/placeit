import Image from "next/image";
import { cn } from "@/utils/tailwind";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      height={46}
      width={180}
      priority={true}
      alt="PlaceIT"
      className={cn("h-auto w-auto", className)}
    />
  );
}
