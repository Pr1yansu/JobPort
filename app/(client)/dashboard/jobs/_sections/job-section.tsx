"use client";

import React from "react";
import { cn } from "@/lib/utils";
import JobButton from "@/app/_components/job-btn";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JobDetails from "@/app/_components/job-details";
import { useBookmark } from "@/hooks/use-bookmark";
import { useGetJob } from "@/features/jobs/api/use-job";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const JobSection = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useGetJob();

  const { addBookmark, removeBookmark, bookmarks } = useBookmark();
  const [currentWidth, setCurrentWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBookmarkClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    if (bookmarks.some((bookmark) => bookmark.id === id)) {
      removeBookmark(id);
    } else {
      addBookmark({ id });
    }
  };

  const handleJobSelect = (id: string) => {
    if (currentWidth > 768) {
      const params = new URLSearchParams(searchParams);
      if (params.has("job")) {
        params.set("job", id);
      } else {
        params.append("job", id);
      }
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      router.push(`${pathname}/${id}`);
    }
  };

  const jobListVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const jobItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const jobDetailsVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-1/3 h-8" />
        <Skeleton className="w-1/3 h-4" />
        <Separator />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton className="w-full h-12" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.jobs || data.jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-zinc-50/50 border border-zinc-200/60 rounded-2xl border-dashed">
        <div className="bg-white p-6 rounded-full shadow-sm border border-zinc-100 mb-6">
          <svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">No jobs posted yet</h3>
        <p className="text-zinc-500 mt-2 text-center max-w-md">
          You haven't posted any job requisitions. Create your first job posting to start receiving applications.
        </p>
        <button 
          onClick={() => router.push("/dashboard/post-job")}
          className="mt-8 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-zinc-900/50 outline-none"
        >
          Post a Job Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      <motion.div
        className={cn(
          "space-y-3",
          currentWidth > 768
            ? "w-full md:w-1/2 lg:w-5/12 border-r border-zinc-200 h-full pr-6"
            : "w-full"
        )}
        variants={jobListVariants}
        initial="hidden"
        animate="show"
      >
        <div className="space-y-1 mb-6">
          <h4 className="text-xl font-bold text-zinc-900 tracking-tight">
            {searchParams.get("job") ? "Jobs" : "Recent Jobs List"}
          </h4>
          <p className="text-sm font-medium text-zinc-500">
            {data?.totalCount && data?.totalCount > 1
              ? `${data?.totalCount} results found`
              : `${data?.totalCount || 0} result found`}
          </p>
        </div>
        {data?.jobs?.map((job) => (
          <motion.div variants={jobItemVariants} key={job.id}>
            <JobButton
              handleBookmarkClick={handleBookmarkClick}
              handleJobSelect={handleJobSelect}
              selected={searchParams.get("job") === job.id || (!searchParams.get("job") && data?.jobs?.[0]?.id === job.id)}
              job={{
                id: job.id,
                image: job.company.logoUrl || undefined,
                title: job.title,
                deadline: job.deadline,
                status: job.status,
                company: job.company.name,
                location: job.jobLocation.label,
                type: job.jobType.label,
                currencyType: job.currencyType,
                salary: job.salary,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {currentWidth > 768 && (searchParams.get("job") || data?.jobs?.[0]?.id) && (
          <motion.div
            className="w-full md:w-1/2 lg:w-7/12 pl-2 pr-4"
            variants={jobDetailsVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <JobDetails id={searchParams.get("job") || data?.jobs?.[0]?.id || ""} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobSection;
