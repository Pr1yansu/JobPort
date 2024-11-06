import React from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicForm } from "./basic-form";

interface Props {
  currentWidth: number;
  resume: any;
}

export default function ResumeBuilder({ currentWidth, resume }: Props) {
  if (currentWidth < 1210) {
    return (
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Update Resume Details</SheetTitle>
            <SheetDescription hidden></SheetDescription>
            <BasicForm currentWidth={currentWidth} resume={resume} />
          </SheetHeader>
        </SheetContent>
      </ScrollArea>
    );
  }

  if (currentWidth > 1210) {
    return (
      <div className="w-1/3 pr-5 pt-5 no-print">
        <BasicForm currentWidth={currentWidth} resume={resume} />
      </div>
    );
  }
}
