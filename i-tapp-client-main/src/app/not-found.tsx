import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">
        The page you’re looking for doesn’t exist.
      </p>

      <Link href="/" className="rounded bg-primary px-4 py-2 text-white">
        Go home
      </Link>
    </div>
  );
}
