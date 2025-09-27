import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import SubjectList, { ClientSubject } from '@/components/SubjectList';

// --- Server types ---
type ServerSubject = Prisma.SubjectGetPayload<{
  include: {
    students: true;
    teachers: true;
    year: true;
    lessons: true;
    attendances: true;
    marks: true;
  };
}> & {
  description?: string | null;
};

function mapSubject(s: ServerSubject): ClientSubject {
  return {
    id: s.id,
    name: s.name,
    code: s.code,
    description: s.description ?? '',
    year: s.year ? s.year.year : s.yearId ?? null,
    studentsCount: s.students?.length ?? 0,
    teachersCount: s.teachers?.length ?? 0,
    lessonsCount: s.lessons?.length ?? 0,
    marksCount: s.marks?.length ?? 0,
    attendancesCount: s.attendances?.length ?? 0,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sp = searchParams ?? {};
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const searchParam = Array.isArray(sp.search) ? sp.search[0] : sp.search;

  const page = Math.max(1, Number(pageParam ?? 1));
  const take = 50;
  const skip = (page - 1) * take;
  const rawSearch = (searchParam ?? '').toString().trim();

  const where: Prisma.SubjectWhereInput | undefined = rawSearch
    ? {
        OR: [
          { name: { contains: rawSearch, mode: 'insensitive' } },
          { code: { contains: rawSearch, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const [subjects, totalSubjects] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
      include: {
        students: true,
        teachers: true,
        year: true,
        lessons: true,
        attendances: true,
        marks: true,
      },
    }),
    prisma.subject.count({ where }),
  ]);

  const clientData: ClientSubject[] = subjects.map(mapSubject);

  return (
    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl">
      <SubjectList data={clientData} serverTotal={totalSubjects} />
    </div>
  );
}
