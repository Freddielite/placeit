"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  section: string;
}

export default function SettingsContent({ section }: Props) {
  switch (section) {
    case "General":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">General Settings</h1>
          <div className="flex flex-col gap-3">
            <label>Platform Name</label>
            <Input placeholder="i-tapp" />

            <label>Contact Email</label>
            <Input placeholder="support@itapp.com" />

            <label>Default Placement Duration (weeks)</label>
            <Input type="number" placeholder="12" />
          </div>

          <Button className="mt-4 w-max">Save Changes</Button>
        </div>
      );

    case "Users & Roles":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">
            User & Role Management
          </h1>

          <div className="flex flex-col gap-3">
            <label>Admin Name</label>
            <Input placeholder="John Doe" />

            <label>Email</label>
            <Input placeholder="admin@itapp.com" />

            <label>Role</label>
            <Input placeholder="Full Admin" />
          </div>

          <div className="flex gap-2 mt-4">
            <Button>Add Admin</Button>
            <Button variant="destructive">Remove Admin</Button>
          </div>
        </div>
      );

    case "Verification":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">Verification Settings</h1>

          <div className="flex items-center gap-3">
            <span>Auto-verify Companies</span>
            <Switch />
          </div>

          <div className="flex items-center gap-3">
            <span>Require CAC Document</span>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center gap-3">
            <span>Require Student ID</span>
            <Switch defaultChecked />
          </div>

          <Button className="mt-4 w-max">Save Changes</Button>
        </div>
      );

    case "Placement Rules":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">Placement Rules</h1>

          <label>Max Students per Company</label>
          <Input type="number" placeholder="5" />

          <label>Application Limit per Student</label>
          <Input type="number" placeholder="3" />

          <label>Company Response Deadline (days)</label>
          <Input type="number" placeholder="7" />

          <Button className="mt-4 w-max">Save Changes</Button>
        </div>
      );

    case "Notifications":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">Notification Settings</h1>

          <div className="flex items-center gap-3">
            <span>Email on New Application</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3">
            <span>Email on Approved Application</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3">
            <span>SMS Notifications</span>
            <Switch />
          </div>

          <Button className="mt-4 w-max">Save Changes</Button>
        </div>
      );

    case "Security":
      return (
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-2xl font-semibold mb-4">Security Settings</h1>

          <label>Change Password</label>
          <Input type="password" placeholder="New Password" />
          <Input type="password" placeholder="Confirm Password" />

          <div className="flex items-center gap-3 mt-4">
            <span>Enable 2-Factor Authentication</span>
            <Switch defaultChecked />
          </div>

          <Button className="mt-4 w-max">Save Changes</Button>
        </div>
      );

    default:
      return <div>Select a settings section</div>;
  }
}
