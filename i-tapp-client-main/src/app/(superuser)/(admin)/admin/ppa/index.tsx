"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { useFetchAdminPPA, useFetchAdminPPAStats } from "@/queries/admin";
import { updatePPAStatus, createPPAListing } from "@/actions";
import { NIGERIAN_STATES } from "@/constants";
import SummaryCard from "../_molecules/summary-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ppaFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  organisationName: z.string().min(1, "Organisation name is required"),
  sector: z.string().min(1, "Sector is required"),
  state: z.string().min(1, "State is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description is required"),
  duration: z.number().int().positive("Duration must be positive"),
  maxApplicants: z.number().positive().optional(),
  applicationDeadline: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});
type PPAFormValues = z.infer<typeof ppaFormSchema>;

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  closed: "bg-red-100 text-red-700",
};

const selectClass =
  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function PPACreateModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<PPAFormValues>({
    resolver: zodResolver(ppaFormSchema),
    defaultValues: {
      title: "",
      organisationName: "",
      sector: "",
      state: "",
      location: "",
      description: "",
      duration: 3,
      maxApplicants: undefined,
      applicationDeadline: "",
      contactEmail: "",
      phone: "",
    },
    mode: "onChange",
  });

  const { execute, isExecuting } = useAction(createPPAListing, {
    onSuccess: () => {
      toast.success("PPA listing created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-ppa"] });
      onClose();
    },
    onError: (e) =>
      toast.error(e?.error?.serverError ?? "Failed to create PPA listing"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full md:max-w-2xl md:mx-4 bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="h-1 w-full bg-primary shrink-0" />
        <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Post PPA Listing
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Create a new NYSC Place of Primary Assignment listing
            </p>
          </div>
          <button
            type="button"
            title="close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 md:px-8">
          <Form {...form}>
            <form
              id="ppa-create-form"
              onSubmit={form.handleSubmit((d) => execute(d))}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Listing Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Software Engineering Intern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organisationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Zenith Bank Plc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector / Industry</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Banking, Technology"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <select
                          className={selectClass}
                          {...field}
                          value={field.value ?? ""}
                        >
                          <option value="" disabled>
                            Select state
                          </option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Location / Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 23 Marina St, Lagos Island"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="e.g. 12"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxApplicants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Max Applicants{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Leave blank for unlimited"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : e.target.valueAsNumber,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Application Deadline{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Email{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="hr@company.com"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+234 801 234 5678"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the role, responsibilities, and any requirements…"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <div className="shrink-0 border-t border-gray-100 px-5 py-4 flex items-center justify-end gap-2 bg-gray-50/80">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="ppa-create-form" disabled={isExecuting}>
            {isExecuting ? "Posting…" : "Post Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPPAPage() {
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("create") === "1") setCreating(true);
  }, [searchParams]);

  const { data, isLoading } = useFetchAdminPPA({
    state: stateFilter || undefined,
    status: statusFilter || undefined,
  });
  const { data: stats } = useFetchAdminPPAStats();

  const queryClient = useQueryClient();
  const listings: any[] = data?.data?.listings ?? data?.data ?? data ?? [];

  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const closed = stats?.closed ?? 0;
  const paused = stats?.paused ?? 0;

  const { execute: updateStatus, isExecuting } = useAction(updatePPAStatus, {
    onSuccess: () => {
      toast.success("PPA status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-ppa"] });
    },
    onError: (e) =>
      toast.error(e?.error?.serverError ?? "Failed to update status"),
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {creating && <PPACreateModal onClose={() => setCreating(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">PPA Listings</h1>
        <Button
          onClick={() => setCreating(true)}
          className="self-start sm:self-auto flex items-center gap-2"
        >
          <Plus size={16} /> Post PPA Listing
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard title="Total Listings" number={total} component="" />
        <SummaryCard title="Active" number={active} component="" />
        <SummaryCard title="Closed" number={closed} component="" />
        <SummaryCard title="Paused" number={paused} component="" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          title="dropdown"
          className="border rounded px-3 py-2 text-sm"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          title="status"
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div
        className="flex gap-6"
        style={{ minHeight: "400px", maxHeight: "calc(100vh - 360px)" }}
      >
        {/* Table */}
        <div className="flex-1 border rounded-xl bg-white shadow overflow-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3">Organisation</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Applications</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((ppa: any) => (
                  <tr
                    key={ppa.id}
                    className={`border-b hover:bg-gray-50 cursor-pointer transition ${selected?.id === ppa.id ? "bg-primary/5" : ""}`}
                    onClick={() => setSelected(ppa)}
                  >
                    <td className="p-3 font-medium">
                      {ppa.organisationName ?? ppa.title ?? ppa.name ?? "—"}
                    </td>
                    <td className="p-3">
                      {ppa.state ?? ppa.stateOfDeployment ?? "—"}
                    </td>
                    <td className="p-3">{ppa.sector ?? "—"}</td>
                    <td className="p-3">
                      {ppa.applicationsCount ?? ppa._count?.applications ?? "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[ppa.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {ppa.status ?? "active"}
                      </span>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        title="change"
                        disabled={isExecuting}
                        value={ppa.status ?? "active"}
                        onChange={(e) =>
                          updateStatus({
                            ppaId: ppa.id,
                            status: e.target.value as any,
                          })
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400">
                      <p className="font-medium text-gray-500 mb-1">
                        No PPA listings yet
                      </p>
                      <button
                        onClick={() => setCreating(true)}
                        className="text-primary text-sm hover:underline"
                      >
                        Post the first listing →
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 border rounded-xl bg-white shadow p-5 overflow-y-auto flex flex-col gap-4 shrink-0">
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-lg leading-tight">
                {selected.organisationName ?? selected.title ?? selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Title", selected.title],
                ["State", selected.state ?? selected.stateOfDeployment],
                ["Sector", selected.sector],
                ["Location", selected.location],
                [
                  "Duration",
                  selected.duration ? `${selected.duration} months` : null,
                ],
                ["Address", selected.address],
                ["Contact", selected.contactEmail ?? selected.email],
                ["Phone", selected.phone],
                ["Description", selected.description],
                ["Capacity", selected.maxApplicants ?? selected.capacity],
                [
                  "Applications",
                  selected.applicationsCount ?? selected._count?.applications,
                ],
              ].map(([label, value]) =>
                value ? (
                  <div key={label as string}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-gray-800">{value}</p>
                  </div>
                ) : null,
              )}
            </div>
            <div className="mt-auto pt-4 border-t">
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex gap-2">
                {(["active", "inactive", "closed"] as const).map((s) => (
                  <button
                    key={s}
                    disabled={isExecuting || selected.status === s}
                    onClick={() =>
                      updateStatus({ ppaId: selected.id, status: s })
                    }
                    className={`flex-1 py-1.5 rounded text-xs font-medium border transition disabled:opacity-40 ${selected.status === s ? "bg-primary text-white border-primary" : "hover:bg-gray-50"}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
