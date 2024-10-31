import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type RecruiterResponseType = InferResponseType<
  (typeof client.api.data.users.promote.recruiter)[":id"]["$patch"]
>;
type RecruiterRequestType = InferRequestType<
  (typeof client.api.data.users.promote.recruiter)[":id"]["$patch"]
>;
type AdminResponseType = InferResponseType<
  (typeof client.api.data.users.promote.admin)[":id"]["$patch"]
>;
type AdminRequestType = InferRequestType<
  (typeof client.api.data.users.promote.admin)[":id"]["$patch"]
>;
type DemoteResponseType = InferResponseType<
  (typeof client.api.data.users.demote.user)[":id"]["$patch"]
>;
type DemoteRequestType = InferRequestType<
  (typeof client.api.data.users.demote.user)[":id"]["$patch"]
>;
type BanRequestType = InferRequestType<
  (typeof client.api.data.users.ban)[":id"]["$patch"]
>;
type BanResponseType = InferResponseType<
  (typeof client.api.data.users.ban)[":id"]["$patch"]
>;
type UnBanRequestType = InferRequestType<
  (typeof client.api.data.users.unban)[":id"]["$patch"]
>;
type UnBanResponseType = InferResponseType<
  (typeof client.api.data.users.unban)[":id"]["$patch"]
>;

export const useRecruiterPromotion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    RecruiterResponseType,
    Error,
    RecruiterRequestType
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.data.users.promote.recruiter[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to promote user to recruiter");
    },
  });

  return mutation;
};

export const useAdminPromotion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<AdminResponseType, Error, AdminRequestType>({
    mutationFn: async (json) => {
      const response =
        await client.api.data.users.promote.admin[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to promote user to admin");
    },
  });

  return mutation;
};

export const useDemotion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DemoteResponseType, Error, DemoteRequestType>({
    mutationFn: async (json) => {
      const response =
        await client.api.data.users.demote.user[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to demote user");
    },
  });

  return mutation;
};

export const useBan = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<BanResponseType, Error, BanRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.users.ban[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to ban user");
    },
  });

  return mutation;
};

export const useUnBan = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<UnBanResponseType, Error, UnBanRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.data.users.unban[":id"]["$patch"](json);
      return await response.json();
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to unban user");
    },
  });

  return mutation;
};
