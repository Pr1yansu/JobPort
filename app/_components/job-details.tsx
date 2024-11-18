"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useApplyJob, useGetJobDetails } from "@/features/jobs/api/use-job";
import { useBookmark } from "@/hooks/use-bookmark";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney } from "@/utils/date-money";
import { ArrowLeftCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { JobStatus } from "./job-status";

interface JobDetailsProps {
  id: string;
}

const JobDetails = ({ id }: JobDetailsProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { addBookmark, bookmarks, removeBookmark } = useBookmark();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useApplyJob();
  const [currentWidth, setCurrentWidth] = React.useState<number>();
  const {
    data: jobDetails,
    isPending: jobDetailsPending,
    refetch: refetchJobDetails,
  } = useGetJobDetails(id);

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

  const job = useMemo(() => jobDetails?.job, [jobDetails]);

  if (jobDetailsPending) {
    return <JobStatus status="loading" />;
  }

  if (!jobDetails || !jobDetails.job) {
    return <JobStatus status="not-found" onRetry={() => refetchJobDetails()} />;
  }

  if (!userId) return;

  return (
    <div
      className={cn(
        "relative",
        pathname.includes(id) ? "p-5" : "sticky top-20 "
      )}
    >
      <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute top-2 right-2"
        onClick={() => {
          router.push("/dashboard/jobs");
        }}
      >
        <ArrowLeftCircle size={24} />
      </Button>
      <h3>{job?.title}</h3>
      <div className="flex items-center gap-2 mt-2">
        <Avatar>
          <AvatarImage
            src={job?.company.logoUrl || undefined}
            alt={job?.company.logoUrl || undefined}
          />
          <AvatarFallback>
            {job?.company ? job.company.name[0] + job.company.name[1] : "CN"}
          </AvatarFallback>
        </Avatar>
        <h5 className="text-sm font-semibold capitalize">
          {job?.company.name}{" "}
          {job?.company.address && `(${job?.company.address})`}
        </h5>
      </div>
      <p
        className={cn(
          "text-muted-foreground text-xs capitalize flex items-center gap-2 mt-2"
        )}
      >
        Posted on {formatDate(job?.postedDate)} expires on{" "}
        {formatDate(job?.deadline)}
      </p>
      <div>
        <h5 className="text-sm font-semibold capitalize mt-2">
          {job?.jobLocation.label}
        </h5>
        {job?.jobLocation.description && (
          <p className="text-muted-foreground text-xs capitalize">
            {job?.jobLocation.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
          <h5>Salary :</h5>
          <p className="text-muted-foreground text-xs capitalize">
            {formatMoney(job?.salary, job?.currencyType)}/mos
          </p>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground mt-2"
        )}
      >
        <Button
          size="sm"
          variant={job?.status === "OPEN" ? "default" : "outline"}
          disabled={job?.status !== "OPEN" || job?.applicants?.includes(userId)}
          onClick={() => {
            if (job?.applicants?.includes(userId)) return;
            mutate(
              {
                id: job?.id || "",
              },
              {
                onSuccess: () => {
                  router.push("/dashboard/jobs");
                },
              }
            );
          }}
        >
          {job?.applicants?.includes(userId) ? "Applied" : "Apply"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            bookmarks.find((bookmark) => bookmark.id === job?.id)
              ? removeBookmark(job?.id || "")
              : addBookmark({ id: job?.id || "" });
          }}
        >
          {bookmarks.find((bookmark) => bookmark.id === job?.id)
            ? "unsave job"
            : "save job"}
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 border rounded-md p-3 justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={job?.postedByUser.image || undefined}
              alt={job?.postedByUser.name || undefined}
            />
            <AvatarFallback>
              {job?.postedByUser.name?.split(" ").map((name) => name[0])}
            </AvatarFallback>
          </Avatar>
          <div>
            <h5 className="text-sm font-semibold">
              {job?.postedByUser.name || job?.postedByUser.email}
            </h5>
            <p className="text-muted-foreground text-xs capitalize">
              {job?.company.name}
            </p>
          </div>
        </div>
        {job?.status === "OPEN" && (
          <a href={`mailto:${job?.postedByUser.email}`}>
            <Button size="sm" variant="ghost">
              Send Message <Send size={16} />
            </Button>
          </a>
        )}
      </div>
      {job?.description && (
        <div className="rich-text mt-2">
          <div dangerouslySetInnerHTML={{ __html: job?.description }} />
        </div>
      )}
      <div className="border p-3 mt-2 relative">
        <Link href={`/dashboard/company/${job?.company.id}`}>
          <Button size="sm" variant="ghost" className="absolute top-2 right-2">
            View page
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Avatar>
            <AvatarImage
              src={job?.company.logoUrl || undefined}
              alt={job?.company.name || undefined}
            />
            <AvatarFallback>
              {job?.company.name
                ? job.company.name[0] + job.company.name[1]
                : "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <h5 className="text-sm font-semibold capitalize">
              {job?.company.name}
            </h5>
            <p className="text-muted-foreground text-xs capitalize">
              {job?.company.address} {job?.company.website}
            </p>
          </div>
          <p className="text-muted-foreground text-xs capitalize">
            {job?.company.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
