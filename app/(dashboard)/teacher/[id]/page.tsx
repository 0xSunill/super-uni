// app/teachers/[id]/page.tsx
import React from "react";
import TeacherProfile from "@/components/TeacherProfile";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";


type ServerTeacher = Prisma.TeacherGetPayload<{
  include: { subjects: true; lessons: true; wallets: true }; 
}> & {
  classes?: string | null; 
  bio?: string | null;
  img?: string | null;
  teacherId?: string | null;
};

async function getTeacher(id: string): Promise<ServerTeacher | null> {
  if (!id) return null;
  const t = await prisma.teacher.findUnique({
    where: { id },
    include: {
      subjects: true,
      lessons: true,
      wallets: true,
    },
  });
  return t as ServerTeacher | null;
}


export async function generateMetadata({ params }: { params: { id: string } }) {
  const t = await getTeacher(params.id);
  if (!t) return { title: "Teacher not found" };
  return { title: `${t.name} — Teacher` };
}

export default async function Page({ params }: { params: { id: string } }) {
  const teacher = await getTeacher(params.id);

  if (!teacher) {
    return notFound();
  }


  const mapped = {
    id: teacher.id,
    name: teacher.name,
    teacherId: teacher.teacherId ?? teacher.id,
    email: teacher.email ?? "",
    subjects: (teacher.subjects ?? []).map((s) => s.name).join(", "),
    classes: /* if you have classes relation, map them here */ (teacher as any).classes ?? "",
    phone: teacher.phone ?? "",
    // address: teacher.address ?? "",
    avatar: teacher.img ?? undefined,
    // lessons: (teacher.lessons ?? []).map((l) => l.name ?? l.title ?? "").join(", "),
    wallets: teacher.wallets ?? [],
  };

  return (
    <div className="p-1 lg:p-6">
      <TeacherProfile teacher={mapped} />
    </div>
  );
}
