import React from "react";
import { auth } from "@/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, BellDot } from "lucide-react";
import Link from "next/link";
import SearchVariantBox from "./search-variant-box";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = async () => {
  const notifications = 0;
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex items-center justify-between w-full">
      <div className="max-w-sm w-full flex gap-2 items-center">
        <SidebarTrigger className="no-print" />
        <SearchVariantBox />
      </div>
      <div className="flex gap-2 items-center">
        <Link href="/dashboard/notifications">
          <Button size={"icon"} variant={"ghost"} className="rounded-full">
            {notifications > 0 ? <BellDot size={18} /> : <Bell size={18} />}
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage
              src={user?.image || undefined}
              alt={user?.name || undefined}
            />
            <AvatarFallback>
              {user?.name?.split(" ").map((name) => name[0])}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
