export default function StudentOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <main className="">{children}</main>
    </div>
  );
}
