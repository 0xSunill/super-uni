// app/students/[id]/page.tsx
import React from "react";
import StudentProfile from "@/components/StudentProfile";

async function getStudent(id: string) {
  // Replace with real fetch to your API
  return {
    id,
    name: "Alya Gomez",
    email: "alya@school.com",
    roll: "R123",
    className: "4A",
    phone: "9876543210",
    attendancePct: 92,
    grades: [
      { subject: "Math", grade: "A" },
      { subject: "English", grade: "B+" },
      { subject: "Biology", grade: "A-" },
    ],
    events: undefined,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);

  return (
    <div className="p-1 lg:p-6">
      <StudentProfile student={student} />
    </div>
  );
}
