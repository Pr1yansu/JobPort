"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { jobSchema } from "@/schema/job-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { useConfirm } from "@/hooks/use-confirm";
import {
  useAddCompany,
  useGetCompanies,
} from "@/features/jobs/api/use-company";
import {
  useAddJob,
  useAddJobType,
  useGetJobTypes,
} from "@/features/jobs/api/use-job";
import {
  useAddJobLocation,
  useGetJobLocations,
} from "@/features/jobs/api/use-job-location";
import {
  useAddExperienceLevel,
  useGetExperienceLevels,
} from "@/features/jobs/api/use-experience-level";
import { Loader2, SendHorizonalIcon } from "lucide-react";
import { useAddSkill, useGetSkills } from "@/features/jobs/api/use-skills";
import RichTextEditor from "@/components/rich-text-editor";

const CustomSelect = dynamic(() => import("@/components/custom-select"), {
  ssr: false,
  loading: () => <Loader2 className="w-8 h-8 animate-spin" />,
});

const PostJobForm = () => {
  const { mutate: addCompany, isPending: isCompanyPending } = useAddCompany();
  const { mutate: addJobType, isPending: isJobTypePending } = useAddJobType();
  const { mutate: addJobLocation, isPending: isJobLocationPending } =
    useAddJobLocation();
  const { mutate: addExperienceLevel, isPending: isExperiencePending } =
    useAddExperienceLevel();
  const { mutate: addSkill, isPending: isSkillsPending } = useAddSkill();
  const { mutate: addJob, isPending: isJobPending } = useAddJob();

  const { data: companyData, isPending: isCompaniesLoading } =
    useGetCompanies();
  const { data: jobTypeData, isPending: isJobTypesLoading } = useGetJobTypes();
  const { data: jobLocationData, isPending: isJobLocationsLoading } =
    useGetJobLocations();
  const { data: experienceLevelData, isPending: isExperienceLevelsLoading } =
    useGetExperienceLevels();
  const { data: skillData, isPending: isSkillsLoading } = useGetSkills();

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to create the company?",
    "You have not uploaded an image please confirm if you really want it to be created without an image"
  );
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyId: "",
      currencyType: "USD",
      deadline: "",
      description: "",
      experienceLevelId: "",
      jobLocationId: "",
      jobTypeId: "",
      skillIds: "",
      salary: 0,
      status: "OPEN",
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof jobSchema>) {
    addJob(values, {
      onSuccess: async () => {
        await form.reset();
      },
    });
  }

  const companiesOptions = React.useMemo(() => {
    return companyData?.companies?.map((company) => ({
      label: company.name,
      value: company.id,
      image: company.logoUrl,
    }));
  }, [companyData]);

  const jobTypesOptions = React.useMemo(() => {
    return jobTypeData?.jobTypes?.map((jobType) => ({
      label: jobType.label,
      value: jobType.id,
    }));
  }, [jobTypeData]);

  const jobLocationsOptions = React.useMemo(() => {
    return jobLocationData?.jobLocations?.map((jobLocation) => ({
      label: jobLocation.label,
      value: jobLocation.id,
    }));
  }, [jobLocationData]);

  const experienceLevelsOptions = React.useMemo(() => {
    return experienceLevelData?.experienceLevels?.map((experienceLevel) => ({
      label: experienceLevel.label,
      value: experienceLevel.id,
    }));
  }, [experienceLevelData]);

  const skillsOptions = React.useMemo(() => {
    return skillData?.skills?.map((skill) => ({
      label: skill.label,
      value: skill.id,
    }));
  }, [skillData]);

  if (
    isCompaniesLoading ||
    isJobTypesLoading ||
    isJobLocationsLoading ||
    isExperienceLevelsLoading ||
    isSkillsLoading
  ) {
    return (
      <div className="flex justify-center items-center  h-[calc(100vh-24rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-5xl mx-auto bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden transition-all">
        <CardHeader className="bg-white border-b border-zinc-200 px-8 py-6">
          <CardTitle className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <span>Role Specifications & Requisition Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Job Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 px-4 rounded-lg bg-white border border-zinc-200 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors"
                          placeholder="e.g. Senior Full-Stack Engineer"
                          disabled={isJobPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Monthly Salary <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 px-4 rounded-lg bg-white border border-zinc-200 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors"
                          placeholder="Enter monthly base salary"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value)
                            )
                          }
                          value={field.value}
                          disabled={isJobPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                      Job Description & Responsibilities <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-white transition-colors">
                        <RichTextEditor
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="jobTypeId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Employment Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                          <CustomSelect
                            onChange={field.onChange}
                            options={jobTypesOptions}
                            placeholder="Select a job type"
                            onCreate={(e) => {
                              addJobType({ value: e, label: e });
                            }}
                            value={field.value}
                            disabled={isJobTypePending || isJobPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceLevelId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Experience Level <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                          <CustomSelect
                            onChange={field.onChange}
                            options={experienceLevelsOptions}
                            placeholder="Select an experience level"
                            onCreate={(e) => {
                              addExperienceLevel({ value: e, label: e });
                            }}
                            value={field.value}
                            disabled={isExperiencePending || isJobPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobLocationId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Job Location <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                          <CustomSelect
                            onChange={field.onChange}
                            options={jobLocationsOptions}
                            placeholder="Select a job location"
                            onCreate={(e) => {
                              addJobLocation({ value: e, label: e });
                            }}
                            value={field.value}
                            disabled={isJobLocationPending || isJobPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                      Hiring Organization / Company <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                        <CustomSelect
                          imageUpload
                          onChange={field.onChange}
                          options={companiesOptions}
                          setLogoUrl={setLogoUrl}
                          placeholder="Select a company"
                          onCreate={async (e) => {
                            if (!logoUrl) {
                              const isConfirmed = await confirm();
                              if (isConfirmed) {
                                addCompany({
                                  name: e.toLowerCase().replace(/\s/g, "-"),
                                });
                              }
                            } else {
                              addCompany({
                                name: e.toLowerCase().replace(/\s/g, "-"),
                                logoUrl,
                              });
                            }
                          }}
                          onUpload={setLogoUrl}
                          value={field.value}
                          uploadValue={logoUrl}
                          disabled={isCompanyPending || isJobPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Application Deadline <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                          <DatePicker
                            onChange={field.onChange}
                            value={field.value}
                            disabled={{ before: new Date() }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currencyType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                        Currency Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isJobPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 px-4 rounded-lg bg-white border border-zinc-200 text-base shadow-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-lg border-zinc-200 shadow-lg bg-white">
                          {["USD", "EUR", "GBP", "NGN", "INR"].map(
                            (currency) => (
                              <SelectItem key={currency} value={currency} className="rounded-md py-2 cursor-pointer hover:bg-zinc-100">
                                {currency}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skillIds"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-zinc-800 tracking-tight">
                      Required Skill Sets <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="rounded-lg shadow-sm border border-zinc-200 bg-white focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-colors">
                        <CustomSelect
                          onChange={field.onChange}
                          options={skillsOptions}
                          placeholder="Select multiple skill sets"
                          onCreate={(e) => {
                            addSkill({
                              label: e,
                              value: e.toLowerCase().replace(/\s/g, "-"),
                            });
                          }}
                          value={field.value}
                          disabled={isSkillsPending || isJobPending}
                          multiple
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-base shadow-sm transition-all rounded-lg flex items-center justify-center gap-2"
                  disabled={isJobPending}
                >
                  <span>Publish Job Opportunity</span>
                  <SendHorizonalIcon className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <ConfirmDialog />
      </Card>
    </>
  );
};

export default PostJobForm;
