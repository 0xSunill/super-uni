// app/students/[id]/page.tsx
import React from "react";
import StudentProfile from "@/components/StudentProfile";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // optional: ensure server fetches fresh data

type ServerStudent = Prisma.StudentGetPayload<{
  include: {
    year: true;
    subjects: true;
    wallet: true;
    marks: {
      include?: { subject?: true };
    };
    attendances: {
      include?: { subject?: true };
    };
  };
}>;

async function getStudent(id: string): Promise<ServerStudent | null> {
  if (!id) return null;
  const s = await prisma.student.findUnique({
    where: { id },
    include: {
      year: true,
      subjects: true,
      wallet: true,
      marks: { include: { subject: true } },
      attendances: { include: { subject: true } },
    },
  });
  return s as ServerStudent | null;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const s = await getStudent(params.id);
  if (!s) return { title: "Student not found" };
  return { title: `${s.name} — Student` };
}

export default async function Page({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);
  if (!student) return notFound();

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
      studentId: (m as any).studentId ?? null,
      subjectId: (m as any).subjectId ?? null,
      score: (m as any).score ?? null,
      date: m.date ? (m.date instanceof Date ? m.date.toISOString() : String(m.date)) : null,
      subject: (m as any).subject?.name ?? null,
    })),
    attendances: (student.attendances ?? []).map((a) => ({
      id: a.id,
      studentId: (a as any).studentId ?? null,
      subjectId: (a as any).subjectId ?? null,
      date: a.date ? (a.date instanceof Date ? a.date.toISOString() : String(a.date)) : null,
      status: (a as any).status ?? null,
      subject: (a as any).subject?.name ?? null,
    })),
  };

  return (
    <div className="p-1 lg:p-2">
      <StudentProfile student={mapped} />
    </div>
  );
}
