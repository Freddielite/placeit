export default function InfoCard({
  icon,
  label,
  value,
  href,
  external,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
}) {
  const content = (
    <div
      className={`group bg-white border border-gray-200 rounded-xl p-3  transition-all duration-200 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0 p-2 bg-blue-50 rounded-lg flex items-center justify-center text-primary group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-sm text-gray-900 font-medium wrap-break-words">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );

  return content;
}
