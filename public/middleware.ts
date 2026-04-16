import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const access = request.cookies.get("access_granted");

  const isAllowedPath =
    url.pathname === "/under-construction" ||
    url.pathname.startsWith("/_next") ||
    url.pathname === "/favicon.ico";

  if (isAllowedPath) {
    return NextResponse.next();
  }

  if (!access) {
    url.pathname = "/under-construction";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};