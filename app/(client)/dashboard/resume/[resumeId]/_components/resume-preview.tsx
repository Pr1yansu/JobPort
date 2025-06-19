import React from "react";
import { DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainResume from "./main-resume";
import { cn } from "@/lib/utils";
import { useSaving } from "@/hooks/use-saving";
import { SheetTrigger } from "@/components/ui/sheet";
import Actions from "./resume-header-actions";
import { useSession } from "next-auth/react";
import { Doc } from "@/convex/_generated/dataModel";
import TemplateThemeChanger from "./template-theme-changer";
import { http, createConfig, WagmiProvider } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

interface Props {
  resume: Doc<"resumes">;
  sections: Doc<"sections">[] | undefined | null;
  currentWidth: number;
}

const ResumePreview = ({ resume, currentWidth, sections }: Props) => {
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
          <TemplateThemeChanger resume={resume} />
          <Separator orientation="vertical" />
        </div>
        {resume.createdBy === userId && (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <Actions resume={resume} />{" "}
            </QueryClientProvider>
          </WagmiProvider>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center bg-slate-100 p-5 my-2 resume-background">
        <MainResume resume={resume} sections={sections} />
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
