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
        <SidebarNavigation user={user} />
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
