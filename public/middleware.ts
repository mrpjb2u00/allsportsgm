import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const access = request.cookies.get("access_granted");

  const isUnderConstructionPage = url.pathname === "/under-construction";

  // Allow access to under construction page
  if (isUnderConstructionPage) {
    return NextResponse.next();
  }

  // If no access, redirect
  if (!access) {
    url.pathname = "/under-construction";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};