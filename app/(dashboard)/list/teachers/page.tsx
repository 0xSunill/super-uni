import React from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import TeacherList, { ClientTeacher } from "@/components/TeacherList";

type ServerTeacher = Prisma.TeacherGetPayload<{
    include: { subjects: true; lessons: true; wallet: true };
}> & {
    department?: string | null;
    address?: string | null;
    img?: string | null;
    teacherId?: string | null;
};

function mapTeacher(t: ServerTeacher): ClientTeacher {
    return {
        id: t.id,
        name: t.name,
        email: t.email ?? "",
        teacherId: t.teacherId ?? t.id,
        subjects: (t.subjects ?? []).map((s) => s.name).join(", "),
        phone: t.phone ?? "",
        address: t.address ?? "",
        avatar: t.img ?? undefined,
        walletAddress: t.wallet ? t.wallet.address : null
    };
}

export async function deleteTeacherAction(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("Missing id");

    try {
        // If relations block deletion, delete them first:
        // await prisma.lesson.deleteMany({ where: { teacherId: id } });
        // await prisma.wallet.deleteMany({ where: { teacherId: id } });

        await prisma.teacher.delete({ where: { id } });

        // Revalidate the list page so it refreshes server-side content
        revalidatePath("/(dashboard)/list/teachers");
    } catch (err: any) {
        console.error("deleteTeacherAction error:", err);
        if (err?.code === "P2025") throw new Error("Teacher not found");
        throw err;
    }
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
        include: { subjects: true, lessons: true, wallet: true },
        orderBy: { createdAt: "desc" },
        take,
        skip,
    });

    const clientData = teachers.map((t) => mapTeacher(t as ServerTeacher));

    // Render page: TeacherList (client) + hidden server-rendered forms (one per teacher).
    // Client will find and submit these forms when user clicks delete.

    return (
        <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl">
            <TeacherList data={clientData} serverTotal={teachers.length} enableServerDelete={true} />

            {/* Hidden server-rendered forms for server actions.
          They must not include client event handlers. They are plain forms that submit
          to the server action (deleteTeacherAction). The client will call .submit() on them.
      */}
            <div aria-hidden style={{ display: "none" }}>
                {clientData.map((t) => (
                    <form
                        key={t.id}
                        id={`delete-form-${t.id}`}
                        action={deleteTeacherAction}
                        method="POST"
                    >
                        <input type="hidden" name="id" value={t.id} />
                        {/* no onSubmit or any client handlers here */}
                    </form>
                ))}
            </div>
        </div>
    );
}
