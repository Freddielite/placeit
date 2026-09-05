"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/tailwind";

type TagInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxItems?: number;
  color: string;
};

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  disabled,
  className,
  maxItems = 30,
  color,
}: TagInputProps) {
  const tagColors: any = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };

  const [text, setText] = useState("");

  const trimmed = useMemo(() => text.trim(), [text]);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.length >= maxItems) return;

    const exists = value.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (exists) return;

    onChange([...value, tag]);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addFromInput = () => {
    if (!trimmed) return;
    addTag(trimmed);
    setText("");
  };

  return (
    <div
      className={cn(
        "rounded border border-gray-200 bg-white p-2 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {value.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className={`inline-flex items-center justify-between gap-1 rounded-full border px-2 py-0.5 text-xs pl-4 ${tagColors[color]}`}
          >
            <span className="capitalize">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="rounded-full p-1 hover:bg-gray-200"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addFromInput();
          }

          // optional: backspace removes last tag if input empty
          if (e.key === "Backspace" && text.length === 0 && value.length > 0) {
            removeTag(value.length - 1);
          }

          // optional: comma adds immediately
          if (e.key === "," && trimmed) {
            e.preventDefault();
            addFromInput();
          }
        }}
        className="mt-2 w-full px-1 py-1 text-sm outline-none placeholder:text-sm placeholder:text-gray-400 bg-transparent"
      />

      {/* optional helper */}
      {/* <p className="mt-2 text-xs text-muted-foreground">
        Press Enter to add. Click × to remove.
      </p> */}
    </div>
  );
}
