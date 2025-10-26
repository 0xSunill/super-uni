// ===============================
// middleware.ts
// Protect routes: require a session cookie and enforce role-based access.
// - Public: /login, /api/login, static assets
// - Admin pages start with /admin
// - Teacher pages start with /teacher
// - Student pages are top-level like /{rollNo}
// ===============================

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/api/login", "/api/register", "/api/logout", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/_next", "/assets", "/images", "/fonts"];

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // Allow public paths
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) return NextResponse.next();

    const session = req.cookies.get("session")?.value;
    const role = req.cookies.get("role")?.value as undefined | "ADMIN" | "TEACHER" | "STUDENT";

    // If not logged in, bounce to /login and preserve the target
    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname + (search || ""));
        return NextResponse.redirect(url);
    }

    // Role constraints
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/teacher") && role !== "TEACHER") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Student pages: dynamic root level like /MCA001 — require STUDENT
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] !== "admin" && segments[0] !== "teacher") {
        if (role !== "STUDENT") return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    // Simpler, Next 15-safe matcher. Runs on everything except _next, api, and a few public files.
    matcher: ["/((?!_next|api|favicon.ico|sitemap.xml|robots.txt).*)"],
};
