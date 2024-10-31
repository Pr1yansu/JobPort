"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUTH_ROUTES_START } from "@/routes";

interface LogoutBtnProps {
  children?: React.ReactNode;
  size?: "sm" | "lg" | "icon" | "default" | null;
  asChild?: boolean;
}

const LogoutBtn = ({ children, size = "default", asChild }: LogoutBtnProps) => {
  const router = useRouter();
  const { mutate, data, isPending } = useLogout();

  const handleLogout = async () => {
    mutate({});
  };

  useEffect(() => {
    if (!data) return;
    if (data.success) {
      router.push(AUTH_ROUTES_START + "/login");
    } else {
      toast.error(data.message || "Failed to logout");
    }
  }, [data]);

  if (asChild) {
    return (
      <button onClick={handleLogout} disabled={isPending} className="w-full">
        {children || "Logout"}
      </button>
    );
  }

  return (
    <Button onClick={handleLogout} size={size} disabled={isPending}>
      {children || "Logout"}
    </Button>
  );
};

export default LogoutBtn;
