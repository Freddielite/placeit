export const filtered = <T>(
  data: T[],
  filters: { query?: string; status?: string },
  selector: (item: T) => string | undefined
) => {
  const { query = "", status = "all" } = filters;
  const q = query.toLowerCase();

  return data.filter((item) => {
    const name = selector(item)?.toLowerCase() || "";

    const matchesQuery = name.includes(q);
    const matchesStatus = status === "all" || (item as any).status === status;

    return matchesQuery && matchesStatus;
  });
};
