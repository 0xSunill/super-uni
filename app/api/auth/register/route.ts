import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, role, profile } = body as any;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (role === "ADMIN") {
      return NextResponse.json({ error: "Admins cannot self-register" }, { status: 403 });
    }

    // Ensure unique email/username
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: username ?? undefined }] },
    });
    if (exists) return NextResponse.json({ error: "Email/username taken" }, { status: 409 });

    const passwordHash = await hashPassword(password);

    if (role === "STUDENT") {
      const student = await prisma.student.create({
        data: {
          rollNo: profile.rollNo,
          name: profile.name,
          department: profile.department,
          yearId: profile.yearId,
          phone: profile.phone ?? null,
          gender: profile.gender,
        },
      });
      const user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          role: Role.STUDENT,
          studentId: student.id,
        },
      });
      return NextResponse.json({ id: user.id, role: user.role }, { status: 201 });
    }

    if (role === "TEACHER") {
      const teacher = await prisma.teacher.create({
        data: {
          name: profile.name,
          department: profile.department,
          phone: profile.phone ?? null,
          experience: profile.experience ?? null,
        },
      });
      const user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          role: Role.TEACHER,
          teacherId: teacher.id,
        },
      });
      return NextResponse.json({ id: user.id, role: user.role }, { status: 201 });
    }

    return NextResponse.json({ error: "Unsupported role" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
