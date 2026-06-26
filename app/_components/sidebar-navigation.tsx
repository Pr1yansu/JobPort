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
    <SidebarMenu className="h-full space-y-1.5 px-2 py-2">
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
                  ? "bg-zinc-900 text-white font-bold shadow-lg hover:bg-zinc-800 hover:text-white rounded-xl py-5 px-4 transition-all duration-200 flex items-center gap-3.5 scale-[1.02]"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium rounded-xl py-5 px-4 transition-all duration-200 flex items-center gap-3.5"
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
          <div className="flex text-sm px-4 py-3.5 gap-3.5 items-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium w-full rounded-xl cursor-pointer transition-all duration-200 mt-2">
            <LogOut className="size-5 shrink-0" />
            <span className="tracking-wide">Logout</span>
          </div>
        </LogoutBtn>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
