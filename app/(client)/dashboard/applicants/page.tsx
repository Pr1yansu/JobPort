"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApplicants } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useGetApplicants, useUpdateApplicantStatus } from "@/features/jobs/api/use-job";

// Define status config with all possible status values
const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  APPROVED: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  REJECTED: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  APPLIED: {
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  INTERVIEWED: {
    color: "bg-purple-100 text-purple-800",
    icon: Briefcase,
  },
  OFFERED: {
    color: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle,
  },
} as const;

type StatusKey = keyof typeof statusConfig;

interface Applicant {
  id: string | null;
  name: string | null;
  email: string | null;
  phone?: string | null;
  avatar: string | null;
  jobTitle: string | null;
  company: string | null;
  appliedDate: string | null;
  status: StatusKey | null;
  experience: string | null;
  location: string | null;
  skills: string[] | null;
  resumeUrl: string | null;
}

const ApplicantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey | "all">("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const { data, isPending } = useGetApplicants();
  const updateStatus = useUpdateApplicantStatus();

  const handleStatusUpdate = (status: "APPROVED" | "INTERVIEWED" | "OFFERED" | "REJECTED") => {
    if (!selectedApplicant?.id) return;
    updateStatus.mutate({
      param: { id: selectedApplicant.id },
      json: { status: status as any },
    }, {
      onSuccess: () => {
        setSelectedApplicant((prev: any) => prev ? { ...prev, status } : null);
      }
    });
  };

  const applicants = data?.applicants?.length ? data.applicants : mockApplicants;

  useEffect(() => {
    if (!selectedApplicant && applicants.length > 0) {
      setSelectedApplicant(applicants[0]);
    }
  }, [applicants, selectedApplicant]);

  const filteredApplicants = applicants.filter((applicant: Applicant) => {
    const matchesSearch =
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter || (statusFilter === "APPROVED" && applicant.status === "OFFERED");
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {
      all: applicants.length,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      APPLIED: 0,
      INTERVIEWED: 0,
      OFFERED: 0,
    };

    applicants.forEach((a: Applicant) => {
      if (a.status && counts[a.status] !== undefined) {
        counts[a.status]++;
      }
    });

    counts.APPROVED += counts.OFFERED;

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4">
          <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
          <div className="w-full h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!selectedApplicant && filteredApplicants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No applicants found</h2>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  const getSafeStatus = (status: StatusKey | null): StatusKey => {
    return status && status in statusConfig ? status : "PENDING";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex gap-6 mt-4">
        {/* Applicants List */}
        <div className="w-[45%] flex flex-col pr-2">
          <div className="pb-4 border-b border-zinc-200/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Applicants
              </h2>
            </div>

            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search applicants by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl bg-zinc-50 border-zinc-200/60 h-11"
              />
            </div>
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as StatusKey | "all")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 my-4">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="PENDING">
                Pending ({statusCounts.PENDING})
              </TabsTrigger>
              <TabsTrigger value="APPROVED">
                Approved ({statusCounts.APPROVED})
              </TabsTrigger>
              <TabsTrigger value="REJECTED">
                Rejected ({statusCounts.REJECTED})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="mt-0">
              <div className="divide-y divide-gray-200">
                {filteredApplicants.map((applicant: Applicant) => {
                  const status = getSafeStatus(applicant.status);
                  const { icon: StatusIcon, color } = statusConfig[status];

                  return (
                    <button
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl transition-all duration-200 border border-transparent flex items-start space-x-4",
                        selectedApplicant?.id === applicant.id
                          ? "bg-blue-600/5 border-blue-600/20 shadow-sm ring-1 ring-blue-600/10"
                          : "hover:bg-zinc-50 hover:border-zinc-200/50 hover:shadow-sm"
                      )}
                    >
                      <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                        <AvatarImage src={applicant.avatar || ""} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold">
                          {applicant.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-zinc-900 truncate">
                            {applicant.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-2 py-0.5",
                              statusConfig[getSafeStatus(applicant.status)].color
                            )}
                          >
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {applicant.status || "PENDING"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 truncate mt-0.5">
                          {applicant.email}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1.5">
                          <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-600 font-semibold">{applicant.jobTitle}</span>
                          <span>•</span>
                          <span>{applicant.appliedDate ? formatDate(new Date(applicant.appliedDate), "MMM dd, yyyy") : ""}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Applicant Details */}
        <div className="w-[55%] flex flex-col h-full pl-2">
          {selectedApplicant ? (
            <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-zinc-100 to-zinc-50"></div>
                <div className="relative flex items-end gap-6 pt-12">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md ring-1 ring-zinc-200/50">
                    <AvatarImage
                      src={selectedApplicant.avatar || "/placeholder.svg"}
                      alt={selectedApplicant.name || "Applicant"}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedApplicant.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedApplicant.name}
                    </h3>
                    <p className="text-gray-600">
                      Applied for
                      <span className="font-semibold text-black ps-1">
                        {selectedApplicant.jobTitle}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusUpdate("OFFERED")}>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Approve / Offer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate("INTERVIEWED")}>
                        <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                        Mark Interviewed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate("REJECTED")}>
                        <XCircle className="w-4 h-4 mr-2 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${selectedApplicant.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const status = getSafeStatus(selectedApplicant.status);
                      const { icon: StatusIcon, color } = statusConfig[status];
                      return (
                        <Badge className={cn(color)}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {status}
                        </Badge>
                      );
                    })()}
                    <span className="text-sm text-gray-500">
                      Applied on{" "}
                      {selectedApplicant.appliedDate &&
                        formatDate(
                          new Date(selectedApplicant.appliedDate),
                          "MMMM dd, yyyy"
                        )}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedApplicant.email}</span>
                  </div>
                  {selectedApplicant.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedApplicant.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedApplicant.location}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedApplicant.experience} of experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Applied for {selectedApplicant.jobTitle} at{" "}
                      {selectedApplicant.company}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate("APPROVED")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-200 text-red-700 hover:bg-red-50 font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate("REJECTED")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                <Button variant="outline" onClick={() => window.location.href = `mailto:${selectedApplicant.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
