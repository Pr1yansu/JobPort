import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

type AddJobRequestType = InferRequestType<
  (typeof client.api.data.jobs.create.job)["$post"]
>["json"];
type AddJobResponseType = InferResponseType<
  (typeof client.api.data.jobs.create.job)["$post"]
>;

type AddJobTypeResponseType = InferResponseType<
  (typeof client.api.data.jobs.add.jobType)["$post"]
>;
type AddJobTypeRequestType = InferRequestType<
  (typeof client.api.data.jobs.add.jobType)["$post"]
>["json"];

type getJobPostedDateResponseType = InferResponseType<
  (typeof client.api.data.jobs.get.posted.date)["$get"]
>;

type getJobTypesResponseType = InferResponseType<
  (typeof client.api.data.jobs.jobTypes)["$get"]
>;
type getJobResponseType = InferResponseType<
  (typeof client.api.data.jobs)["$get"]
>;
type getJobDetailsResponseType = InferResponseType<
  (typeof client.api.data.jobs)[":id"]["$get"]
>;
type ApplyJobResponseType = InferResponseType<
  (typeof client.api.data.jobs.apply)[":id"]["$patch"]
>;
type ApplyJobRequestType = InferRequestType<
  (typeof client.api.data.jobs.apply)[":id"]["$patch"]
>["param"];
type getApplicantsResponseType = InferResponseType<
  (typeof client.api.data.jobs.get.all.applicants)["$get"]
>;

export const useAddJob = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AddJobResponseType, Error, AddJobRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.create.job["$post"]({ json });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["jobs"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        return toast.error(error.errors[0].message);
      }
      toast.error(error.message);
    },
  });

  return mutation;
};

export const useGetJobTypes = () => {
  const query = useQuery<getJobTypesResponseType, Error>({
    queryKey: ["jobTypes"],
    queryFn: async () => {
      const response = await client.api.data.jobs.jobTypes["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useAddJobType = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    AddJobTypeResponseType,
    Error,
    AddJobTypeRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.add.jobType["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["jobTypes"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        return toast.error(error.errors[0].message);
      }
      toast.error(error.message);
    },
  });

  return mutation;
};

export const useGetJob = () => {
  const params = useSearchParams();

  const postedDate = params.get("jpd") || "";
  const jobType = params.get("jt") || "";
  const jobLocation = params.get("jl") || "";
  const search = params.get("query") || "";
  const companyId = params.get("cid") || "";
  const experienceLevel = params.get("jel") || "";
  const jobStatus = params.get("js") || undefined;

  const nextDay = postedDate ? new Date(postedDate) : new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  const query = useQuery<getJobResponseType, Error>({
    queryKey: [
      "jobs",
      postedDate,
      jobType,
      jobLocation,
      search,
      experienceLevel,
      companyId,
      jobStatus,
    ],
    queryFn: async () => {
      const response = await client.api.data.jobs.$get({
        query: {
          companyId: companyId,
          experienceLevelId: experienceLevel,
          jobTypeId: jobType,
          query: search,
          status: jobStatus,
          postedDate: format(new Date(nextDay), "yyyy-MM-dd"),
        },
      });

      return await response.json();
    },
  });

  return query;
};

export const useGetJobPostedDate = () => {
  const query = useQuery<getJobPostedDateResponseType, Error>({
    queryKey: ["jobPostedDate"],
    queryFn: async () => {
      const response = await client.api.data.jobs.get.posted.date["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useGetJobDetails = (id: string) => {
  const query = useQuery<getJobDetailsResponseType, Error>({
    queryKey: ["jobDetails", id],
    queryFn: async () => {
      const response = await client.api.data.jobs[":id"].$get({
        param: {
          id,
        },
      });
      return await response.json();
    },
  });

  return query;
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ApplyJobResponseType,
    Error,
    ApplyJobRequestType
  >({
    mutationFn: async (param) => {
      const response = await client.api.data.jobs.apply[":id"]["$patch"]({
        param,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["jobDetails"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        return toast.error(error.errors[0].message);
      }
      toast.error(error.message);
    },
  });

  return mutation;
};

export const useGetApplicants = () => {
  const query = useQuery<getApplicantsResponseType, Error>({
    queryKey: ["applicants"],
    queryFn: async () => {
      const response = await client.api.data.jobs.get.all.applicants["$get"]();
      return await response.json();
    },
  });

  return query;
};
