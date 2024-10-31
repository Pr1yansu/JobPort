"use client";
import React, { useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import FilterPopover from "./filter-popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetJobTypes } from "@/features/jobs/api/use-job";
import { useGetExperienceLevels } from "@/features/jobs/api/use-experience-level";
import { useGetJobLocations } from "@/features/jobs/api/use-job-location";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { useGetCompanies } from "@/features/jobs/api/use-company";

export interface FilterOption {
  value: string;
  label: string;
}

const JobHeader: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [posted, setPosted] = useState<Date>(new Date());
  const [jobType, setJobType] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const { data: JobTypesData, isPending: jobTypePending } = useGetJobTypes();
  const { data: ExperienceLevelsData, isPending: experiencePending } =
    useGetExperienceLevels();
  const { data: JobDestinationsData, isPending: destinationPending } =
    useGetJobLocations();
  const { data: CompaniesData, isPending: companyPending } = useGetCompanies();

  const JobTypes = useMemo(() => {
    return (
      JobTypesData?.jobTypes.map((type) => ({
        value: type.id,
        label: type.label,
      })) || []
    );
  }, [JobTypesData]);

  const ExperienceLevels = useMemo(() => {
    return (
      ExperienceLevelsData?.experienceLevels.map((level) => ({
        value: level.id,
        label: level.label,
      })) || []
    );
  }, [ExperienceLevelsData]);

  const JobDestinations = useMemo(() => {
    return (
      JobDestinationsData?.jobLocations.map((location) => ({
        value: location.id,
        label: location.label,
      })) || []
    );
  }, [JobDestinationsData]);

  const Companies = useMemo(() => {
    return (
      CompaniesData?.companies.map((company) => ({
        value: company.id,
        label: company.name,
      })) || []
    );
  }, [CompaniesData]);

  if (
    jobTypePending ||
    experiencePending ||
    destinationPending ||
    companyPending
  ) {
    return (
      <div className="flex gap-2 items-center py-4 mt-2 flex-wrap border-b sticky top-0 bg-white z-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton className="h-8 w-32" key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center py-4 mt-2 flex-wrap border-b sticky top-0 bg-white z-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button disabled={false} variant="outline">
            <span>{format(posted, "dd MMM yyyy")}</span>

            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 lg:w-auto" align="start">
          <Calendar
            disabled={false}
            initialFocus
            mode="single"
            numberOfMonths={2}
            selected={posted}
            onSelect={(date) => {
              if (date) setPosted(date);
            }}
          />

          <div className="flex w-full items-center gap-x-2 p-4">
            <PopoverClose asChild>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setPosted(new Date())}
              >
                Reset
              </Button>
            </PopoverClose>

            <PopoverClose asChild>
              <Button
                className="w-full"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("jpd", `${format(posted, "yyyy-MM-dd")}`);
                  replace(`${pathname}?${params.toString()}`);
                }}
              >
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <FilterPopover
        label="Job type"
        options={JobTypes}
        selected={jobType}
        onSelect={setJobType}
        paramPlaceholder="jt"
      />
      <FilterPopover
        label="Experience level"
        options={ExperienceLevels}
        selected={experience}
        onSelect={setExperience}
        paramPlaceholder="jel"
      />
      <FilterPopover
        label="Location"
        options={JobDestinations}
        selected={destination}
        onSelect={setDestination}
        paramPlaceholder="jl"
      />
      <FilterPopover
        label="Company name"
        options={Companies}
        selected={company}
        onSelect={setCompany}
        paramPlaceholder="cid"
      />
    </div>
  );
};

export default JobHeader;
