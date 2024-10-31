import React from "react";
import JobHeader from "@/app/_components/job-header";
import JobSection from "./_sections/job-section";

const Jobs = () => {
  return (
    <div className="h-full">
      <JobHeader />
      <div className="py-5 h-full">
        <JobSection />
      </div>
    </div>
  );
};

export default Jobs;
