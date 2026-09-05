"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Notification } from "iconsax-reactjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Logo } from "@/components/logo";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/utils/tailwind";
import { useCompanyStore } from "@/lib/store/company";
import { useStudentStore } from "@/lib/store";
import { useFetchNotifications, useFetchUnreadCount } from "@/queries";
import { useLogout } from "@/hooks/use-logout";
import { LogOut, User } from "lucide-react";
import moment from "moment";

export function Header({ link }: { link: { text: string; href: string }[] }) {
  const pathname = usePathname();
  const company = useCompanyStore((c) => c.company);
  const student = useStudentStore((c) => c.student);
  const parentRoute = pathname.split("/")[2];
  const logout = useLogout();
  const { data: notifications = [] } = useFetchNotifications();
  const { data: unreadCount = 0 } = useFetchUnreadCount();
  const recent = notifications.slice(0, 3);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex items-center justify-between px-6 h-[55px] border-b border-grey-5">
        <Link href="/portal ">
          <Logo />
        </Link>
        <nav className="gap-16 hidden md:flex h-full ">
          {link.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "flex items-center h-[55px] text-sm text-primary transition-colors",
                // "border-b-2 border-transparent -mb-px",
                link.href.includes(parentRoute) &&
                  "border-b -mb-px border-primary text-black",
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="relative cursor-pointer">
                <Notification
                  size={35}
                  className="border border-[#C9C9DA] rounded-full p-2"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-72" align="end">
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Notifications</p>
              </div>
              {recent.length === 0 ? (
                <p className="px-6 py-4 text-sm text-gray-400">No notifications yet.</p>
              ) : (
                recent.map((n) => (
                  <div key={n.id} className={cn("px-4 py-3 border-b flex items-start gap-2", !n.isRead && "bg-primary/5")}>
                    <Notification size={18} className="shrink-0 mt-0.5 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{n.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.body}</p>
                      <p className="text-[11px] text-gray-300 mt-0.5">{moment(n.createdAt).fromNow()}</p>
                    </div>
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                ))
              )}
              <Link href="/portal/notifications" className="block px-4 py-2.5 text-xs text-center text-primary hover:underline border-t">
                See all notifications
              </Link>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="rounded-full h-10 w-10 cursor-pointer">
                <Image
                  src={company?.avatarUrl || student?.profileImage || "/applicant.png"}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                  width={35}
                  height={35}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-1.5 w-44" align="end">
              <Link
                href="/portal/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" /> Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </PopoverContent>
          </Popover>
        </div>
        <MobileNav links={link} />
      </div>
    </header>
  );
}
