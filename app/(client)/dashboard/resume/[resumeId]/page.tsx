import { redirect } from "next/navigation";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Sheet } from "@/components/ui/sheet";
import dynamic from "next/dynamic";

const ResumeEditor = dynamic(() => import("../_components/resume-editor"), {
  ssr: false,
});

interface Params {
  params: {
    resumeId: Id<"resumes">;
  };
}

const UpdateResumeDetails = ({ params }: Params) => {
  const { resumeId } = params;
  if (!resumeId) redirect("/dashboard/resume");
  return (
    <Sheet>
      <ResumeEditor resumeId={resumeId} />
    </Sheet>
  );
};

export default UpdateResumeDetails;
