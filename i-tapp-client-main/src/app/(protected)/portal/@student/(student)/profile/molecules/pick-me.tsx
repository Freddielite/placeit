"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/tailwind";

export default function PickMe() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const normalized = useMemo(() => text.trim(), [text]);

  const addItem = () => {
    const value = normalized;
    if (!value) return;

    // prevent duplicates (case-insensitive)
    const exists = items.some((i) => i.toLowerCase() === value.toLowerCase());
    if (exists) {
      setText("");
      return;
    }

    setItems((prev) => [...prev, value]);
    setText("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-600">
        Selected: <span className="font-semibold">{items.length}</span>
      </p>

      <div className="w-[500px] rounded-lg border bg-white p-3">
        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Pill
              key={`${item}-${index}`}
              text={item}
              onRemove={() => removeItem(index)}
            />
          ))}
        </div>

        {/* Input */}
        <input
          type="text"
          value={text}
          placeholder="Type and press Enter…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }

            // nice UX: backspace removes last tag when input is empty
            if (
              e.key === "Backspace" &&
              text.length === 0 &&
              items.length > 0
            ) {
              removeItem(items.length - 1);
            }
          }}
          className="mt-3 w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Optional add button */}
      <button
        type="button"
        onClick={addItem}
        disabled={!normalized}
        className={cn(
          "w-fit rounded-md px-3 py-2 text-sm",
          normalized ? "bg-primary text-white" : "bg-gray-200 text-gray-500",
        )}
      >
        Add
      </button>
    </div>
  );
}

function Pill({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1.5 text-sm">
      <span className="capitalize">{text}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 hover:bg-gray-200"
        aria-label={`Remove ${text}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
