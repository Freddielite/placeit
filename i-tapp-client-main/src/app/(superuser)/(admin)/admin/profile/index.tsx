"use client";

import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { useFetchAdminProfile } from "@/queries/admin";
import { Camera } from "lucide-react";

export default function AdminProfilePage() {
  const { data, isLoading } = useFetchAdminProfile();

  if (isLoading) {
    return <div>Admin profile is loading </div>;
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        {/* HEADER */}
        <div className="border-b p-6 flex items-center gap-6 bg-gray-50">
          <div className="relative">
            <div className="rounded-full border h-20 w-20 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xl">A</span>
            </div>
            {/* Edit avatar button */}
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full shadow-md hover:bg-indigo-700 transition">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-900">Admin Name</h3>
            <p className="text-sm text-gray-500">{data?.username}</p>
            <span className="mt-1 inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
              {data?.role}
            </span>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 flex flex-col gap-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input placeholder="Admin" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input placeholder="Name" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input placeholder={data?.user?.email ?? "admin@getplaceit.com"} />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Button variant="outline" className="flex-1 md:flex-none">
              Cancel
            </Button>
            <Button className="flex-1 md:flex-none">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
