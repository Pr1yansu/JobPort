import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";

type DeleteCompanyRequest = InferRequestType<
  (typeof client.api.data.companies.delete)[":id"]["$delete"]
>;
type DeleteCompanyResponse = InferResponseType<
  (typeof client.api.data.companies.delete)[":id"]["$delete"]
>;

type FollowCompanyRequest = InferRequestType<
  (typeof client.api.data.companies.follow)[":id"]["$patch"]
>;
type FollowCompanyResponse = InferResponseType<
  (typeof client.api.data.companies.follow)[":id"]["$patch"]
>;

type UpdateCompanyRequest = InferRequestType<
  (typeof client.api.data.companies.update)[":id"]["$put"]
>;
type UpdateCompanyResponse = InferResponseType<
  (typeof client.api.data.companies.update)[":id"]["$put"]
>;

export type GetCompanyByIdResponse = InferResponseType<
  (typeof client.api.data.companies)[":id"]["$get"]
>;

export const useFollowCompany = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    FollowCompanyResponse,
    Error,
    FollowCompanyRequest
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.data.companies.follow[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["companies"],
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

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    DeleteCompanyResponse,
    Error,
    DeleteCompanyRequest
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.data.companies.delete[":id"]["$delete"](json);
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["companies"],
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

export const useGetCompanyById = (id: string) => {
  const query = useQuery<GetCompanyByIdResponse, Error>({
    queryKey: ["companies", id],
    queryFn: async () => {
      const response = await client.api.data.companies[":id"]["$get"]({
        param: {
          id,
        },
      });
      return await response.json();
    },
  });

  return query;
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    UpdateCompanyResponse,
    Error,
    UpdateCompanyRequest
  >({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.data.companies.update[":id"]["$put"]({
        json,
        param,
      });
      return await response.json();
    },
    onSuccess: ({ message, success }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["companies"],
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
