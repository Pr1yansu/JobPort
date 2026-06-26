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
  Sparkles,
  Zap,
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
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Manage Posted Jobs</h1>
          <p className="text-zinc-500 mt-1 text-base">Monitor active listings, track candidate applications, and manage recruitment lifecycles.</p>
        </div>
        <Link href="/dashboard/post-job">
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-5 rounded-xl flex items-center gap-2">
            <PlusCircle className="size-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-zinc-200 shadow-md bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4" />
            <Input
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-zinc-300 focus-visible:ring-zinc-500 w-full rounded-xl"
            />
          </div>
          <div className="text-sm font-semibold text-zinc-500 w-full sm:w-auto text-right">
            Total Postings: <span className="text-zinc-900 font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">{jobs.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isPending ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-zinc-200 bg-zinc-50/50 h-36 rounded-2xl"></Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="space-y-8">
          <Card className="border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 backdrop-blur-xl py-16 text-center shadow-2xl rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <BriefcaseBusiness size={240} />
            </div>
            <CardContent className="flex flex-col items-center space-y-6 relative z-10">
              <div className="p-6 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl text-white shadow-2xl border border-zinc-700 hover:scale-110 transition-transform duration-200">
                <BriefcaseBusiness className="size-10" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight">No job postings found</h3>
                <p className="text-zinc-500 text-base leading-relaxed">
                  {searchTerm ? "No results match your search filter. Try adjusting your keywords." : "You haven't posted any jobs yet. Create your first listing to start hiring world-class talent with our advanced candidate tracking."}
                </p>
              </div>
              {!searchTerm && (
                <Link href="/dashboard/post-job">
                  <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 px-8 py-6 rounded-2xl text-base flex items-center gap-2 mt-2">
                    <Zap className="size-5 text-amber-400 fill-amber-400" /> Create First Posting
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick AI Starter Templates */}
          {!searchTerm && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Quick Starter Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/post-job">
                  <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-white group rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <Badge className="bg-blue-500/10 text-blue-700 border border-blue-500/20 mb-3 font-bold">Engineering</Badge>
                      <h4 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors duration-200">Senior Software Engineer</h4>
                      <p className="text-sm text-zinc-500 mt-2">Pre-configured template for full-stack & backend engineering roles.</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 mt-6 group-hover:translate-x-1 transition-transform duration-200">
                      Use Template <ChevronRight className="size-4 text-blue-600" />
                    </div>
                  </Card>
                </Link>

                <Link href="/dashboard/post-job">
                  <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-white group rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <Badge className="bg-purple-500/10 text-purple-700 border border-purple-500/20 mb-3 font-bold">Product</Badge>
                      <h4 className="text-lg font-bold text-zinc-900 group-hover:text-purple-600 transition-colors duration-200">Lead Product Manager</h4>
                      <p className="text-sm text-zinc-500 mt-2">Perfect for agile product leaders, strategists, and growth managers.</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 mt-6 group-hover:translate-x-1 transition-transform duration-200">
                      Use Template <ChevronRight className="size-4 text-purple-600" />
                    </div>
                  </Card>
                </Link>

                <Link href="/dashboard/post-job">
                  <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-white group rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 mb-3 font-bold">Design</Badge>
                      <h4 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors duration-200">Staff UI/UX Designer</h4>
                      <p className="text-sm text-zinc-500 mt-2">Designed for high-impact visual designers and user experience architects.</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 mt-6 group-hover:translate-x-1 transition-transform duration-200">
                      Use Template <ChevronRight className="size-4 text-emerald-600" />
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any) => (
            <Card key={job.id} className="border-zinc-200 hover:border-zinc-300 bg-white/80 backdrop-blur-lg shadow-sm hover:shadow-md transition-all duration-200 group rounded-2xl">
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
                      <Button variant="outline" size="sm" className="w-full text-zinc-700 border-zinc-300 hover:bg-zinc-50 font-semibold flex items-center gap-1.5 px-4 py-4 rounded-xl">
                        <ExternalLink className="size-3.5" /> View Listing
                      </Button>
                    </Link>
                    <Link href="/dashboard/applicants" className="w-full sm:w-auto">
                      <Button size="sm" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold flex items-center gap-1 px-5 py-4 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-200">
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
