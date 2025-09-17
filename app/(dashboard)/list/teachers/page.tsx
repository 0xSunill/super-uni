import React from "react";
import prisma from "@/lib/prisma";
import TeacherList from "@/components/TeacherList";
import { Wallet } from "lucide-react";

function mapTeacher(t: any) {
    return {
        id: t.id,
        name: t.name,
        email: t.email,
        teacherId: (t as any).teacherId ?? t.id,
        subjects: (t.subjects ?? []).map((s: any) => s.name).join(", "),
        lessons: (t.lessons ?? []).map((l: any) => l.name).join(", "), // adjust field
        department: t.department ?? "N/A", // if enum
        wallets: t.wallets ?? [],          // plural
        phone: t.phone ?? "",
        address: (t as any).address ?? "",
        avatar: (t as any).img ?? undefined,
    };
}

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
    const page = Math.max(1, Number(searchParams?.page ?? 1));
    const take = 50;
    const skip = (page - 1) * take;

    const where = searchParams?.search
        ? { name: { contains: String(searchParams.search), mode: "insensitive" } }
        : {};

    const teachers = await prisma.teacher.findMany({
        where,
        include: {
            subjects: true,
            lessons: true,
            wallets: true,
            // if department is a relation:
            // department: true
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
    });

    const data = teachers.map(mapTeacher);

    return <TeacherList data={data} />;
}
