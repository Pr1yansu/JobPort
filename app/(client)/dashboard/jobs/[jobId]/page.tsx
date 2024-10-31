import React from "react";
import JobDetails from "@/app/_components/job-details";

interface Params {
  params: {
    jobId: string;
  };
}

const JobDetail = ({ params }: Params) => {
  const { jobId } = params;
  return <JobDetails id={jobId} />;
};

export default JobDetail;
