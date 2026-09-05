export const FilterBy = ({
  filterStatus,
  setFilterStatus,
}: {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}) => {
  return (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="all">All Status</option>
      <option value="Accepted">Accepted</option>
      <option value="Under Review">Under Review</option>
      <option value="Rejected">Rejected</option>
      <option value="Pending">Pending</option>
    </select>
  );
};
