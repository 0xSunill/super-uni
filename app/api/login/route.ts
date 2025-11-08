// app/api/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Avoid multiple PrismaClient instances in dev
const prisma =
  (global as any).prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV === "development") (global as any).prisma = prisma;

type Role = "ADMIN" | "STUDENT" | "TEACHER";

export async function POST(req: Request) {
  try {
    const { role, email, rollNo, password, redirect } = (await req.json()) as {
      role?: Role;
      email?: string;
      rollNo?: string;
      password?: string;
      redirect?: string;
    };

    if (!role || !password) {
      return NextResponse.json({ message: "Missing role or password" }, { status: 400 });
    }

    // ---- Student: rollNo + password
    if (role === "STUDENT") {
      if (!rollNo) return NextResponse.json({ message: "Missing rollNo" }, { status: 400 });

      const student = await prisma.student.findUnique({ where: { rollNo } });
      if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 });

      const user = await prisma.user.findFirst({ where: { studentId: student.id } });
      if (!user) return NextResponse.json({ message: "User not linked to student" }, { status: 404 });

      if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }

      const target = redirect || `/student`;
      const res = NextResponse.json({ redirect: target });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      res.cookies.set("role", "STUDENT", { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      // convenience (not httpOnly so client can read)
      res.cookies.set("studentRollNo", rollNo, { httpOnly: false, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      return res;
    }

    // ---- Teacher/Admin: email + password
    if (!email) return NextResponse.json({ message: "Missing email" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (role === "ADMIN") {
      if (user.role !== "ADMIN") return NextResponse.json({ message: "Not an admin" }, { status: 403 });
      const target = redirect || "/admin";
      const res = NextResponse.json({ redirect: target });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      res.cookies.set("role", "ADMIN", { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      return res;
    }

    if (role === "TEACHER") {
      if (user.role !== "TEACHER") return NextResponse.json({ message: "Not a teacher" }, { status: 403 });
      if (!user.teacherId) return NextResponse.json({ message: "Teacher link missing" }, { status: 500 });

      const target = redirect || `/teacher/${user.teacherId}`;
      const res = NextResponse.json({ redirect: target });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      res.cookies.set("role", "TEACHER", { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      // convenience
      res.cookies.set("teacherId", user.teacherId, { httpOnly: false, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      return res;
    }

    return NextResponse.json({ message: "Unsupported role" }, { status: 400 });
  } catch (e) {
    console.error("/api/login error", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
