"use client";

export default function PlacementDetail({ data }: any) {
  return (
    <div className="p-8 mx-auto flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            {data.application.student.firstName}{" "}
            {data.application.student.lastName}
          </h1>
          <p className="text-sm text-gray-500">Placement request detail</p>
        </div>

        {/* <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
          <Button variant="destructive">Decline</Button>
        </div> */}
      </div>

      {/* STUDENT INFORMATION */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Student Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              Name: {data.application.student.firstName}{" "}
              {data.application.student.lastName}
            </p>
            <p className="text-gray-700">
              Department: {data.application.student.courseOfStudy}
            </p>
            <p className="text-gray-700">
              Email: {data.application.student.email}
            </p>
            <p className="text-gray-700">
              Phone: {data.application.student.phone}
            </p>
          </div>
        </div>
      </div>

      {/* COMPANY INFORMATION */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Company Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 border">
          <p className="text-gray-700">Company: {data.company.name}</p>
          {/* <p className="text-gray-700">Contact Person: {data.contact}</p> */}
        </div>
      </div>

      {/* ATTACHED DOCUMENT */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-gray-800">Attached Documents</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 border">
          <ul className="list-disc list-inside text-gray-700">
            {data.documents?.map((doc: string, index: number) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
