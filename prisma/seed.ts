// prisma/seed.ts
import { PrismaClient, Gender, Department, Day, AttStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create Admins
    await prisma.admin.createMany({
        data: [
            { username: "superadmin" },
            { username: "facultyadmin" },
        ],
        skipDuplicates: true,
    });

    // Create Years
    const year1 = await prisma.year.upsert({
        where: { year: 1 },
        update: {},
        create: { year: 1 },
    });

    const year2 = await prisma.year.upsert({
        where: { year: 2 },
        update: {},
        create: { year: 2 },
    });

    // Create Teachers
    const teacher1 = await prisma.teacher.upsert({
        where: { email: "alice.teacher@example.com" },
        update: {},
        create: {
            name: "Alice Johnson",
            email: "alice.teacher@example.com",
            department: Department.MCA,
            phone: "9876543210",
            experience: 5,
        },
    });

    const teacher2 = await prisma.teacher.upsert({
        where: { email: "bob.teacher@example.com" },
        update: {},
        create: {
            name: "Bob Smith",
            email: "bob.teacher@example.com",
            department: Department.MSC,
            phone: "9123456780",
            experience: 3,
        },
    });

    // Create Subjects
    const subject1 = await prisma.subject.upsert({
        where: { code: "MCA101" },
        update: {},
        create: {
            code: "MCA101",
            name: "Data Structures",
            department: Department.MCA,
            yearId: year1.id,
            teachers: { connect: { id: teacher1.id } },
        },
    });

    const subject2 = await prisma.subject.upsert({
        where: { code: "MSC201" },
        update: {},
        create: {
            code: "MSC201",
            name: "Advanced Mathematics",
            department: Department.MSC,
            yearId: year2.id,
            teachers: { connect: { id: teacher2.id } },
        },
    });

    // Create Students
    const student1 = await prisma.student.upsert({
        where: { rollNo: "MCA001" },
        update: {},
        create: {
            rollNo: "MCA001",
            name: "John Doe",
            email: "john.doe@example.com",
            department: Department.MCA,
            yearId: year1.id,
            phone: "9998887777",
            gender: Gender.MALE,
            subjects: { connect: [{ id: subject1.id }] },
        },
    });

    const student2 = await prisma.student.upsert({
        where: { rollNo: "MSC001" },
        update: {},
        create: {
            rollNo: "MSC001",
            name: "Jane Roe",
            email: "jane.roe@example.com",
            department: Department.MSC,
            yearId: year2.id,
            phone: "8887776666",
            gender: Gender.FEMALE,
            subjects: { connect: [{ id: subject2.id }] },
        },
    });

    // Create Wallets
    await prisma.wallet.createMany({
        data: [
            { address: "wallet-student-1", studentId: student1.id },
            { address: "wallet-student-2", studentId: student2.id },
            { address: "wallet-teacher-1", teacherId: teacher1.id },
        ],
        skipDuplicates: true,
    });

    // Create Lessons
    await prisma.lesson.createMany({
        data: [
            {
                subjectId: subject1.id,
                teacherId: teacher1.id,
                day: Day.MONDAY,
                startTime: new Date("2025-01-01T09:00:00Z"),
                endTime: new Date("2025-01-01T10:30:00Z"),
                room: "101",
            },
            {
                subjectId: subject2.id,
                teacherId: teacher2.id,
                day: Day.TUESDAY,
                startTime: new Date("2025-01-02T11:00:00Z"),
                endTime: new Date("2025-01-02T12:30:00Z"),
                room: "202",
            },
        ],
        skipDuplicates: true,
    });

    // Create Announcements
    await prisma.announcement.createMany({
        data: [
            { title: "Welcome to Semester 1", content: "Classes start next week." },
            { title: "Exam Notice", content: "Midterm exams scheduled for next month." },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Seed data created successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Error seeding data:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
