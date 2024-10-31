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
    if (currentWidth > 1080) {
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
    <div className="flex h-full">
      <motion.div
        className={cn(
          "px-3 space-y-2",
          currentWidth > 1080 && searchParams.has("job")
            ? "w-1/3 border-r h-full"
            : "w-full"
        )}
        variants={jobListVariants}
        initial="hidden"
        animate="show"
      >
        <div className="space-y-1 mb-4">
          <h4 className="text-base font-semibold">
            {searchParams.get("job") ? "Jobs" : "Recent Jobs List"}
          </h4>
          <p className="text-sm text-primary/60">
            {data?.totalCount && data?.totalCount > 1
              ? `${data?.totalCount} results`
              : `${data?.totalCount} result`}
          </p>
        </div>
        {data?.jobs?.map((job) => (
          <motion.div variants={jobItemVariants} key={job.id}>
            <JobButton
              handleBookmarkClick={handleBookmarkClick}
              handleJobSelect={handleJobSelect}
              selected={searchParams.get("job") === job.id}
              job={{
                id: job.id,
                image: job.company.logoUrl || undefined,
                title: job.title,
                description: job.description,
                status: job.status,
                company: job.company.name,
                location: job.jobLocation.label,
                type: job.jobType.label,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {currentWidth > 1080 && searchParams.has("job") && (
          <motion.div
            className="w-2/3 px-5"
            variants={jobDetailsVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <JobDetails id={searchParams.get("job") || ""} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobSection;
