import React from "react";
import PostJobForm from "./_forms/post-job-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job",
};

const PostJob = () => {
  return (
    <div className="mx-auto py-10">
      <h4 className="text-2xl font-semibold text-gray-800 uppercase tracking-tight mb-4">
        Post a Job here
      </h4>
      <PostJobForm />
    </div>
  );
};

export default PostJob;
