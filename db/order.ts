// db/schema/orders.ts
import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { users } from "./users-schema";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR").notNull(),
  status: text("status").default("CREATED").notNull(),
  receipt: text("receipt"),
  razorpayOrderId: text("razorpayOrderId"),
  razorpayPaymentId: text("razorpayPaymentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
