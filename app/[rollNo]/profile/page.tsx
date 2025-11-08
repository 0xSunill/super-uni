// app/[rollNo]/profile/page.tsx
import React from "react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import StudentProfile from "@/components/StudentProfile";

export const dynamic = "force-dynamic"; // ensure fresh data

type Props = {
  params: { rollNo: string };
};

async function loadStudentByRoll(rollNo: string) {
  return prisma.student.findUnique({
    where: { rollNo },
    include: {
      year: true,
      subjects: true,
      wallet: true,
      marks: { include: { subject: true } },
      attendances: { include: { subject: true } },
    },
  });
}

export default async function Page({ params }: Props) {
  const { rollNo } = params;

  // Read cookies on server
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;
  const role = cookieStore.get("role")?.value as
    | undefined
    | "ADMIN"
    | "TEACHER"
    | "STUDENT";
  const studentRollNo = cookieStore.get("studentRollNo")?.value;

  // If no session -> redirect to login (middleware should handle this too)
  if (!session) {
    const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost");
    loginUrl.searchParams.set("redirect", `/` + rollNo + "/profile");
    redirect(loginUrl.toString());
  }

  // Authorization:
  // - ADMIN/TEACHER can view any student's profile
  // - STUDENT can only view their own rollNo
  if (role === "STUDENT" && studentRollNo !== rollNo) {
    // unauthorized -> redirect to login (or to student's own profile)
    // redirect them to their own profile if we have their roll no
    if (studentRollNo) redirect(`/${studentRollNo}/profile`);
    redirect("/login");
  }

  const student = await loadStudentByRoll(rollNo);
  if (!student) return notFound();

  // map to shape expected by StudentProfile
  const mapped = {
    id: student.id,
    name: student.name,
    email: student.email ?? "",
    rollNo: student.rollNo ?? "",
    year: student.year?.year ?? "N/A",
    phone: student.phone ?? "",
    gender: student.gender ?? "N/A",
    address: student.address ?? "",
    avatar: student.img ?? undefined,
    subjects: (student.subjects ?? []).map((s) => s.name).join(", "),
    walletaddress: student.wallet?.address ?? null,
    marks: (student.marks ?? []).map((m) => ({
      id: m.id,
      score: (m as any).score ?? null,
      date: m.date ? (m.date instanceof Date ? m.date.toISOString() : String(m.date)) : null,
      subject: (m as any).subject?.name ?? null,
    })),
    attendances: (student.attendances ?? []).map((a) => ({
      id: a.id,
      date: a.date ? (a.date instanceof Date ? a.date.toISOString() : String(a.date)) : null,
      status: (a as any).status ?? null,
      subject: (a as any).subject?.name ?? null,
    })),
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <StudentProfile student={mapped} />
    </div>
  );
}
