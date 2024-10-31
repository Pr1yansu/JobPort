import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/config/db";
import { users } from "@/db/users-schema";
import { eq } from "drizzle-orm/expressions";
import { comparePasswords } from "./lib/password";

export default {
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email as string))
          .limit(1);

        if (!user.length || !user[0].password) {
          return null;
        }

        const isValid = comparePasswords(password as string, user[0].password);

        if (!isValid) {
          return null;
        }

        return user[0];
      },
    }),
  ],
} satisfies NextAuthConfig;
