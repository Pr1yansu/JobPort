"use client";

import { useState } from "react";
import {
  Search,
  Filter,
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
import React from "react";
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
import { mockApplicants, statusConfig } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

const ApplicantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(mockApplicants[0]);

  const filteredApplicants = mockApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: mockApplicants.length,
      PENDING: mockApplicants.filter((a) => a.status === "PENDING").length,
      APPROVED: mockApplicants.filter((a) => a.status === "APPROVED").length,
      REJECTED: mockApplicants.filter((a) => a.status === "REJECTED").length,
    };
  };

  const statusCounts = getStatusCounts();
  return (
    <div>
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Applicants List */}
        <div className="w-1/2 bg-white border-r border-gray-200 pr-6">
          <div className="py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Applicants
              </h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
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
                {filteredApplicants.map((applicant) => {
                  const StatusIcon = statusConfig[applicant.status].icon;
                  return (
                    <div
                      key={applicant.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 ${
                        selectedApplicant.id === applicant.id
                          ? "bg-blue-50 border-r-2 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={applicant.avatar || "/placeholder.svg"}
                              alt={applicant.name}
                            />
                            <AvatarFallback>
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {applicant.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {applicant.email}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Applied for {applicant.jobTitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={cn("")}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {applicant.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(
                              new Date(applicant.appliedDate),
                              "MMMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Applicant Details */}
        <div className="flex-1 bg-white">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={selectedApplicant.avatar || "/placeholder.svg"}
                    alt={selectedApplicant.name}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedApplicant.name
                      .split(" ")
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
                    <DropdownMenuItem>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="w-4 h-4 mr-2 text-red-600" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const StatusIcon =
                      statusConfig[selectedApplicant.status].icon;
                    return (
                      <Badge className={cn("")}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {selectedApplicant.status}
                      </Badge>
                    );
                  })()}
                  <span className="text-sm text-gray-500">
                    Applied on{" "}
                    {formatDate(
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
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedApplicant.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedApplicant.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Details</CardTitle>
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
                  {selectedApplicant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Application
              </Button>
              <Button variant="outline" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
