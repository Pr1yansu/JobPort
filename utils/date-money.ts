import { format } from "date-fns";

type MoneyFormats = "USD" | "EUR" | "GBP" | "NGN" | "INR" | null;

export const formatDate = (date: string | undefined): string => {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatMoney = (
  amount: number | undefined,
  currency: MoneyFormats = "USD"
): string => {
  if (
    !amount ||
    !currency ||
    !["USD", "EUR", "GBP", "NGN", "INR"].includes(currency)
  )
    return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
