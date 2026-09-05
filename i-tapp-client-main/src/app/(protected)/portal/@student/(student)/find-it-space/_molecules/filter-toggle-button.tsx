import { SlidersHorizontal } from "lucide-react";

type FilterToggleButtonProps = {
  onToggle: () => void;
  activeCount?: number;
};

export function FilterToggleButton({ onToggle, activeCount }: FilterToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filters
      {activeCount ? (
        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-primary text-white">
          {activeCount}
        </span>
      ) : null}
    </button>
  );
}
