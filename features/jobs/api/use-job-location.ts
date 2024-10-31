import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";

type AddJobLocationResponseType = InferResponseType<
  (typeof client.api.data.jobs.add.jobLocation)["$post"]
>;
type AddJobLocationRequestType = InferRequestType<
  (typeof client.api.data.jobs.add.jobLocation)["$post"]
>["json"];

type getJobLocationsResponseType = InferResponseType<
  (typeof client.api.data.jobs.jobLocations)["$get"]
>;

export const useGetJobLocations = () => {
  const query = useQuery<getJobLocationsResponseType, Error>({
    queryKey: ["jobLocations"],
    queryFn: async () => {
      const response = await client.api.data.jobs.jobLocations["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useAddJobLocation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    AddJobLocationResponseType,
    Error,
    AddJobLocationRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.add.jobLocation["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["jobLocations"],
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
