import { Hono } from "hono";
import { handle } from "hono/vercel";

import authRoute from "@/features/auth/server/route";
import jobRoute from "@/features/jobs/server/route";
import companyRoute from "@/features/companies/server/route";
import usersRoute from "@/features/users/server/route";
import paymentRoute from "@/features/payment/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/data/users", authRoute)
  .route("/data/jobs", jobRoute)
  .route("/data/companies", companyRoute)
  .route("/data/users", usersRoute)
  .route("/data/payment", paymentRoute);

app.notFound((c) => c.text("Not Found", 404));
app.onError((err, c) => {
  console.error(err);
  return c.text("Internal Server Error", 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
