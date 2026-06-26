"use client";

import React, { useState } from "react";
import { useGetPostedJobs } from "@/features/jobs/api/use-job";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatDate } from "date-fns";
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  MapPin,
  Users,
  Search,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const PostedJobsPage = () => {
  const { data, isPending } = useGetPostedJobs();
  const [searchTerm, setSearchTerm] = useState("");

  const jobs = data?.jobs || [];
  const filteredJobs = jobs.filter((job: any) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Manage Posted Jobs</h1>
          <p className="text-zinc-500 mt-1">Monitor active listings, track candidate applications, and manage recruitment lifecycles.</p>
        </div>
        <Link href="/dashboard/post-job">
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center gap-2">
            <PlusCircle className="size-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-zinc-200 shadow-sm bg-white/80 backdrop-blur-lg">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4" />
            <Input
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-zinc-300 focus-visible:ring-zinc-500 w-full"
            />
          </div>
          <div className="text-sm font-medium text-zinc-500 w-full sm:w-auto text-right">
            Total Postings: <span className="text-zinc-900 font-bold">{jobs.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isPending ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-zinc-200 bg-zinc-50/50 h-36"></Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-zinc-200 bg-white/80 backdrop-blur-lg py-16 text-center shadow-sm">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-zinc-100 rounded-full text-zinc-500">
              <BriefcaseBusiness className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">No job postings found</h3>
            <p className="text-zinc-500 max-w-sm text-sm">
              {searchTerm ? "No results match your search filter. Try adjusting your keywords." : "You haven't posted any jobs yet. Create your first listing to start hiring top talent."}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/post-job">
                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold mt-2">
                  Create First Posting
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any) => (
            <Card key={job.id} className="border-zinc-200 hover:border-zinc-300 bg-white/80 backdrop-blur-lg shadow-sm hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Job Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      {job.jobType?.name || "Full-time"}
                    </Badge>
                    <Badge className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${job.status === 'CLOSED' ? 'bg-zinc-100 text-zinc-600 border border-zinc-200' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'}`}>
                      {job.status || "OPEN"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors duration-200">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mt-2">
                      <span className="flex items-center gap-1 font-medium text-zinc-700">
                        <Building2 className="size-4 text-zinc-400" /> {job.company?.name || "Company"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4 text-zinc-400" /> {job.jobLocation?.name || "Remote / Onsite"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4 text-zinc-400" /> Posted {job.postedDate ? formatDate(new Date(job.postedDate), "MMM dd, yyyy") : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Applications & Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 min-w-40 justify-center">
                    <Users className="size-5 text-zinc-500" />
                    <div>
                      <div className="text-lg font-bold text-zinc-900">{job.applicants?.length || 0}</div>
                      <div className="text-xs text-zinc-500 font-medium">Total Applicants</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link href={`/dashboard/jobs/${job.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full text-zinc-700 border-zinc-300 hover:bg-zinc-50 font-semibold flex items-center gap-1.5">
                        <ExternalLink className="size-3.5" /> View Listing
                      </Button>
                    </Link>
                    <Link href="/dashboard/applicants" className="w-full sm:w-auto">
                      <Button size="sm" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold flex items-center gap-1">
                        Review <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedJobsPage;
