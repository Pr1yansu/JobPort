import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.data.jobs.applyAsRecruiter)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.data.jobs.applyAsRecruiter)["$post"]
>["json"];

export const useApplyRecruiter = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.applyAsRecruiter["$post"]({
        json,
      });
      return await response.json();
    },
  });

  return mutation;
};
