import { Briefcase } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <Briefcase size={48} className="text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Offers Yet
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        You don&apos;t have any placement offers at the moment. Check back later
        for new opportunities.
      </p>
    </div>
  );
};

export default EmptyState;
