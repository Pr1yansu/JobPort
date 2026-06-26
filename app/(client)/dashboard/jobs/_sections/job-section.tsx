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
