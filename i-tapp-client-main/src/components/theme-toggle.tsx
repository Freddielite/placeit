"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/utils/tailwind";
import { useTheme } from "@/components/providers/theme-provider";
import { haptic } from "@/lib/haptics";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Auto", icon: Monitor },
];

/**
 * Segmented control, for a settings or profile screen. Three explicit
 * choices rather than a two-state switch: "follow my phone" is the option
 * most people actually want, and a switch can't express it.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference, available } = useTheme();

  if (!available) return null;

  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className={cn(
        "inline-flex rounded-full border border-border bg-muted p-1",
        className
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              haptic("select");
              setPreference(value);
            }}
            className={cn(
              "flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Single-button version for a header, where there's no room for three.
 * Cycles light -> dark -> auto.
 */
export function ThemeToggleButton({ className }: { className?: string }) {
  const { preference, theme, setPreference, available } = useTheme();

  if (!available) return null;

  const next: ThemePreference =
    preference === "light" ? "dark" : preference === "dark" ? "system" : "light";

  const Icon =
    preference === "system" ? Monitor : theme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => {
        haptic("select");
        setPreference(next);
      }}
      aria-label={`Appearance: ${preference}. Switch to ${next}.`}
      title={`Appearance: ${preference}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      <Icon size={18} />
    </button>
  );
}
