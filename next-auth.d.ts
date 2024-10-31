import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "ADMIN" | "RECRUITER" | null;
  isTwoFactorEnabled: boolean;
  isBanned: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
