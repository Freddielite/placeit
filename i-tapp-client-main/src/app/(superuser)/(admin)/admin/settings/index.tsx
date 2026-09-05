"use client";

import { useState } from "react";
import {
  Settings,
  Users2,
  CreditCard,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/tailwind";
import { Switch } from "@/components/ui/switch";
import AdminList from "./_molecules/admin-list";

const NAV = [
  {
    key: "general",
    label: "General",
    icon: Settings,
    description: "Platform-wide settings",
  },
  {
    key: "admins",
    label: "Users & Roles",
    icon: Users2,
    description: "Admin accounts and permissions",
  },
  {
    key: "billing",
    label: "Payment & Billing",
    icon: CreditCard,
    description: "Fees, gateway and transactions",
  },
  {
    key: "security",
    label: "Security",
    icon: Shield,
    description: "Access control and policies",
  },
];

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6 pb-4 border-b">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
    </div>
  );
}

function SettingRow({
  label,
  desc,
  children,
  danger,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 py-4 border-b last:border-0",
        danger && "opacity-90",
      )}
    >
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold",
            danger ? "text-red-700" : "text-gray-800",
          )}
        >
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  );
}

function GeneralTab() {
  const [maintenance, setMaintenance] = useState(false);
  const [studentReg, setStudentReg] = useState(true);
  const [companyReg, setCompanyReg] = useState(true);
  const [corpsReg, setCorpsReg] = useState(true);
  const [publicOpps, setPublicOpps] = useState(true);

  return (
    <div>
      <SectionHeader
        title="General Settings"
        desc="Control platform-wide behaviour and feature availability."
      />

      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Platform Status
        </p>

        <SettingRow
          label="Maintenance Mode"
          desc="Takes the platform offline for all users except admins. Use before major updates."
          danger={maintenance}
        >
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </SettingRow>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Registration Controls
        </p>

        <SettingRow
          label="Student Registrations"
          desc="Allow new students to create accounts via /signup."
        >
          <Switch checked={studentReg} onCheckedChange={setStudentReg} />
        </SettingRow>
        <SettingRow
          label="Company Registrations"
          desc="Allow new companies to sign up via /company/signup."
        >
          <Switch checked={companyReg} onCheckedChange={setCompanyReg} />
        </SettingRow>
        <SettingRow
          label="Corps Member Registrations"
          desc="Allow new corps members to sign up via /corps/signup."
        >
          <Switch checked={corpsReg} onCheckedChange={setCorpsReg} />
        </SettingRow>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Content Visibility
        </p>

        <SettingRow
          label="Public Opportunity Listings"
          desc="Show opportunities on the public /opportunities page without login."
        >
          <Switch checked={publicOpps} onCheckedChange={setPublicOpps} />
        </SettingRow>
      </div>

      <div className="mt-8 pt-4 flex justify-end">
        <button className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div>
      <SectionHeader
        title="Payment & Billing"
        desc="Configure payment gateway, application fees, and transaction settings."
      />

      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Payment Gateway
        </p>

        <SettingRow
          label="Gateway"
          desc="Payment processor currently integrated."
        >
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            Paystack
          </span>
        </SettingRow>
        <SettingRow
          label="Test Mode"
          desc="Process payments in test mode — no real charges."
        >
          <Switch />
        </SettingRow>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Application Fees
        </p>

        <SettingRow
          label="Corps PPA Application Fee"
          desc="Fee charged to corps members when applying to a PPA listing."
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">₦</span>
            <input
              type="number"
              defaultValue={2000}
              className="w-24 border rounded-lg px-3 py-1.5 text-sm text-right"
            />
          </div>
        </SettingRow>
        <SettingRow
          label="Student Application Fee"
          desc="Fee charged to students applying to SIWES opportunities."
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">₦</span>
            <input
              type="number"
              defaultValue={0}
              className="w-24 border rounded-lg px-3 py-1.5 text-sm text-right"
            />
          </div>
        </SettingRow>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
        <p className="font-semibold">API keys are managed server-side</p>
        <p className="text-xs mt-1 text-amber-600">
          Paystack public/secret keys are set via environment variables, not
          stored in the database. Contact your DevOps lead to rotate keys.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [auditLog, setAuditLog] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("7");

  return (
    <div>
      <SectionHeader
        title="Security"
        desc="Manage access policies, session behaviour, and audit controls."
      />

      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Authentication
        </p>

        <SettingRow
          label="Require 2FA for Admins"
          desc="All admin accounts must set up two-factor authentication to log in."
        >
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </SettingRow>
        <SettingRow
          label="Session Timeout"
          desc="Automatically log out inactive users after this many days."
        >
          <div className="flex items-center gap-2">
            <input
              title="days"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-16 border rounded-lg px-3 py-1.5 text-sm text-right"
              min={1}
              max={90}
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </SettingRow>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Audit & Logging
        </p>

        <SettingRow
          label="Audit Log"
          desc="Record all admin actions — approvals, deletions, role changes."
        >
          <Switch checked={auditLog} onCheckedChange={setAuditLog} />
        </SettingRow>
        <SettingRow
          label="View Audit Log"
          desc="See the full history of admin actions on the platform."
        >
          <a
            href="/admin/audit"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            Open log <ChevronRight className="w-4 h-4" />
          </a>
        </SettingRow>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Danger Zone
        </p>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <SettingRow
            label="Purge All Deleted Records"
            desc="Permanently remove all soft-deleted users, companies, and opportunities. This cannot be undone."
            danger
          >
            <button className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-100 transition">
              Purge All
            </button>
          </SettingRow>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState("general");

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Page header */}
      <div className="px-6 py-5 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage system-wide configuration for the PlaceIT platform
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 border-r bg-white p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon, description }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                active === key
                  ? "bg-primary/8 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 mt-0.5 shrink-0",
                  active === key ? "text-primary" : "text-gray-400",
                )}
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight",
                    active === key ? "text-primary" : "text-gray-800",
                  )}
                >
                  {label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight truncate">
                  {description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-2xl bg-white rounded-xl border p-6 shadow-sm">
            {active === "general" && <GeneralTab />}
            {active === "admins" && <AdminList />}
            {active === "billing" && <BillingTab />}
            {active === "security" && <SecurityTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
