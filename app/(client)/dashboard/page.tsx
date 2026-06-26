import React from "react";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CircleFadingPlus,
  FileUser,
  Star,
  UserPen,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Bookmark,
  Award,
} from "lucide-react";

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-8 text-white shadow-2xl border border-zinc-700/50 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={180} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-zinc-700/80 text-zinc-100 backdrop-blur-md border border-zinc-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {user.role} Dashboard
            </Badge>
            {user.premium && (
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" /> Premium Member
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Welcome back, {user.name || user.email?.split("@")[0]}!
          </h1>
          <p className="mt-4 text-zinc-300 text-base sm:text-lg font-normal leading-relaxed">
            {user.role === "USER" && "Explore personalized job matches, optimize your AI resume, and track your career growth."}
            {user.role === "RECRUITER" && "Manage your job postings, track top talent applications, and expand your company reach."}
            {user.role === "ADMIN" && "Oversee platform operations, manage user accounts, and monitor system metrics."}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {user.role === "USER" && (
              <>
                <Link href="/dashboard/jobs">
                  <Button className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-5 text-sm rounded-xl flex items-center gap-2">
                    Explore Jobs <ArrowRight className="size-4 text-zinc-900" />
                  </Button>
                </Link>
                <Link href="/dashboard/resume">
                  <Button variant="outline" className="text-white border-zinc-500 bg-white/5 hover:bg-white/15 hover:border-zinc-300 hover:text-white font-semibold backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-5 text-sm rounded-xl flex items-center gap-2">
                    <FileUser className="size-4 text-zinc-300" /> Manage Resume
                  </Button>
                </Link>
              </>
            )}
            {(user.role === "RECRUITER" || user.role === "ADMIN") && (
              <>
                <Link href="/dashboard/post-job">
                  <Button className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-5 text-sm rounded-xl flex items-center gap-2">
                    <CircleFadingPlus className="size-4 text-zinc-900" /> Post New Job
                  </Button>
                </Link>
                <Link href="/dashboard/applicants">
                  <Button variant="outline" className="text-white border-zinc-500 bg-white/5 hover:bg-white/15 hover:border-zinc-300 hover:text-white font-semibold backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-5 text-sm rounded-xl flex items-center gap-2">
                    <UserPen className="size-4 text-zinc-300" /> Review Applicants
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === "USER" ? (
          <>
            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Applied Jobs</CardTitle>
                <BriefcaseBusiness className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">12</div>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" /> +3 this week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Saved Jobs</CardTitle>
                <Bookmark className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">8</div>
                <p className="text-xs text-zinc-500 mt-1">Ready for application</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Resume Score</CardTitle>
                <Award className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">94%</div>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <Sparkles className="size-3" /> Optimized by AI
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Account Tier</CardTitle>
                <Star className="size-5 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">{user.premium ? "Premium" : "Free"}</div>
                <p className="text-xs text-zinc-500 mt-1">{user.premium ? "Access to all AI tools" : "Upgrade for AI suggestions"}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Active Postings</CardTitle>
                <CalendarCheck2 className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">5</div>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" /> Live on JobPort
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Total Applicants</CardTitle>
                <UserPen className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">48</div>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" /> +12 new this week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Companies Managed</CardTitle>
                <Building2 className="size-5 text-zinc-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">2</div>
                <p className="text-xs text-zinc-500 mt-1">Approved status</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 bg-white/70 backdrop-blur-lg group hover:border-zinc-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500">Recruitment Tier</CardTitle>
                <Award className="size-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">{user.role}</div>
                <p className="text-xs text-zinc-500 mt-1">Verified Partner</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Section Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Quick Action Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === "USER" ? (
            <>
              <Link href="/dashboard/jobs">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-zinc-100 w-fit rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200 mb-2">
                      <BriefcaseBusiness className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">Browse Jobs</CardTitle>
                    <CardDescription className="text-zinc-600">Search through thousands of top opportunities tailored to your skill set.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/suggestions">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-amber-100 text-amber-700 w-fit rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200 mb-2">
                      <Sparkles className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">AI Job Swipe</CardTitle>
                    <CardDescription className="text-zinc-600">Use our premium Tinder-style job swipe experience to match instantly.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/resume">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-blue-100 text-blue-700 w-fit rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 mb-2">
                      <FileUser className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">Resume Builder</CardTitle>
                    <CardDescription className="text-zinc-600">Create, customize, and optimize your professional CV with Convex.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/post-job">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-zinc-100 w-fit rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200 mb-2">
                      <CircleFadingPlus className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">Create Posting</CardTitle>
                    <CardDescription className="text-zinc-600">Publish a new job listing with required skills, location, and compensation details.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/posted-jobs">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-emerald-100 text-emerald-700 w-fit rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 mb-2">
                      <CalendarCheck2 className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">Manage Posted Jobs</CardTitle>
                    <CardDescription className="text-zinc-600">Track active listings, update open/closed status, and monitor incoming applications.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/applicants">
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 group">
                  <CardHeader>
                    <div className="p-3 bg-purple-100 text-purple-700 w-fit rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200 mb-2">
                      <UserPen className="size-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">Review Candidates</CardTitle>
                    <CardDescription className="text-zinc-600">Screen applicant resumes, update interview/offer statuses, and hire top talent.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

