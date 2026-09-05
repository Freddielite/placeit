// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useFetchCompanies } from "@/queries/admin";
// import { companyStatusStyle } from "@/utils/admin-status-style";

// export default function CompanyTable({}: // onView,
// {
//   // onView: (company: any) => void;
// }) {
//   const { data, isLoading, error } = useFetchCompanies();

//   console.log("Fetched companies:", data);

//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   if (isLoading) {
//     return <div className="p-4">Loading companies...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-600">Error loading companies.</div>;
//   }

//   const filteredCompanies =
//     data?.filter(
//       (c: any) =>
//         c.name.toLowerCase().includes(search.toLowerCase()) ||
//         c.industry.toLowerCase().includes(search.toLowerCase()),
//     ) || [];

//   return (
//     <div className="border rounded-xl overflow-x-auto bg-white shadow">
//       {/* Header */}
//       <div className="p-4 flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search companies..."
//           className="border px-3 py-2 rounded w-64"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//           Add Company
//         </button>
//       </div>

//       {/* Table */}
//       <table className="min-w-full text-sm text-left">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="font-medium p-3">#</th>
//             <th className="font-medium p-3">Company Name</th>
//             <th className="font-medium p-3">Status</th>
//             <th className="font-medium p-3">Industry</th>
//             <th className="font-medium p-3">Registration Date</th>
//             <th className="font-medium p-3">CAC Document</th>
//             <th className="font-medium p-3">Opportunities</th>
//             <th className="font-medium p-3">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredCompanies.map((c: any, index: number) => (
//             <tr
//               key={c.id}
//               className="border-b hover:bg-gray-50 transition"
//               // Uncomment if you want row click navigation
//             >
//               <td className="p-3">{index + 1}</td>
//               <td className="p-3 font-medium">{c.name}</td>
//               <td className="p-3">
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     companyStatusStyle[
//                       c.status as keyof typeof companyStatusStyle
//                     ]
//                   }`}
//                 >
//                   {c.status}
//                 </span>
//               </td>
//               <td className="p-3">{c.industry}</td>
//               <td className="p-3">{c.registrationDate}</td>
//               <td className="p-3">{c.cacDocument}</td>
//               <td className="p-3">{c.opportunities.length}</td>
//               <td className="p-3 flex gap-2">
//                 <button
//                   onClick={() => router.push(`/admin/company/${c.id}`)}
//                   className="text-indigo-600 hover:underline"
//                 >
//                   View
//                 </button>
//                 <button className="text-red-600 hover:underline">
//                   Deactivate
//                 </button>
//               </td>
//             </tr>
//           ))}

//           {filteredCompanies.length === 0 && (
//             <tr>
//               <td colSpan={8} className="text-center p-4 text-gray-500">
//                 No companies found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchCompanies } from "@/queries/admin";
import { companyStatusStyle } from "@/utils/admin-status-style";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { resendActivation } from "@/actions";
import { toast } from "react-toastify";

export default function CompanyTable() {
  const { data, isLoading, error } = useFetchCompanies();

  const [search, setSearch] = useState("");
  const router = useRouter();

  const { execute, isExecuting } = useAction(resendActivation, {
    onSuccess: () => {
      toast.success("Invitation resent successfully");
    },
    onError: () => {
      toast.error("Error resending invitation");
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading companies...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading companies.</div>;
  }

  const filteredCompanies =
    data?.filter(
      (c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search companies..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          href="/admin/company/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add Company
        </Link>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="font-medium p-3">#</th>
            <th className="font-medium p-3">Company Name</th>
            <th className="font-medium p-3">Status</th>
            <th className="font-medium p-3">Industry</th>
            {/* <th className="font-medium p-3">Registration Date</th> */}
            <th className="font-medium p-3">Active status/Onboarded</th>
            <th className="font-medium p-3">Opportunities</th>
            <th className="font-medium p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCompanies.map((c: any, index: number) => {
            return (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      companyStatusStyle[
                        c.status as keyof typeof companyStatusStyle
                      ]
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">{c.industry}</td>
                {/* <td className="p-3">{c.registrationDate}</td> */}
                {/* <td className="p-3 text-center">
                  {c.isOnboarded ? (
                    <span className="text-green-500">●</span>
                  ) : (
                    <span className="text-red-500">○</span>
                  )}
                </td> */}

                <td className="p-3 text-center flex justify-center gap-4">
                  {/* Dot 1: has logged in / accessed account */}
                  {c.user?.lastLoginAt ? (
                    <span className="text-green-500" title="Has accessed account">
                      ●
                    </span>
                  ) : (
                    <span className="text-red-500" title="Never logged in">
                      ●
                    </span>
                  )}

                  {/* Onboarding Status */}
                  {c.isOnboarded ? (
                    <span className="text-green-500" title="Onboarded">
                      ●
                    </span>
                  ) : (
                    <span className="text-red-500" title="Not Onboarded">
                      ●
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">{c.opportunities.length}</td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/company/${c.id}`}
                    className={buttonVariants({ variant: "link" })}
                  >
                    View
                  </Link>

                  {!c.isOnboarded && !c.user?.lastLoginAt && (
                    <Button
                      className="cursor-pointer"
                      variant={"link"}
                      onClick={execute.bind(null, { email: c?.user?.email })}
                    >
                      {isExecuting ? "Resending..." : "Resend Invite"}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}

          {filteredCompanies.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                No companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
