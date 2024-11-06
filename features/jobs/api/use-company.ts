import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { ZodError } from "zod";

type AddCompanyResponseType = InferResponseType<
  (typeof client.api.data.jobs.add.company)["$post"]
>;
type AddCompanyRequestType = InferRequestType<
  (typeof client.api.data.jobs.add.company)["$post"]
>["json"];
type getCompaniesResponseType = InferResponseType<
  (typeof client.api.data.jobs.companies)["$get"]
>;
type getCompaniesByAuthenticatedUserResponseType = InferResponseType<
  (typeof client.api.data.jobs.companies.byUser)["$get"]
>;

export const useGetCompanies = () => {
  const query = useQuery<getCompaniesResponseType, Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await client.api.data.jobs.companies["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useGetCompaniesByAuthenticatedUser = () => {
  const query = useQuery<getCompaniesByAuthenticatedUserResponseType, Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await client.api.data.jobs.companies.byUser["$get"]();
      return await response.json();
    },
  });

  return query;
};

export const useAddCompany = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    AddCompanyResponseType,
    Error,
    AddCompanyRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.jobs.add.company["$post"]({
        json,
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
