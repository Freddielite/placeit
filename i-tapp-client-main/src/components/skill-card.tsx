export default function SkillCard({
  icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | string[];
  color?: "blue" | "purple" | "green" | "orange";
}) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  const tagColors: any = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };

  const skills = Array.isArray(value)
    ? value
    : value
    ? (() => {
        const trimmed = value.trim();
        if (trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.map((s: string) => String(s).trim());
          } catch {}
        }
        return trimmed.split(",").map((s: string) => s.trim()).filter(Boolean);
      })()
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {label}
        </h3>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span
              key={index}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tagColors[color]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          No {label.toLowerCase()} specified
        </p>
      )}
    </div>
  );
}
