"use client";
import React from "react";
import ResumeBuilder from "../[resumeId]/_components/resume-builder";
import ResumePreview from "../[resumeId]/_components/resume-preview";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const ResumeEditor = ({ resumeId }: { resumeId: Id<"resumes"> }) => {
  const [currentWidth, setCurrentWidth] = React.useState<number>(
    window.innerWidth
  );
  const { data: session } = useSession();
  const userId = session?.user.id;
  const resumeData = useQuery<typeof api.resume.getResume>(
    api.resume.getResume,
    {
      collaboratorId: userId || "",
      id: resumeId,
    }
  );
  const sections = useQuery(api.resumeSections.getSections, {
    resumeId: resumeData?._id,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (typeof window === "undefined") return null;

  if (resumeData === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resumeData || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-center text-xl font-semibold text-gray-800 mb-4">
              Access Denied
            </h3>
            <p className="text-center text-gray-600">
              You don't have permission to view this resume. The owner hasn't
              added you as a collaborator or made it public.
            </p>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-500 text-center">
              Please ask the owner to share it publicly or add you as a
              collaborator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ResumeBuilder
        currentWidth={currentWidth}
        resume={resumeData}
        sections={sections}
      />
      <ResumePreview
        resume={resumeData}
        currentWidth={currentWidth}
        sections={sections}
      />
    </div>
  );
};

export default ResumeEditor;
