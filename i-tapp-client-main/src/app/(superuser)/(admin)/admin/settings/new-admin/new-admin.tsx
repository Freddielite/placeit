"use client";

import { createAdmin } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

export type adminRole = "superadmin" | "admin" | "moderator" | "support";

export default function AddNewAdminPage() {
  const roles = ["superadmin", "admin", "moderator", "support"];
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: roles[3],
  });

  const { execute, isExecuting } = useAction(createAdmin, {
    onSuccess: () => {
    },
    onError: (e) => {
    },
  });

  const handleCreate = () => {
    execute({
      username: form.username,
      email: form.email,
      role: form.role as adminRole,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">Add New Admin</h3>
        <p className="text-sm text-gray-500 mt-1">
          Create and configure a new administrator account.
        </p>
      </div>

      {/* ADMIN DETAILS */}
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-gray-800">Admin Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {roles.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ROLES */}
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-gray-800">Roles</h4>

        {/* <RadioGroup value={selectedRole} onChange={setSelectedRole}>
          <div className="flex flex-col gap-2">
            {roles.map((role) => (
              <RadioGroup.Option
                key={role}
                value={role}
                className={({ checked }) =>
                  `px-4 py-2 rounded-lg border cursor-pointer transition ${
                    checked
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 text-gray-700"
                  }`
                }
              >
                {role}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup> */}
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-4">
        <Button onClick={handleCreate}>
          {isExecuting ? "Saving..." : "Save Admin"}
        </Button>
      </div>
    </div>
  );
}
