import React from "react";
import { DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import MainResume from "./main-resume";
import { cn } from "@/lib/utils";
import { useSaving } from "@/hooks/use-saving";
import { SheetTrigger } from "@/components/ui/sheet";
import Actions from "./resume-header-actions";
import { useSession } from "next-auth/react";

const ResumePreview = ({
  resume,
  currentWidth,
}: {
  resume: any;
  currentWidth: number;
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { saving } = useSaving();

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-80px)] py-2 flex flex-col top-0 sticky",
        currentWidth > 1210 ? "w-2/3" : "w-full"
      )}
    >
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          {currentWidth < 1210 && (
            <SheetTrigger asChild>
              <Button size={"sm"}>
                <DoorOpen size={20} />
                <span className="ml-2">Open toolbar</span>
              </Button>
            </SheetTrigger>
          )}
          <Button size={"sm"} variant={"ghost"}>
            <DashboardIcon fontSize={24} />
            Select Template
          </Button>
          <Separator orientation="vertical" />
        </div>
        {resume.createdBy === userId && <Actions resume={resume} />}
      </div>
      <div className="flex-1 flex justify-center items-center bg-slate-100 p-5 my-2 resume-background">
        <MainResume resume={resume} />
      </div>
      {saving && (
        <div className="no-print flex fixed bottom-5 right-0 bg-emerald-500 text-white p-2 rounded-tl-full rounded-bl-full font-semibold">
          <div className="flex justify-between items-center gap-2">
            <Loader2 size={24} className="animate-spin" />
            <span>Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
