
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import StudentList, { ClientStudent } from "@/components/StudentList";


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

function mapStudent(s: ServerStudent): ClientStudent {
    return {
        id: s.id,
        rollNo: s.rollNo,
        name: s.name,
        email: s.email,
        department: s.department,
        phone: s.phone ?? "",
        gender: s.gender,
        year: s.year ? s.year.year : (s.yearId ? s.yearId : null),
        address: s.address ?? "",
        avatar: s.img ?? undefined,
        subjects: (s.subjects ?? []).map((sub) => sub.name).join(", "),
        walletAddress: s.wallet ? s.wallet.address : null,
    };
}
export async function deleteStudentAction(formData: FormData) {
    // "use server";
    // const id = formData.get("id")?.toString();
    // if (!id) throw new Error("Missing id");

    // try {
    //     // If relations block deletion, delete them first:
    //     // await prisma.lesson.deleteMany({ where: { teacherId: id } });
    //     // await prisma.wallet.deleteMany({ where: { teacherId: id } });

    //     await prisma.teacher.delete({ where: { id } });

    //     // Revalidate the list page so it refreshes server-side content
    //     revalidatePath("/(dashboard)/list/teachers");
    // } catch (err: any) {
    //     console.error("deleteTeacherAction error:", err);
    //     if (err?.code === "P2025") throw new Error("Teacher not found");
    //     throw err;
    // }
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
    const where: Prisma.StudentWhereInput | undefined = rawSearch
        ? {
            OR: [
                { name: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } },
                { rollNo: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } },
                { email: { contains: rawSearch, mode: "insensitive" as Prisma.QueryMode } },
            ],
        }
        : undefined;

    const students = await prisma.student.findMany({
        where,
        include: { marks: true, attendances: true, subjects: true, wallet: true, year: true },
        orderBy: { createdAt: "desc" },
        take,
        skip,
    });
    const clientData = students.map(mapStudent);

    return (
        <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl">
            <StudentList data={clientData} serverTotal={students.length} />
        </div>
    );
}





