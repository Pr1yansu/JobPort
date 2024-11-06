import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "@/schema/auth";
import { db } from "@/config/db";
import { users } from "@/db/users-schema";
import { eq } from "drizzle-orm/expressions";
import { auth, signIn, signOut } from "@/auth";
import { hashPassword, comparePasswords } from "@/lib/password";

import { z } from "zod";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = user;

      if (!userData.password) {
        return c.json({
          success: false,
          message: "User is logged in with social providers",
        });
      }

      const isPasswordValid = comparePasswords(password, userData.password);

      if (!isPasswordValid) {
        return c.json({
          success: false,
          message: "Invalid password",
        });
      }

      await signIn("credentials", {
        email: userData.email,
        password: password,
        redirect: false,
      });

      return c.json({
        success: true,
        message: "User logged in successfully",
      });
    } catch (error) {
      return c.json({
        success: false,
        message: "Failed to log in",
      });
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, name, password } = c.req.valid("json");

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = hashPassword(password);

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return c.json({
      success: true,
      message: "User registered successfully",
    });
  })
  .get("/logout", async (c) => {
    try {
      await signOut({
        redirect: false,
      });
      return c.json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return c.json({
        success: false,
        message: "Failed to log out",
      });
    }
  })
  .get("/users", async (c) => {
    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== "ADMIN") {
      throw new HTTPException(401, {
        res: c.json({
          success: false,
          message: "Unauthorized",
        }),
      });
    }
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  })
  .get(
    "/user/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return c.json(user);
    }
  )
  .patch(
    "/promote/recruiter/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();
      const user = session?.user;
      if (!user || user.role !== "ADMIN") {
        throw new HTTPException(401, {
          res: c.json({
            success: false,
            message: "Unauthorized",
          }),
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (existingUser.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = existingUser;

      if (userData.role === "RECRUITER") {
        return c.json({
          success: false,
          message: "User is already a recruiter",
        });
      }

      await db
        .update(users)
        .set({ role: "RECRUITER" })
        .where(eq(users.id, id))
        .returning();

      return c.json({
        success: true,
        message: "User promoted to recruiter",
      });
    }
  )
  .patch(
    "/promote/admin/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();
      const user = session?.user;
      if (!user || user.role !== "ADMIN") {
        throw new HTTPException(401, {
          res: c.json({
            success: false,
            message: "Unauthorized",
          }),
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (existingUser.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = existingUser;

      if (userData.role === "ADMIN") {
        return c.json({
          success: false,
          message: "User is already an admin",
        });
      }

      await db
        .update(users)
        .set({ role: "ADMIN" })
        .where(eq(users.id, id))
        .returning();

      return c.json({
        success: true,
        message: "User promoted to admin",
      });
    }
  )
  .patch(
    "/demote/user/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();
      const user = session?.user;
      if (!user || user.role !== "ADMIN") {
        throw new HTTPException(401, {
          res: c.json({
            success: false,
            message: "Unauthorized",
          }),
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (existingUser.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = existingUser;

      if (userData.role !== "RECRUITER") {
        return c.json({
          success: false,
          message: "User is not a recruiter",
        });
      }

      await db
        .update(users)
        .set({ role: "USER" })
        .where(eq(users.id, id))
        .returning();

      return c.json({
        success: true,
        message: "User demoted to user",
      });
    }
  )
  .patch(
    "/ban/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();
      const user = session?.user;
      if (!user || user.role !== "ADMIN") {
        throw new HTTPException(401, {
          res: c.json({
            success: false,
            message: "Unauthorized",
          }),
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (existingUser.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = existingUser;

      if (userData.isBanned) {
        return c.json({
          success: false,
          message: "User is already banned",
        });
      }

      await db
        .update(users)
        .set({ isBanned: true })
        .where(eq(users.id, id))
        .returning();

      return c.json({
        success: true,
        message: "User banned",
      });
    }
  )
  .patch(
    "/unban/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();
      const user = session?.user;
      if (!user || user.role !== "ADMIN") {
        throw new HTTPException(401, {
          res: c.json({
            success: false,
            message: "Unauthorized",
          }),
        });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (existingUser.length === 0) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const [userData] = existingUser;

      if (!userData.isBanned) {
        return c.json({
          success: false,
          message: "User is not banned",
        });
      }

      await db
        .update(users)
        .set({ isBanned: false })
        .where(eq(users.id, id))
        .returning();

      return c.json({
        success: true,
        message: "User unbanned",
      });
    }
  );

export default app;
