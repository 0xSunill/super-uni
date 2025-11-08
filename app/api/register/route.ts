
// ===============================
// app/api/register/route.ts
// Creates records based on the selected role and logs the user in.
// Requires these Prisma models: User, Student, Teacher, Year
// ===============================

import { NextResponse } from "next/server";
import { PrismaClient, Role, Department, Gender } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role = body.role as "ADMIN" | "STUDENT" | "TEACHER";
    const password = String(body.password || "");
    if (!role || !password) return NextResponse.json({ message: "Missing role or password" }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 12);

    if (role === "STUDENT") {
      const { rollNo, name, department, gender, year, phone } = body as { rollNo: string; name: string; department: Department; gender: Gender; year: number; phone?: string };
      if (!rollNo || !name || !department || !gender || !year) return NextResponse.json({ message: "Missing student fields" }, { status: 400 });

      const y = await prisma.year.findUnique({ where: { year: Number(year) } });
      if (!y) return NextResponse.json({ message: `Year ${year} is not set up` }, { status: 400 });

      const student = await prisma.student.create({
        data: { rollNo, name, department, gender, yearId: y.id, phone: phone || null },
      });

      const user = await prisma.user.create({
        data: { role: Role.STUDENT, username: rollNo, passwordHash, studentId: student.id },
      });

      const res = NextResponse.json({ redirect: `/student` });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/" });
      res.cookies.set("role", "STUDENT", { httpOnly: true, path: "/" });
      res.cookies.set("studentRollNo", rollNo, { httpOnly: false, path: "/" });
      return res;
    }

    if (role === "TEACHER") {
      const { name, email, department, phone } = body as { name: string; email: string; department: Department; phone?: string };
      if (!name || !email || !department) return NextResponse.json({ message: "Missing teacher fields" }, { status: 400 });

      const teacher = await prisma.teacher.create({ data: { name, department, phone: phone || null } });
      const user = await prisma.user.create({ data: { role: Role.TEACHER, email, username: email, passwordHash, teacherId: teacher.id } });

      const res = NextResponse.json({ redirect: `/teacher/${teacher.id}` });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/" });
      res.cookies.set("role", "TEACHER", { httpOnly: true, path: "/" });
      res.cookies.set("teacherId", teacher.id, { httpOnly: false, path: "/" });
      return res;
    }

    if (role === "ADMIN") {
      const { email, adminCode } = body as { email: string; adminCode?: string };
      if (!email) return NextResponse.json({ message: "Missing admin email" }, { status: 400 });
      if (process.env.ADMIN_REG_CODE && adminCode !== process.env.ADMIN_REG_CODE) {
        return NextResponse.json({ message: "Invalid admin code" }, { status: 403 });
      }

      const user = await prisma.user.create({ data: { role: Role.ADMIN, email, username: email, passwordHash } });
      const res = NextResponse.json({ redirect: "/admin" });
      res.cookies.set("session", user.id, { httpOnly: true, path: "/" });
      res.cookies.set("role", "ADMIN", { httpOnly: true, path: "/" });
      return res;
    }

    return NextResponse.json({ message: "Unsupported role" }, { status: 400 });
  } catch (e: any) {
    console.error("/api/register error", e);
    if (e?.code === "P2002") return NextResponse.json({ message: "Account already exists" }, { status: 409 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
