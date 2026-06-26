import React from "react";
import PostJobForm from "./_forms/post-job-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job",
};

const PostJob = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Create Job Requisition
        </h1>
        <p className="text-zinc-500 mt-2 text-base max-w-2xl leading-relaxed">
          Publish a new employment opportunity to our talent network. Fill in the specific role requirements, compensation package, and ideal candidate profile below.
        </p>
      </div>
      <PostJobForm />
    </div>
  );
};

export default PostJob;
