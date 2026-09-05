import FilterCompanies from "./filter-content";

export default function FilterPanel(props: {
  filter: any;
  setFilter: (f: any) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  return (
    <aside className="hidden lg:flex flex-col bg-white border-r border-gray-100 h-full min-h-0">
      <FilterCompanies {...props} />
    </aside>
  );
}
