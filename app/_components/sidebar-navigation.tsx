"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CircleFadingPlus,
  FileUser,
  LayoutDashboard,
  LogOut,
  User,
  UserPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutBtn from "@/components/ui/logout-btn";
import NonPremiumButton from "./non-premium-button";
import { FaRobot } from "react-icons/fa6";

export default function SidebarNavigation({ user }: { user: any }) {
  const pathname = usePathname();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Resume",
      url: "/dashboard/resume",
      icon: FileUser,
    },
    {
      title: "AI Suggestions",
      url: "/dashboard/suggestions",
      icon: FaRobot,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  if (user.role === "ADMIN") {
    items.splice(2, 0, {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    });
  }

  if (user.role === "RECRUITER" || user.role === "ADMIN") {
    items.splice(
      2,
      0,
      {
        title: "Post Job",
        url: "/dashboard/post-job",
        icon: CircleFadingPlus,
      },
      {
        title: "Posted jobs",
        url: "/dashboard/posted-jobs",
        icon: CalendarCheck2,
      },
      {
        title: "Companies",
        url: "/dashboard/company",
        icon: Building2,
      },
      { title: "Applicants", url: "/dashboard/applicants", icon: UserPen }
    );
  }

  return (
    <SidebarMenu className="h-full space-y-2 px-3 py-4">
      {items.map((item) => {
        const isActive =
          pathname === item.url ||
          (item.url !== "/dashboard" && pathname?.startsWith(item.url));

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={
                isActive
                  ? "!bg-blue-600/10 !text-blue-600 !font-semibold !shadow-none !rounded-xl py-3 px-4 transition-all flex items-center gap-3.5 border-l-4 border-blue-600"
                  : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 font-medium rounded-xl py-3 px-4 transition-all flex items-center gap-3.5 border-l-4 border-transparent hover:border-zinc-300"
              }
            >
              {item.title === "Resume" ? (
                user.premium ? (
                  <Link href={item.url} className="flex items-center gap-3.5 w-full">
                    <item.icon className="size-5 shrink-0" />
                    <span className="text-sm tracking-wide">{item.title}</span>
                  </Link>
                ) : (
                  <NonPremiumButton feature="Resume Builder" />
                )
              ) : (
                <Link href={item.url} className="flex items-center gap-3.5 w-full">
                  <item.icon className="size-5 shrink-0" />
                  <span className="text-sm tracking-wide">{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
      <SidebarMenuItem>
        <LogoutBtn asChild>
          <div className="flex text-sm px-4 py-3 gap-3.5 items-center text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 font-medium w-full rounded-xl cursor-pointer transition-all duration-200 mt-4 border border-zinc-200/50 shadow-sm hover:shadow-md">
            <LogOut className="size-5 shrink-0 text-zinc-400" />
            <span className="tracking-wide">Logout</span>
          </div>
        </LogoutBtn>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
