import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.data.users.logout)["$get"]
>;
type RequestType = InferRequestType<
  (typeof client.api.data.users.logout)["$get"]
>;

export const useLogout = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.users.logout["$get"]({ json });
      return await response.json();
    },
  });

  return mutation;
};
