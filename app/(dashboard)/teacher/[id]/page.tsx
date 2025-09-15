// app/teachers/[id]/page.tsx
import React from "react";
import TeacherProfile from "@/components/TeacherProfile";

// mock fetch; replace with real fetch/DB call
async function getTeacher(id: string) {
    // Replace with fetch(`/api/teachers/${id}`)
    return {
        id,
        name: "John Doe",
        teacherId: "T1001",
        email: "john@school.com",
        subjects: "Math, Geometry",
        classes: "1B, 2A, 3C",
        phone: "1234567890",
        address: "123 Main St",
        bio: "Senior Math teacher with 8 years of experience.",
        events: undefined, // or pass events array if available
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const teacher = await getTeacher(params.id);

    return (
        <div className="p-1 lg:p-6">
            <TeacherProfile teacher={teacher} />
        </div>
    );
}
