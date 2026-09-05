// src/components/_molecules/student-detail.tsx
// src/data/students.ts
export const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    program: "Computer Science",
    status: "Active",
    applications: 5,
    profileUrl: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    program: "Software Engineering",
    status: "Pending",
    applications: 2,
    profileUrl: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    name: "Catherine Lee",
    email: "catherine.lee@example.com",
    program: "Information Technology",
    status: "Suspended",
    applications: 0,
    profileUrl: "https://via.placeholder.com/40",
  },
];

export default function StudentDetail({
  student,
  onClose,
}: {
  student: (typeof students)[0] | null;
  onClose: () => void;
}) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full p-6 overflow-auto">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 mb-4"
        >
          Close
        </button>

        <div className="flex flex-col items-center gap-4">
          <img
            src={student.profileUrl}
            alt={student.name}
            className="w-20 h-20 rounded-full"
          />
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-gray-500">{student.email}</p>
          <p className="text-gray-500">{student.program}</p>
          <span
            className={`px-3 py-1 rounded-full font-semibold ${
              student.status === "Active"
                ? "bg-green-100 text-green-800"
                : student.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {student.status}
          </span>

          <p className="mt-2 text-gray-600">
            Applications submitted: {student.applications}
          </p>

          <div className="flex gap-3 mt-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Activate
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
