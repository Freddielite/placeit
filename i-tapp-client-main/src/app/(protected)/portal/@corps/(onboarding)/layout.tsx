export default function CorpsOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <main>{children}</main>
    </div>
  );
}
