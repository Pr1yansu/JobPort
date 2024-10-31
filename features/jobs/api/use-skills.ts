import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";

type AddSkillsResponseType = InferResponseType<
  (typeof client.api.data.jobs.add.skills)["$post"]
>;
type AddSkillsRequestType = InferRequestType<
  (typeof client.api.data.jobs.add.skills)["$post"]
>["json"];

type GetSkillsResponseType = InferResponseType<
  (typeof client.api.data.jobs.skills)["$get"]
>;

export const useGetSkills = () => {
  const query = useQuery<GetSkillsResponseType, Error>({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await client.api.data.jobs.skills["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    AddSkillsResponseType,
    Error,
    AddSkillsRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.add.skills["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["skills"],
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
