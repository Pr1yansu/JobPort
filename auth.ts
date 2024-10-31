import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import authConfig from "@/auth.config";
import { db } from "@/config/db";
import { users } from "@/db/users-schema";
import { eq } from "drizzle-orm/expressions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async signIn({ user }) {
      if (!user || !user.id) {
        return false;
      }

      const userData = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!userData.length) {
        return false;
      }

      const [u] = userData;

      return u.isBanned ? false : true;
    },
    async session({ session, token }) {
      if (!token || !token.sub) {
        return session;
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub))
        .limit(1);

      if (!user.length) {
        return session;
      }

      const [userData] = user;

      if (token && userData) {
        session.user.id = userData.id;
        session.user.email = userData.email;
        session.user.name = userData.name;
        session.user.image = userData.image;
        session.user.role = userData.role;
      }

      return session;
    },
  },
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/error",
    verifyRequest: "/auth/verify-request",
  },
});
