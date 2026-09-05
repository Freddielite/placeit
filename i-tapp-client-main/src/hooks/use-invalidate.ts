import { useQueryClient } from "@tanstack/react-query";

export const useAppInvalidate = (key: string) => {
  const qc = useQueryClient();
  return {
    invalidate: () => qc.invalidateQueries({ queryKey: [`${key}`] }),
  };
};

/**
 * Invalidates all opportunity-related query keys across the app:
 * - "company-opportunities"  (company list view)
 * - "opportunities"          (student find-it-space)
 * - "opportunity-details"    (company detail page)
 * - "opportunity-public-details" (student detail view)
 */
export const useInvalidateOpportunities = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["company-opportunities"] });
    qc.invalidateQueries({ queryKey: ["opportunities"] });
    qc.invalidateQueries({ queryKey: ["opportunity-details"] });
    qc.invalidateQueries({ queryKey: ["opportunity-public-details"] });
  };
};
