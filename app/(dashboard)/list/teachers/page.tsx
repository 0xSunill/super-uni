// app/(dashboard)/list/teachers/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import TeacherList from "@/components/TeacherList";
import { Prisma } from "@prisma/client";

type ServerTeacher = Prisma.TeacherGetPayload<{
    include: { subjects: true; lessons: true; wallets: true };
}> & {
    department?: string | null;
    address?: string | null;
    img?: string | null;
    teacherId?: string | null;
};

function mapTeacher(t: ServerTeacher) {
    return {
        id: t.id,
        name: t.name,
        email: t.email ?? "",
        teacherId: t.teacherId ?? t.id,
        subjects: (t.subjects ?? []).map((s) => s.name).join(", "),
        lessons: (t.lessons ?? []).map((l) => l.room ?? "").join(", "),
        department: t.department ?? "N/A",
        wallets: t.wallets ?? [],
        phone: t.phone ?? "",
        address: t.address ?? "",
        avatar: t.img ?? undefined,
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams?: Record<string, string> | Promise<Record<string, string> | undefined> | undefined;
}) {
   
    const sp = (await searchParams) ?? {};
    const page = Math.max(1, Number(sp?.page ?? 1));
    const take = 50;
    const skip = (page - 1) * take;

    const rawSearch = (sp?.search ?? "").toString().trim();

    const where: Prisma.TeacherWhereInput | undefined = rawSearch
        ? {
            OR: [
                { name: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } },
                { email: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } },
                { subjects: { some: { name: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } } } },
            ],
        }
        : undefined;

    const teachers = await prisma.teacher.findMany({
        where,
        include: { subjects: true, lessons: true, wallets: true },
        orderBy: { createdAt: "desc" },
        take,
        skip,
    });

    const typedTeachers = teachers as ServerTeacher[];
    const data = typedTeachers.map(mapTeacher);

    return <TeacherList data={data} serverTotal={teachers.length} />;
}