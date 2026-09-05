import { MapPin, Users, Calendar, Briefcase } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { getStatusConfig } from "@/utils/application-status-config";

export default function ApplicationCard({
  application,
}: {
  application: any[];
}) {
  return (
    <div className="lg:hidden space-y-4">
      {application.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No applications found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        application.map((application, key) => {
          const statusConfig = getStatusConfig(
            application?.opportunity?.status,
          );
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg text-lg font-bold flex-shrink-0">
                    {application?.opportunity?.company?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {application?.opportunity?.company?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {application.opportunity?.company?.industry}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex-shrink-0`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${statusConfig.dot}`}
                  ></span>
                  {application?.opportunity?.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar
                    size={16}
                    className="mr-2 text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Applied</p>
                    <p className="text-sm font-medium">
                      {formatDate(application.appliedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users
                    size={16}
                    className="mr-2 text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Applicants</p>
                    <p className="text-sm font-medium">
                      {application?.opportunity?.totalApplications || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 col-span-2">
                  <MapPin
                    size={16}
                    className="mr-2 text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">
                      {application?.opportunity?.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {/* <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                View Details
              </button> */}
            </div>
          );
        })
      )}
    </div>
  );
}
