"use client";

import { useFetchNotifications } from "@/queries";
import { type AppNotification } from "@/queries/student";
import { markAllNotificationsRead, markNotificationRead, deleteNotification } from "@/actions";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { cn } from "@/utils/tailwind";
import {
  BellOff,
  CheckCheck,
  Trash2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Bell,
  UserCheck,
  UserX,
} from "lucide-react";

/* ── icon + color per notification type ── */
function getTypeStyle(type: string): { icon: React.ReactNode; bg: string; iconColor: string } {
  switch (type) {
    case "OFFER_SENT":
      return { icon: <Briefcase className="w-4 h-4" />, bg: "bg-blue-50", iconColor: "text-blue-500" };
    case "OFFER_ACCEPTED":
      return { icon: <CheckCircle2 className="w-4 h-4" />, bg: "bg-emerald-50", iconColor: "text-emerald-500" };
    case "OFFER_DECLINED":
      return { icon: <XCircle className="w-4 h-4" />, bg: "bg-red-50", iconColor: "text-red-400" };
    case "APPLICATION_RECEIVED":
      return { icon: <Briefcase className="w-4 h-4" />, bg: "bg-primary/10", iconColor: "text-primary" };
    case "APPLICATION_STATUS_CHANGED":
      return { icon: <CheckCircle2 className="w-4 h-4" />, bg: "bg-amber-50", iconColor: "text-amber-500" };
    case "ONBOARDING_APPROVED":
      return { icon: <UserCheck className="w-4 h-4" />, bg: "bg-emerald-50", iconColor: "text-emerald-500" };
    case "ONBOARDING_REJECTED":
      return { icon: <UserX className="w-4 h-4" />, bg: "bg-red-50", iconColor: "text-red-400" };
    default:
      return { icon: <Bell className="w-4 h-4" />, bg: "bg-gray-100", iconColor: "text-gray-400" };
  }
}

export default function NotificationPage() {
  const { data = [], isLoading } = useFetchNotifications();
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
  };

  const { execute: markRead } = useAction(markNotificationRead, { onSuccess: invalidate });
  const { execute: markAll, isExecuting: isMarkingAll } = useAction(markAllNotificationsRead, { onSuccess: invalidate });
  const { execute: deleteItem } = useAction(deleteNotification, { onSuccess: invalidate });

  const unread = data.filter((n) => !n.isRead);
  const read = data.filter((n) => n.isRead);

  return (
    <div className="min-h-screen pt-[55px]" style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="bg-white border border-gray-200 px-6 py-5 mb-6 flex items-center justify-between">
          <div className="pl-4 border-l-4 border-primary">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-0.5">Inbox</p>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">Notifications</h1>
            <p className="text-xs text-gray-400 mt-1">
              {isLoading ? "Loading…" : `${data.length} total · ${unread.length} unread`}
            </p>
          </div>
          {unread.length > 0 && (
            <button
              type="button"
              disabled={isMarkingAll}
              onClick={() => markAll({})}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wide hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-px bg-gray-200 border border-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white px-5 py-4 animate-pulse flex gap-4">
                <div className="w-10 h-10 bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2.5 py-1">
                  <div className="h-3 bg-gray-100 w-1/2" />
                  <div className="h-2.5 bg-gray-100 w-5/6" />
                  <div className="h-2 bg-gray-100 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && data.length === 0 && (
          <div className="bg-white border border-gray-200 flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex items-center justify-center">
              <BellOff className="w-7 h-7 text-gray-300 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-600">All caught up</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                No notifications yet. We'll ping you when something needs your attention.
              </p>
            </div>
          </div>
        )}

        {/* Unread group */}
        {!isLoading && unread.length > 0 && (
          <div className="mb-5">
            <SectionLabel>
              <span>Unread</span>
              <span className="inline-flex items-center justify-center h-4 px-1.5 bg-primary text-white text-[9px] font-black rounded-full min-w-[16px]">
                {unread.length}
              </span>
            </SectionLabel>
            <div className="flex flex-col gap-px bg-gray-200 border border-gray-200">
              {unread.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onRead={() => markRead({ id: n.id })}
                  onDelete={() => deleteItem({ id: n.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Read group */}
        {!isLoading && read.length > 0 && (
          <div>
            <SectionLabel>Earlier</SectionLabel>
            <div className="flex flex-col gap-px bg-gray-200 border border-gray-200">
              {read.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onRead={() => markRead({ id: n.id })}
                  onDelete={() => deleteItem({ id: n.id })}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 flex items-center gap-1.5">
        {children}
      </p>
      <span className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function NotificationRow({
  notification,
  onRead,
  onDelete,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDelete: () => void;
}) {
  const { icon, bg, iconColor } = getTypeStyle(notification.type ?? "");
  const unread = !notification.isRead;

  return (
    <div
      // role={unread ? "button" : undefined}
      tabIndex={unread ? 0 : undefined}
      className={cn(
        "group relative flex items-start gap-4 px-5 py-4 bg-white transition-colors",
        unread
          ? "border-l-[3px] border-l-primary cursor-pointer hover:bg-primary/1.5"
          : "border-l-[3px] border-l-transparent",
      )}
      onClick={() => { if (unread) onRead(); }}
      onKeyDown={(e) => { if (e.key === "Enter" && unread) onRead(); }}
    >
      {/* Type icon */}
      <div className={cn("shrink-0 w-10 h-10 flex items-center justify-center mt-0.5", unread ? bg : "bg-gray-50")}>
        <span className={cn(unread ? iconColor : "text-gray-300")}>{icon}</span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pr-6">
        <p className={cn(
          "text-[13px] leading-snug",
          unread ? "font-semibold text-gray-900" : "font-normal text-gray-500",
        )}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notification.body}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[10px] text-gray-300 tabular-nums">{moment(notification.createdAt).fromNow()}</p>
          {notification.type && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <p className="text-[10px] text-gray-300 uppercase tracking-wide">
                {notification.type.replace(/_/g, " ").toLowerCase()}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Actions — appear on hover */}
      <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {unread && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRead(); }}
            className="cursor-pointer h-6 w-6 flex items-center justify-center text-gray-300 hover:text-primary transition-colors"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="cursor-pointer h-6 w-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Delete"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Unread dot */}
      {unread && <span className="absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full bg-primary" />}
    </div>
  );
}
