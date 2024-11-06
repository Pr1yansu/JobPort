import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/config/db";
import { users } from "@/db/users-schema";
import { and, ilike, like, ne, or } from "drizzle-orm";
import { auth } from "@/auth";

const app = new Hono().get(
  "/search",
  zValidator(
    "query",
    z.object({
      collaborators: z.string().optional().nullable(),
    })
  ),
  async (c) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      if (!userId) {
        return c.json({
          success: false,
          message: "Unauthorized",
          data: [],
        });
      }

      const { collaborators } = c.req.valid("query");

      if (!collaborators) {
        return c.json({
          success: false,
          message: "Missing collaborators",
          data: [],
        });
      }

      const usersList = await db
        .select()
        .from(users)
        .where(
          and(
            ne(users.id, userId),
            or(
              like(users.email, `%${collaborators}%`),
              ilike(users.name, `%${collaborators}%`)
            )
          )
        );

      if (!usersList || usersList.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
          data: [],
        });
      }

      return c.json({
        success: true,
        message: "User found",
        data: usersList,
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "An error occurred",
        data: [],
      });
    }
  }
);

export default app;
