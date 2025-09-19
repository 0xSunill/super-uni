// app/students/[id]/page.tsx
import React from "react";
import StudentProfile from "@/components/StudentProfile";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
type ServerStudent = Prisma.StudentGetPayload<{
  include: {
    year: true;
    subjects: true;
    wallet: true;
    marks: true;
    attendances: true;
  }
}> & {
  address?: string | null;
  img?: string | null;

}
async function getStudent(id: string): Promise<ServerStudent | null> {
  if (!id) return null;
  const s = await prisma.student.findUnique({
    where: { id },
    include: {
      year: true,
      subjects: true,
      wallet: true,
      marks: true,
      attendances: true
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
  if (!student) {
    return notFound();
  }
  const mapped = {
    id: student.id,
    name: student.name,
    email: student.email ?? "",
    rollNo: student.rollNo ?? "",
    year: student.year ? student.year.year : "N/A",
    phone: student.phone ?? "",
    gender: student.gender ?? "N/A",
    address: student.address ?? "",
    avatar: student.img ?? undefined,
    subjects: (student.subjects ?? []).map((s) => s.name).join(", "),
 
    walletaddress: student.wallet ? student.wallet.address : null,

    // Convert Date -> string for marks
    marks: (student.marks ?? []).map((m) => ({
      id: m.id,
      studentId: (m as any).studentId,      // keep whatever you need
      subjectId: (m as any).subjectId,
      score: (m as any).score,
      // date might be Date | string | undefined — normalize to ISO string or null
      date: m.date ? (m.date instanceof Date ? m.date.toISOString() : String(m.date)) : null,
      // optional: expose subject name if included on mark (if your Mark relation includes subject)
      subject: (m as any).subject ? (typeof (m as any).subject === "string" ? (m as any).subject : (m as any).subject.name ?? null) : null,
    })),

    // Convert Date -> string for attendances
    attendances: (student.attendances ?? []).map((a) => ({
      id: a.id,
      studentId: (a as any).studentId,
      subjectId: (a as any).subjectId,
      date: a.date ? (a.date instanceof Date ? a.date.toISOString() : String(a.date)) : null,
      status: (a as any).status,
      subject: (a as any).subject ? (typeof (a as any).subject === "string" ? (a as any).subject : (a as any).subject.name ?? null) : null,
    })),
  };

  return (
    <div className="p-1 lg:p-2">
      <StudentProfile student={mapped} />
    </div>
  );
}
