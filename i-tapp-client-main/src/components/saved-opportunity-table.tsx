import { getStatusConfig } from "@/utils/application-status-config";
import { formatDate } from "@/utils/format-date";
import { Building2, MapPin, Users, Calendar, Briefcase } from "lucide-react";
export default function SavedOpportunityTable({
  opportunity,
}: {
  opportunity: any[];
}) {
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applied On
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {opportunity.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase size={48} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No applications found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              opportunity.map((opportunity, key) => {
                const statusConfig = getStatusConfig(opportunity?.status);
                return (
                  <tr
                    key={key}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg text-sm font-bold">
                          {opportunity?.company?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {opportunity?.company?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(opportunity.appliedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm">{opportunity?.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Building2 size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          {opportunity?.company?.industry}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm font-medium">
                          {opportunity?.totalApplications || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${statusConfig.dot}`}
                        ></span>
                        {opportunity?.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
