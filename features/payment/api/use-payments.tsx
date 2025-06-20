import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type CreateOrderResponse = {
  id: string;
  amount: number;
  currency: string;
};

export const useRazorpayPayment = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await client.api.data.payment.razorpay["$post"]({
        json: { amount },
      });
      return res.json() as Promise<CreateOrderResponse>;
    },
    onError: () => {
      toast.error("Failed to initiate payment.");
    },
  });
};
