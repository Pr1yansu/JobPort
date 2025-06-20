import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CircleFadingPlus,
  FileUser,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  User,
  UserPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import InviteFriends from "./invite-friends";
import LogoutBtn from "@/components/ui/logout-btn";
import ApplyAsRecruiter from "./apply-as-recruiter";
import RazorpayButton from "./payment-btn";
import { Button } from "@/components/ui/button";
import NonPremiumButton from "./non-premium-button";

export const revalidate = 60;

export async function AppSidebar() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

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
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
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
    <Sidebar className="no-print">
      <SidebarContent className="p-2">
        <SidebarHeader>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold">JobPort</h1>
            <Avatar className="mt-6 mb-4 w-16 h-16 border border-black">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || undefined}
              />
              <AvatarFallback>
                {user?.name?.split(" ").map((name) => name[0])}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-sm font-semibold">
              {user?.name || user?.email}
            </h4>
          </div>
        </SidebarHeader>
        <SidebarMenu className="h-full">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.title === "Resume" ? (
                  user.premium ? (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <NonPremiumButton feature="Resume Builder" />
                  )
                ) : (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <LogoutBtn asChild>
              <div className="flex text-sm px-2 py-1.5 gap-2 items-center hover:bg-zinc-100 w-full rounded-sm">
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </LogoutBtn>
          </SidebarMenuItem>
        </SidebarMenu>
        {user.premium ? (
          <span className="text-yellow-400 flex justify-center items-center text-sm font-semibold mt-4 uppercase">
            Premium User <Star className="inline size-4 ml-1" />
          </span>
        ) : (
          <RazorpayButton amount={100} />
        )}
        {user.role === "USER" && <ApplyAsRecruiter />}
        <InviteFriends />
      </SidebarContent>
    </Sidebar>
  );
}
