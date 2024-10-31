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
  CalendarCheck2,
  CircleFadingPlus,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  UserPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import InviteFriends from "./invite-friends";
import LogoutBtn from "@/components/ui/logout-btn";
import ApplyAsRecruiter from "./apply-as-recruiter";

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
      { title: "Applicants", url: "/dashboard/applicants", icon: UserPen }
    );
  }

  return (
    <Sidebar>
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
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
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
        {user.role === "USER" && <ApplyAsRecruiter />}
        <InviteFriends />
      </SidebarContent>
    </Sidebar>
  );
}
