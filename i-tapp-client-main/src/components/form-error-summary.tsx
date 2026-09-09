"use client";

import type { FieldErrors } from "react-hook-form";
import { AlertCircle } from "lucide-react";

/**
 * Rendered above a form once submit has been attempted and failed.
 *
 * The per-field `<FormMessage />` already says what is wrong with each box.
 * This exists for the "so they know what's missing" half of the problem: on a
 * five-field form the first error can be off-screen, and react-hook-form's
 * focus-first-error only helps if you notice the focus move.
 *
 * `labels` maps field name -> the label shown on screen, so the summary reads
 * the way the form does ("Company Name") rather than the way the schema does
 * ("name"). Any field missing from the map falls back to its raw name.
 */
export function FormErrorSummary({
  errors,
  submitted,
  labels = {},
}: {
  errors: FieldErrors;
  submitted: boolean;
  labels?: Record<string, string>;
}) {
  const names = Object.keys(errors);
  if (!submitted || names.length === 0) return null;

  const listed = names.map((name) => labels[name] ?? name);

  return (
    <div
      role="alert"
      className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <div className="text-sm">
        <p className="font-semibold text-red-700">
          {names.length === 1
            ? "1 field needs your attention"
            : `${names.length} fields need your attention`}
        </p>
        <p className="mt-0.5 text-red-600">{listed.join(", ")}</p>
      </div>
    </div>
  );
}
