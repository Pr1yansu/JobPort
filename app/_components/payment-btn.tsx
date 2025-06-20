"use client";

import { Button } from "@/components/ui/button";
import { useRazorpayPayment } from "@/features/payment/api/use-payments";
import { toast } from "sonner";

export default function RazorpayButton({ amount }: { amount: number }) {
  const { mutate, isPending } = useRazorpayPayment();

  const openRazorpay = (order: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
      name: "JobPort Premium",
      description: "Upgrade to premium",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/data/payment/razorpay/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
          }),
        });

        const verifyJson = await verifyRes.json();
        if (verifyJson.message === "Payment successful") {
          toast.success("Payment successful. You are now premium!");
        } else {
          toast.error("Payment verification failed.");
        }
      },
      prefill: {},
      theme: {
        color: "#6366f1",
      },
    };

    // @ts-expect-error
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleClick = () => {
    mutate(100, {
      onSuccess: (data) => {
        openRazorpay(data);
      },
    });
  };

  return (
    <Button
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Processing..." : "Go Premium ₹100"}
    </Button>
  );
}
