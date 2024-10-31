"use client";
import { useGetJobDetails } from "@/features/jobs/api/use-job";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface JobDetailsProps {
  id: string;
}

const JobDetails = ({ id }: JobDetailsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentWidth, setCurrentWidth] = React.useState<number>();
  const { data: jobDetails, isPending: jobDetailsPending } =
    useGetJobDetails(id);

  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);

    window?.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!currentWidth) return;
    const params = new URLSearchParams(searchParams);
    if (currentWidth > 1080) {
      if (params.has("job")) return;
      params.set("job", id);
      router.push(`/dashboard/jobs?${params.toString()}`);
    } else {
      if (pathname.includes(id)) return;
      router.push(`${pathname}/${id}`);
    }
  }, [currentWidth]);

  if (jobDetailsPending) {
    return <div>Loading...</div>;
  }

  if (!jobDetails) {
    return <div>Not found</div>;
  }

  return (
    <div className={cn("top-20", pathname.includes(id) ? "p-5" : "sticky")}>
      {JSON.stringify(jobDetails.job, null, 2)}
    </div>
  );
};

export default JobDetails;
