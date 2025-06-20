import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { API_ROUTES_START, AUTH_ROUTES_START, DEFAULT_ROUTE } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const authenticated = !!req.auth;
  const user = req.auth?.user;

  if (pathname.startsWith(API_ROUTES_START)) {
    return NextResponse.next();
  }

  if (!authenticated && !pathname.startsWith(AUTH_ROUTES_START)) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  if (authenticated && pathname.startsWith(AUTH_ROUTES_START)) {
    return NextResponse.redirect(new URL(DEFAULT_ROUTE, origin));
  }

  if (pathname === "/dashboard/resume" && !user?.premium) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
