import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Allow public routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Role-specific guards
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }
  if (pathname.startsWith("/teacher") && token.role !== "TEACHER") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }
  if (pathname.startsWith("/student") && token.role !== "STUDENT") {
    return NextResponse.rewrite(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
