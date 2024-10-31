import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";

type AddExperienceLevelResponseType = InferResponseType<
  (typeof client.api.data.jobs.add.experienceLevel)["$post"]
>;
type AddExperienceLevelRequestType = InferRequestType<
  (typeof client.api.data.jobs.add.experienceLevel)["$post"]
>["json"];

type getExperienceLevelsResponseType = InferResponseType<
  (typeof client.api.data.jobs.experienceLevels)["$get"]
>;

export const useGetExperienceLevels = () => {
  const query = useQuery<getExperienceLevelsResponseType, Error>({
    queryKey: ["experienceLevels"],
    queryFn: async () => {
      const response = await client.api.data.jobs.experienceLevels["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useAddExperienceLevel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    AddExperienceLevelResponseType,
    Error,
    AddExperienceLevelRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.add.experienceLevel["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["experienceLevels"],
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
