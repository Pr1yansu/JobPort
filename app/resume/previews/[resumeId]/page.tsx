"use client";

import MainResume from "@/app/(client)/dashboard/resume/[resumeId]/_components/main-resume";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const ResumePreviewShare = () => {
  const { data: session } = useSession();
  const params = useParams();
  const resume = useQuery(api.resume.getResume, {
    collaboratorId: session?.user.id || "",
    id: params.resumeId as Id<"resumes">,
  });

  if (resume === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resume || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-6">
        <MainResume resume={resume} />
      </div>
    </div>
  );
};

export default ResumePreviewShare;
