import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.data.users.users)["$get"]
>;

export const useGetAllUsers = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api.data.users.users["$get"]();
      return await response.json();
    },
  });

  return query;
};
