import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../_components/app-sidebar";
import Navbar from "@/components/header/navbar";
import RecruiterModal from "../_components/_modals/recruiter-modal";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-5 w-full max-w-screen-2xl mx-auto">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />
          <Navbar />
        </div>
        {children}
        <RecruiterModal />
      </main>
    </SidebarProvider>
  );
};

export default ClientLayout;
