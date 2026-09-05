import { apply, initializePayment, save, withdraw } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchOpportunityPublicDetails } from "@/hooks/query";
import { useFetchMyApplicationStatus } from "@/queries/student";
import { useStudentStore } from "@/lib/store";
import { ApplicationStatus } from "@/types/enums";
import { cn } from "@/utils/tailwind";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "iconsax-reactjs";
import {
  BadgeCheck,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  MapPin,
  Monitor,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import dp from "@/assets/images/dp.png";
import moment from "moment";

export default function OpportunityDetailsContent({
  selectedId,
  setSelectedId,
  selectedOpportunity: propOpportunity,
}: {
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  selectedOpportunity?: any;
}) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isPage = pathname.startsWith("/portal/find-it-space/o/");
  const router = useRouter();
  const params = useParams();
  const id = params.opportunityId;

  const opportunityId = isPage ? String(id) : selectedId;

  const { data: fetchedOpportunity, isLoading } =
    useFetchOpportunityPublicDetails(opportunityId ?? undefined);

  const selectedOpportunity =
    fetchedOpportunity || propOpportunity
      ? {
          ...propOpportunity,
          ...fetchedOpportunity,
          preferredFields:
            fetchedOpportunity?.preferredFields?.length > 0
              ? fetchedOpportunity?.preferredFields
              : propOpportunity?.preferredFields,
        }
      : null;

  const { data: myApplicationStatus } = useFetchMyApplicationStatus(
    opportunityId ?? undefined,
  );

  const student = useStudentStore((s) => s.student);
  const [locationWarningOpen, setLocationWarningOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{ fee: number; message: string } | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [saved, setSaved] = useState(false);

  const exists = myApplicationStatus?.exists ?? false;
  const status = myApplicationStatus?.status ?? null;
  const applicationId = myApplicationStatus?.applicationId ?? null;
  const logo = selectedOpportunity?.company?.logo ?? null;

  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;
  const canWithdraw = exists && status === ApplicationStatus.APPLIED && Boolean(applicationId);
  const hasApplied = exists && !isWithdrawn;

  const address = selectedOpportunity?.company?.addresses?.[0] ?? null;

  const rawStipend = selectedOpportunity?.stipend;
  const stipendNum = rawStipend != null ? Number(rawStipend) : NaN;
  const stipend = !isNaN(stipendNum) && stipendNum > 0 ? stipendNum : null;

  const isClosed = selectedOpportunity?.status === "closed";
  const deadlineMoment = selectedOpportunity?.applicationDeadline
    ? moment(selectedOpportunity.applicationDeadline)
    : null;
  const daysToDeadline = deadlineMoment ? deadlineMoment.diff(moment(), "days") : null;
  const isUrgent = !isClosed && daysToDeadline !== null && daysToDeadline >= 0 && daysToDeadline <= 7;
  const isVerified = selectedOpportunity?.company?.status === "approved";

  const formatAddress = (a?: any) => {
    if (!a) return null;
    return [a.line1, a.city, a.state, a.country].filter((v) => v && v !== "N/A").join(", ");
  };

  const isLocationMismatch = (): boolean => {
    const preferred = student?.preferredLocation?.trim().toLowerCase();
    if (!preferred) return false;
    const haystack = [selectedOpportunity?.location, address?.city, address?.state]
      .filter(Boolean).join(" ").toLowerCase();
    return haystack.length > 0 && !haystack.includes(preferred);
  };

  const opportunityLocationLabel = (): string => {
    const parts = [selectedOpportunity?.location, address?.city, address?.state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  const invalidateDetails = () => {
    queryClient.invalidateQueries({ queryKey: ["my-application-status", opportunityId] });
    queryClient.invalidateQueries({ queryKey: ["opportunity-public-details", opportunityId] });
  };

  const { execute: applyAction, isExecuting: isApplying } = useAction(apply, {
    onSuccess: (data) => {
      const result = data?.data;
      if (result?.requiresPayment) {
        setPaymentData({ fee: result.fee, message: result.message });
        setPaymentModalOpen(true);
        return;
      }
      toast.success(result?.message || "Applied successfully!");
      invalidateDetails();
    },
    onError: (err) => toast.error(err?.error?.serverError || "Failed to apply. Please try again."),
  });

  const handleProceedToPayment = async () => {
    if (!opportunityId) return;
    setIsInitializingPayment(true);
    try {
      const result = await initializePayment({ opportunityId });
      const url = (result as any)?.data?.authorizationUrl;
      if (url) window.location.href = url;
      else toast.error("Could not initialize payment. Please try again.");
    } catch {
      toast.error("Could not initialize payment. Please try again.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const { execute: saveAction } = useAction(save, {
    onSuccess() { setSaved(true); toast.success("Saved successfully!"); },
    onError(err) { toast.error(err?.error?.serverError || "Failed to save. Please try again."); },
  });

  const { execute: withdrawAction, isExecuting: isWithdrawing } = useAction(withdraw, {
    onSuccess(data) { toast.success(data?.data?.message || "Withdrawn successfully!"); invalidateDetails(); },
    onError(err) { toast.error(err?.error?.serverError || "Failed to withdraw. Please try again."); },
  });

  const executeApply = () => { if (!opportunityId) return; applyAction({ id: opportunityId }); };
  const handleApply = () => { if (isLocationMismatch()) { setLocationWarningOpen(true); return; } executeApply(); };
  const handleWithdraw = () => { if (!applicationId) return; withdrawAction({ id: applicationId }); };
  const handleSave = () => { if (!opportunityId) return; saveAction({ id: opportunityId }); };

  const formattedAddress = formatAddress(address);

  let applyLabel = "Apply Now";
  if (isClosed) applyLabel = "Closed";
  else if (isWithdrawn) applyLabel = "Re-apply";
  else if (isApplying) applyLabel = "Applying…";

  const visible = Boolean(opportunityId);
  if (!visible) return null;
  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <>
      {/* Thin top action strip */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300">Placement Details</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSave}
            aria-label="Save"
            className={cn(
              "cursor-pointer h-6 w-6 flex items-center justify-center transition-colors",
              saved ? "text-red-500" : "text-gray-300 hover:text-gray-500",
            )}
          >
            <Heart size={14} variant={saved ? "Bold" : "Linear"} />
          </button>
          {!isPage && setSelectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="cursor-pointer h-6 w-6 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Hero ── */}
        <div className="relative bg-white px-5 pt-5 pb-4 border-b border-gray-100">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />

          {/* Logo + identity */}
          <div className="relative flex items-start gap-4">
            <div className={cn(
              "shrink-0 w-14 h-14 border-2 bg-white overflow-hidden flex items-center justify-center shadow-sm",
              isClosed ? "border-gray-200 grayscale opacity-60" : "border-gray-100",
            )}>
              <Image src={logo ?? dp} alt="logo" width={56} height={56} className="w-full h-full object-contain" />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h2 className={cn(
                "text-[15px] font-extrabold leading-tight capitalize",
                isClosed ? "text-gray-400" : "text-gray-900",
              )}>
                {selectedOpportunity?.title ?? "Untitled"}
              </h2>

              <div className="flex items-center gap-1.5 mt-1">
                <Link
                  href={`/portal/company/${selectedOpportunity?.company?.id}`}
                  className="text-[12px] font-semibold text-primary hover:underline truncate max-w-[160px]"
                >
                  {selectedOpportunity?.company?.name}
                </Link>
                {isVerified && (
                  <div className="relative group/v shrink-0">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                    <div className="absolute z-20 bottom-full mb-1 left-0 w-36 hidden group-hover/v:block bg-gray-900 text-white text-[10px] px-2 py-1.5 leading-relaxed whitespace-nowrap">
                      Verified company
                    </div>
                  </div>
                )}
              </div>

              {(formattedAddress || selectedOpportunity?.location) && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
                  <p className="text-[11px] text-gray-400 capitalize truncate">
                    {formattedAddress ?? selectedOpportunity?.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Badges row */}
          <div className="relative flex flex-wrap gap-1.5 mt-4">
            {hasApplied && (
              <Pill className="text-primary bg-primary/10 border-primary/25 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Applied
              </Pill>
            )}
            {isClosed && (
              <Pill className="text-gray-400 bg-gray-100 border-gray-200">Closed</Pill>
            )}
            {isUrgent && !isClosed && (
              <Pill className="text-red-600 bg-red-50 border-red-200 font-bold">
                <CalendarClock className="w-3 h-3" />
                {daysToDeadline === 0 ? "Closes today" : daysToDeadline === 1 ? "Closes tomorrow" : `Closes in ${daysToDeadline}d`}
              </Pill>
            )}
            {selectedOpportunity?.mode && (
              <Pill className="text-gray-500 bg-gray-50 border-gray-200 capitalize">{selectedOpportunity.mode}</Pill>
            )}
            {selectedOpportunity?.industry && (
              <Pill className="text-gray-500 bg-gray-50 border-gray-200 capitalize">{selectedOpportunity.industry}</Pill>
            )}
          </div>
        </div>

        {/* ── Key numbers strip ── */}
        <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50/80">
          <KeyStat
            icon={<Clock className="w-4 h-4" />}
            label="Duration"
            value={selectedOpportunity?.duration ? `${selectedOpportunity.duration} mo.` : "—"}
            accent="text-primary"
          />
          <KeyStat
            icon={<Users className="w-4 h-4" />}
            label="Applicants"
            value={`${selectedOpportunity?.totalApplications ?? 0}${selectedOpportunity?.maxApplicants ? `/${selectedOpportunity.maxApplicants}` : ""}`}
            accent="text-gray-700"
            border
          />
          <KeyStat
            icon={<Monitor className="w-4 h-4" />}
            label="Mode"
            value={selectedOpportunity?.mode ?? "—"}
            accent="text-gray-700"
          />
        </div>

        {/* ── Stipend callout ── */}
        {stipend && (
          <div className="mx-4 mt-4 border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 flex items-center justify-center shrink-0">
                <Banknote className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-emerald-600">Monthly Stipend</p>
                <p className="text-xl font-black text-emerald-800 leading-none mt-0.5">₦{stipend.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-500 border border-emerald-200 px-2 py-0.5 bg-white">
              / month
            </span>
          </div>
        )}

        {/* ── Timeline metadata ── */}
        <div className="mx-4 mt-4 border border-gray-100 divide-y divide-gray-100">
          <MetaRow icon={<Clock className="w-3.5 h-3.5 text-gray-300" />} label="Posted">
            <span className="text-[12px] font-semibold text-gray-700">{moment(selectedOpportunity?.createdAt).fromNow()}</span>
          </MetaRow>
          {deadlineMoment && (
            <MetaRow icon={<CalendarClock className={cn("w-3.5 h-3.5", isUrgent ? "text-red-400" : "text-gray-300")} />} label="Application Deadline">
              <span className={cn("text-[12px] font-semibold", isUrgent ? "text-red-600" : "text-gray-700")}>
                {deadlineMoment.format("D MMM YYYY")}
                {isUrgent && <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5">Urgent</span>}
              </span>
            </MetaRow>
          )}
        </div>

        <div className="px-4 pt-4 pb-6 flex flex-col gap-5">

          {/* Description */}
          {selectedOpportunity?.description && (
            <section>
              <SectionLabel>Description</SectionLabel>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-gray-500 whitespace-pre-line">
                {selectedOpportunity.description}
              </p>
            </section>
          )}

          {/* Department */}
          {selectedOpportunity?.department?.length > 0 && (
            <section>
              <SectionLabel>Department</SectionLabel>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedOpportunity.department.map((dept: string, i: number) => (
                  <FieldChip key={i} icon={<Briefcase className="w-2.5 h-2.5" />}>{dept}</FieldChip>
                ))}
              </div>
            </section>
          )}

          {/* Preferred fields */}
          {selectedOpportunity?.preferredFields?.length > 0 && (
            <section>
              <SectionLabel>Preferred Fields of Study</SectionLabel>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedOpportunity.preferredFields.map((field: any, i: number) => (
                  <FieldChip key={field?.id ?? i} icon={<BookOpen className="w-2.5 h-2.5" />}>
                    {typeof field === "string" ? field : field?.field}
                  </FieldChip>
                ))}
              </div>
            </section>
          )}

          {/* Company address */}
          {formattedAddress && (
            <section>
              <SectionLabel>Company Address</SectionLabel>
              <div className="mt-2 flex items-start gap-2.5 border border-gray-100 bg-gray-50 px-3 py-2.5">
                <Building2 className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                <p className="text-[12px] text-gray-500 leading-relaxed">{formattedAddress}</p>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          {/* Primary action */}
          {(!exists || isWithdrawn) ? (
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying || isClosed}
              className={cn(
                "cursor-pointer flex-1 h-10 text-[13px] font-bold uppercase tracking-wide transition-colors",
                isClosed
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90",
              )}
            >
              {applyLabel}
            </button>
          ) : canWithdraw ? (
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="cursor-pointer flex-1 h-10 text-[13px] font-bold uppercase tracking-wide bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              {isWithdrawing ? "Withdrawing…" : "Withdraw"}
            </button>
          ) : (
            <div className="flex-1 h-10 flex items-center justify-center text-[13px] font-bold uppercase tracking-wide bg-gray-100 text-gray-400 border border-gray-200 capitalize">
              {status}
            </div>
          )}

          {/* Back */}
          <button
            type="button"
            onClick={() => { if (isPage) { router.back(); return; } setSelectedId?.(null); }}
            className="cursor-pointer h-10 px-4 border border-gray-200 text-[11px] font-semibold text-gray-400 hover:text-gray-700 hover:border-gray-400 uppercase tracking-wide transition-colors"
          >
            Back
          </button>
        </div>

        <p className="mt-2 text-[10px] text-gray-300 text-center">
          Only apply to placements you genuinely intend to pursue.
        </p>
      </div>

      {/* Location mismatch modal */}
      <Dialog open={locationWarningOpen} onOpenChange={setLocationWarningOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <TriangleAlert size={18} />
              </span>
              <DialogTitle className="text-base leading-snug">Location Mismatch</DialogTitle>
            </div>
            <DialogDescription className="mt-3 text-sm leading-relaxed">
              This opportunity is outside your preferred IT location.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground shrink-0">Your preferred location</span>
              <span className="font-medium text-right capitalize">{student?.preferredLocation ?? "—"}</span>
            </div>
            <div className="border-t border-amber-100" />
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground shrink-0">Opportunity location</span>
              <span className="font-medium text-right capitalize">{opportunityLocationLabel()}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            You can still apply, but note that this placement may require relocation outside your preferred area.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setLocationWarningOpen(false)}>Go Back</Button>
            <Button className="w-full sm:w-auto" disabled={isApplying} onClick={() => { setLocationWarningOpen(false); executeApply(); }}>
              {isApplying ? "Applying..." : "Apply Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Banknote size={18} />
              </span>
              <DialogTitle className="text-base font-semibold">Application Fee Required</DialogTitle>
            </div>
            <DialogDescription className="mt-3 text-sm leading-relaxed">
              {paymentData?.message ?? "A payment is required to submit this application."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Application fee</span>
              <span className="font-semibold text-blue-700">₦{paymentData?.fee?.toLocaleString() ?? "2,500"}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Your application will be submitted automatically once payment is confirmed.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)} disabled={isInitializingPayment}>Cancel</Button>
            <Button onClick={handleProceedToPayment} disabled={isInitializingPayment} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isInitializingPayment ? "Redirecting…" : `Pay ₦${paymentData?.fee?.toLocaleString() ?? "2,500"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Sub-components ── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 shrink-0">{children}</p>
    <span className="flex-1 h-px bg-gray-100" />
  </div>
);

const Pill = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn(
    "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border",
    className,
  )}>
    {children}
  </span>
);

const KeyStat = ({
  icon, label, value, accent, border,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  border?: boolean;
}) => (
  <div className={cn("flex flex-col items-center justify-center py-3.5 gap-1 text-center", border && "border-x border-gray-100")}>
    <div className="text-gray-300">{icon}</div>
    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-300">{label}</p>
    <p className={cn("text-[13px] font-bold capitalize leading-none", accent)}>{value}</p>
  </div>
);

const MetaRow = ({
  icon, label, children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-3 py-2.5">
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
    {children}
  </div>
);

const FieldChip = ({ children, icon, className }: { children: React.ReactNode; icon?: React.ReactNode; className?: string }) => (
  <span className={cn(
    "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 capitalize",
    className,
  )}>
    {icon && <span className="text-gray-400">{icon}</span>}
    {children}
  </span>
);
