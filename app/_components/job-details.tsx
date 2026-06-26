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
  const userId = session?.user?.id || session?.user?.email || "guest_user";
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
    if (currentWidth > 768) {
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

  const allApplicantsIds =
    job?.applicants?.map((applicant) => applicant.user?.id || "") ?? [];

  return (
    <div
      className={cn(
        "relative bg-white border border-zinc-200 shadow-xl rounded-2xl p-6 sm:p-8 backdrop-blur-lg mb-8 transition-all duration-200",
        pathname.includes(id) ? "mt-4" : "sticky top-20"
      )}
    >
      <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-all duration-200"
        onClick={() => {
          router.push("/dashboard/jobs");
        }}
      >
        <ArrowLeftCircle size={24} />
      </Button>
      
      <div className="flex flex-col gap-4">
        {/* Title & Status Badge */}
        <div className="pr-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
            {job?.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${job?.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
              {job?.status || "OPEN"}
            </span>
            <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {job?.jobType?.label || "Full-time"}
            </span>
          </div>
        </div>

        {/* Company Info */}
        <div className="flex items-center gap-3 bg-zinc-50/80 border border-zinc-200/80 p-4 rounded-xl mt-2">
          <Avatar className="size-12 border border-zinc-200 shadow-sm">
            <AvatarImage
              src={job?.company?.logoUrl || undefined}
              alt={job?.company?.name || undefined}
            />
            <AvatarFallback className="font-bold bg-zinc-200 text-zinc-800">
              {job?.company?.name ? job.company.name.slice(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h5 className="text-base font-bold text-zinc-900 truncate capitalize">
              {job?.company?.name}{" "}
              {job?.company?.address && <span className="text-sm font-medium text-zinc-500">({job?.company.address})</span>}
            </h5>
            <p className="text-zinc-500 text-xs mt-0.5 capitalize flex items-center gap-2">
              Posted {formatDate(job?.postedDate)} • Expires {formatDate(job?.deadline)}
            </p>
          </div>
        </div>

        {/* Job Location & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl shadow-lg mt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Location</span>
            <h5 className="text-lg font-bold capitalize mt-1 text-white">
              {job?.jobLocation?.label || "Onsite / Remote"}
            </h5>
            {job?.jobLocation?.description && (
              <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                {job?.jobLocation.description}
              </p>
            )}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Salary</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {formatMoney(job?.salary, job?.currencyType)}
              <span className="text-xs font-medium text-zinc-300 ml-1">/mos</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-200">
          <Button
            size="lg"
            className={`flex-1 font-bold shadow-xl transition-all duration-200 rounded-xl py-6 ${job?.status === "OPEN" ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 active:scale-95" : "bg-zinc-200 text-zinc-500 cursor-not-allowed"}`}
            disabled={job?.status !== "OPEN" || allApplicantsIds.includes(userId)}
            onClick={() => {
              if (allApplicantsIds.includes(userId)) return;
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
            {allApplicantsIds.includes(userId) ? "✓ Successfully Applied" : "Apply Now"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-50 hover:border-zinc-400 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 rounded-xl py-6 px-6"
            onClick={() => {
              bookmarks.find((bookmark) => bookmark.id === job?.id)
                ? removeBookmark(job?.id || "")
                : addBookmark({ id: job?.id || "" });
            }}
          >
            {bookmarks.find((bookmark) => bookmark.id === job?.id)
              ? "★ Saved Job"
              : "☆ Save Job"}
          </Button>
        </div>

        {/* Posted By Recruiter */}
        <div className="flex items-center gap-4 border border-zinc-200 bg-zinc-50/50 rounded-xl p-4 justify-between mt-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-zinc-200 shadow-sm">
              <AvatarImage
                src={job?.postedByUser?.image || undefined}
                alt={job?.postedByUser?.name || undefined}
              />
              <AvatarFallback className="bg-zinc-900 text-white font-bold text-xs">
                {job?.postedByUser?.name?.split(" ").map((name: string) => name[0]).join("") || "RC"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h5 className="text-sm font-bold text-zinc-900">
                {job?.postedByUser?.name || job?.postedByUser?.email}
              </h5>
              <p className="text-zinc-500 text-xs capitalize font-medium">
                Hiring Team • {job?.company?.name}
              </p>
            </div>
          </div>
          {job?.status === "OPEN" && job?.postedByUser?.email && (
            <a href={`mailto:${job?.postedByUser.email}`}>
              <Button size="sm" variant="ghost" className="text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 font-semibold rounded-lg flex items-center gap-2 px-3 py-2 transition-all duration-200">
                Send Message <Send size={16} className="text-zinc-500" />
              </Button>
            </a>
          )}
        </div>

        {/* Job Description */}
        {job?.description && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <h4 className="text-lg font-bold text-zinc-900 mb-4 tracking-tight">Job Description & Requirements</h4>
            <div className="rich-text text-zinc-700 prose prose-zinc max-w-none leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: job?.description }} />
            </div>
          </div>
        )}

        {/* Company Footer Card */}
        <div className="border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 rounded-2xl mt-6 relative shadow-sm hover:shadow-md transition-shadow duration-200">
          <Link href={`/dashboard/company/${job?.company?.id}`}>
            <Button size="sm" variant="outline" className="absolute top-6 right-6 font-semibold border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-xl">
              View Company
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="size-16 border border-zinc-200 shadow-md">
              <AvatarImage
                src={job?.company?.logoUrl || undefined}
                alt={job?.company?.name || undefined}
              />
              <AvatarFallback className="font-extrabold text-lg bg-zinc-900 text-white">
                {job?.company?.name ? job.company.name.slice(0, 2).toUpperCase() : "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 pr-28 sm:pr-32">
              <h5 className="text-lg font-bold text-zinc-900 capitalize tracking-tight">
                {job?.company?.name}
              </h5>
              <p className="text-zinc-500 text-xs capitalize font-medium">
                {job?.company?.address} {job?.company?.website && `• ${job.company.website}`}
              </p>
              <p className="text-zinc-600 text-sm mt-2 line-clamp-3 leading-relaxed">
                {job?.company?.description || "High-growth company dedicated to building world-class technology solutions and empowering top talent globally."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
