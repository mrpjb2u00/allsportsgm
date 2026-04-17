import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/create-franchise",
  "/roster-builder",
  "/staff",
  "/simulate",
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const access = request.cookies.get("access_granted");
  const loggedIn = request.cookies.get("logged_in");

  const isAllowedPath =
    pathname === "/under-construction" ||
    pathname === "/auth" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isAllowedPath) {
    return NextResponse.next();
  }

  if (!access) {
    url.pathname = "/under-construction";
    return NextResponse.redirect(url);
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !loggedIn) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};