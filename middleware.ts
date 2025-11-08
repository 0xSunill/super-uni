// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Public paths that do not require auth.
 * Use startsWith to allow prefixes (/_next/, /assets/, /images/ etc.).
 */
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/login",
  "/api/register",
  "/api/logout",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",
  "/assets",
  "/images",
  "/fonts",
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow public paths (exact match or prefix)
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Read cookies (note: cookie names must match those set in /api/login)
  const session = req.cookies.get("session")?.value;
  const role = req.cookies.get("role")?.value as
    | undefined
    | "ADMIN"
    | "TEACHER"
    | "STUDENT";

  // If not logged in, bounce to /login and preserve the target in ?redirect=
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // If logged in but trying to access admin-only pages
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    // allowed for ADMIN
    return NextResponse.next();
  }

  // Teacher pages
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) {
    if (role !== "TEACHER") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Student pages: top-level dynamic segment like "/MCA001"
  // We treat any single-segment path (other than admin/teacher) as student page.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && segments[0] !== "admin" && segments[0] !== "teacher") {
    if (role !== "STUDENT") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  // Run middleware for everything except Next internals & API (matcher is broad)
  matcher: ["/((?!_next|api|favicon.ico|sitemap.xml|robots.txt).*)"],
};
