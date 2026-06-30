import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import InviteFriends from "./invite-friends";
import ApplyAsRecruiter from "./apply-as-recruiter";
import RazorpayButton from "./payment-btn";
import SidebarNavigation from "./sidebar-navigation";

export const revalidate = 60;

export async function AppSidebar() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <Sidebar className="no-print">
      <SidebarContent className="p-3 bg-zinc-50/50">
        <SidebarHeader>
          <div className="flex flex-col justify-center items-center py-4">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-zinc-900 to-zinc-600 bg-clip-text text-transparent">JobPort</h1>
            <div className="relative mt-6 mb-3">
              <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full"></div>
              <Avatar className="relative w-16 h-16 border-2 border-white shadow-sm ring-1 ring-zinc-200/50">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.name || undefined}
                />
                <AvatarFallback className="bg-zinc-100 text-zinc-600 font-medium">
                  {user?.name?.split(" ").map((name) => name[0])}
                </AvatarFallback>
              </Avatar>
            </div>
            <h4 className="text-sm font-semibold text-zinc-800 tracking-tight">
              {user?.name || user?.email}
            </h4>
            <span className="text-xs text-zinc-500 font-medium mt-0.5 capitalize">{user?.role?.toLowerCase()}</span>
          </div>
        </SidebarHeader>
        <SidebarNavigation user={user} />
        <div className="mt-4 px-2">
          {user.premium ? (
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 py-2.5 rounded-lg border border-amber-500/20 shadow-sm">
              Premium User <Star className="size-3.5 fill-amber-500" />
            </div>
          ) : (
            <RazorpayButton amount={100} />
          )}
        </div>
        {user.role === "USER" && <ApplyAsRecruiter />}
        <InviteFriends />
      </SidebarContent>
    </Sidebar>
  );
}
