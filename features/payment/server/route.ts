import { Hono } from "hono";
import Razorpay from "razorpay";
import { db } from "@/config/db";
import { orders } from "@/db/order";
import { auth } from "@/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/db/users-schema";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = new Hono()
  .post(
    "/razorpay",
    zValidator(
      "json",
      z.object({
        amount: z.number().min(1, "Amount must be greater than 0"),
      })
    ),
    async (c) => {
      const session = await auth();
      const user = session?.user;

      const { amount } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const rzOrder = await razorpay.orders.create({
          amount: amount * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            userId: user.id ?? "",
          },
        });

        if (!rzOrder || !rzOrder.id) {
          return c.json({ error: "Failed to create Razorpay order" }, 500);
        }

        const data = await db
          .insert(orders)
          .values({
            id: rzOrder.id,
            userId: user.id ?? "",
            amount: amount.toString(),
            currency: "INR",
            status: "CREATED",
            receipt: rzOrder.receipt,
            razorpayOrderId: rzOrder.id,
            razorpayPaymentId: rzOrder.id,
          })
          .returning();

        return c.json({
          id: rzOrder.id,
          amount: rzOrder.amount,
          currency: rzOrder.currency,
        });
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return c.json({ error: "Failed to create order" }, 500);
      }
    }
  )
  .post(
    "/razorpay/success",
    zValidator(
      "json",
      z.object({
        razorpayOrderId: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();
      const user = session?.user;
      const { razorpayOrderId } = c.req.valid("json");
      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.razorpayOrderId, razorpayOrderId))
          .limit(1);

        if (!order.length) {
          return c.json({ error: "Order not found" }, 404);
        }

        const [existingOrder] = order;

        if (existingOrder.status !== "CREATED") {
          return c.json({ error: "Order already processed" }, 400);
        }

        await db
          .update(orders)
          .set({ status: "COMPLETED", updatedAt: new Date() })
          .where(eq(orders.razorpayOrderId, razorpayOrderId));

        await db
          .update(users)
          .set({ premium: true })
          .where(eq(users.id, user.id));

        return c.json({
          message: "Payment successful",
          orderId: razorpayOrderId,
        });
      } catch (error) {
        console.error("Error processing payment:", error);
        return c.json({ error: "Failed to process payment" }, 500);
      }
    }
  );

export default app;
