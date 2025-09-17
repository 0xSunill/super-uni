// app/(dashboard)/list/teachers/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import TeacherList from "@/components/TeacherList";
import { Prisma } from "@prisma/client";

function mapTeacher(t: any) {
    return {
        id: t.id,
        name: t.name,
        email: t.email,
        teacherId: (t as any).teacherId ?? t.id,
        subjects: (t.subjects ?? []).map((s: any) => s.name).join(", "),
        lessons: (t.lessons ?? []).map((l: any) => l.name ?? l.title ?? "").join(", "),
        department: t.department ?? "N/A",
        wallets: t.wallets ?? [],
        phone: t.phone ?? "",
        address: (t as any).address ?? "",
        avatar: (t as any).img ?? undefined,
        // classes: (t.classes ?? []).map((c: any) => c.name).join(", "),
    };
}

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
    const page = Math.max(1, Number(searchParams?.page ?? 1));
    const take = 50;
    const skip = (page - 1) * take;

    const rawSearch = (searchParams?.search ?? "").toString().trim();


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

    const data = teachers.map(mapTeacher);

    return <TeacherList data={data} />;
}
