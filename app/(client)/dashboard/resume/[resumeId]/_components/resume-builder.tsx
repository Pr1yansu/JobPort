import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { BasicForm } from "./basic-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SectionUpdateForm from "./section-update-form";

interface Props {
  currentWidth: number;
  resume: Doc<"resumes">;
  sections: Doc<"sections">[] | undefined | null;
}

export default function ResumeBuilder({
  currentWidth,
  resume,
  sections,
}: Props) {
  if (currentWidth < 1210) {
    return (
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Update Resume Details</SheetTitle>
            <SheetDescription hidden></SheetDescription>
            <BasicForm currentWidth={currentWidth} resume={resume} />
            <SectionUpdateForm sections={sections} />
          </SheetHeader>
        </SheetContent>
      </ScrollArea>
    );
  }

  if (currentWidth > 1210) {
    return (
      <div className="w-1/3 pr-5 pt-5 no-print">
        <BasicForm currentWidth={currentWidth} resume={resume} />
        <SectionUpdateForm sections={sections} />
      </div>
    );
  }
}
