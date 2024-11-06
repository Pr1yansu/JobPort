import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.data.users.login)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.data.users.login)["$post"]
>["json"];

export const useLogin = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.users.login["$post"]({ json });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to login");
    },
  });

  return mutation;
};
