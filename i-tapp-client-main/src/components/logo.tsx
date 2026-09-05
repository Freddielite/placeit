import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/new-logo.svg"
      height={150}
      width={150}
      priority={true}
      alt="PlaceIT"
      className={className}
    />
  );
}
