"use client";

interface Props {
  selected: string;
  onSelect: (section: string) => void;
}

const sections = [
  "General",
  "Users & Roles",
  "Verification",
  "Placement Rules",
  "Notifications",
  "Security",
];

export default function SettingsSidebar({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col p-4 gap-2">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => onSelect(section)}
          className={`w-full text-left px-4 py-2 rounded-lg transition
            ${
              selected === section
                ? "bg-primary text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          {section}
        </button>
      ))}
    </div>
  );
}
