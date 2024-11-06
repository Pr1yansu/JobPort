import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useSearchParams } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.data.users.search)["$get"]
>;

export const useSearchUsers = () => {
  const searchParams = useSearchParams();
  const collaborators = searchParams.get("collaborators") || undefined;

  const query = useQuery<ResponseType, Error>({
    queryKey: ["searchedUsers", { collaborators }],
    queryFn: async () => {
      const response = await client.api.data.users.search["$get"]({
        query: {
          collaborators: collaborators,
        },
      });
      return await response.json();
    },
    enabled: !!collaborators,
  });

  return query;
};
