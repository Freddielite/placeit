import { Button } from "@/components/ui/button";
import { useFetchAdmins } from "@/queries/admin";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { adminRole } from "../new-admin/new-admin";
import { updateAdminRole } from "@/actions";

export default function AdminList() {
  const { data, isLoading } = useFetchAdmins();
  const queryClient = useQueryClient();
  const [currentEdit, setCurrentEdit] = useState<number | null>(null); // index of the row being edited
  const { execute, isExecuting } = useAction(updateAdminRole, {
    onSuccess: () => {
      setCurrentEdit(null);
      queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (e) => {
    },
  });

  if (isLoading) {
    return <div>Loading admins...</div>;
  }

  const roles = ["superadmin", "admin", "support", "moderator"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header: Title + Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h3 className="font-semibold text-lg">Users & Roles</h3>
          <p className="text-sm text-gray-500">
            Manage admin accounts and their roles
          </p>
        </div>

        <Link href={"settings/new-admin"}>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add New Admin
          </Button>
        </Link>
      </div>

      {/* Table Header */}
      <div className="hidden md:flex flex-row bg-gray-100 text-gray-600 font-medium px-4 py-2 rounded-t-lg">
        <div className="flex-1">User</div>
        <div className="flex-1">Role</div>
        <div className="flex-1">Last Active</div>
        <div className="flex-1 text-right">Actions</div>
      </div>

      {/* Admin Rows */}
      {data.map((admin: any, index: number) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 px-4 py-3 border-b hover:bg-gray-50 rounded-md"
        >
          <div className="flex-1 font-medium">{admin.username}</div>
          <div className="flex-1">{admin.role}</div>
          <div className="flex-1 flex justify-end gap-2 mt-2 md:mt-0">
            {currentEdit === index ? (
              <div className="inline-block">
                <select
                  className="text-sm text-gray-500"
                  defaultValue={admin.role}
                  onChange={(e) => {
                    execute({
                      adminId: admin.id,
                      role: e.target.value as adminRole,
                    });
                  }}
                >
                  {roles.map((role) => (
                    <option key={role} className="font-medium" value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentEdit(index)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
