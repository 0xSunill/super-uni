// components/StudentProfile.tsx
"use client";

import React from "react";
import { useTheme } from "next-themes";
import TimetableCalendar from "./TimetableCalendar"; // optional

export type TimetableEvent = {
    id: string;
    title: string;
    start: string; // ISO date string
    end?: string;  // ISO date string (optional)
    location?: string;
    description?: string;
};

export type Student = {
    id: string;
    name: string;
    email?: string;
    roll?: string;
    className?: string;
    phone?: string;
    avatar?: string;
    attendancePct?: number;
    grades?: { subject: string; grade: string }[];
    events?: TimetableEvent[]; // timetable events
};

export default function StudentProfile({ student }: { student: Student }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl  dark:bg-[#1c1c1c] p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-24 h-24 rounded-full   bg-gray-200  dark:bg-[#000000] flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-100">
                        {student.avatar ? (
                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            student.name
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.name}</h1>
                                <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">{student.className} • Roll {student.roll}</div>
                                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{student.email ?? student.phone}</div>
                            </div>

                            <div className="flex gap-2">
                                <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Message</button>
                                <button className="px-3 py-2 rounded-md border text-sm">Edit</button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-lg bg-gray-200  dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Attendance</div>
                                <div className="font-semibold text-lg mt-1">{student.attendancePct ?? 0}%</div>
                            </div>

                            <div className="rounded-lg bg-gray-200  dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Class</div>
                                <div className="font-semibold mt-1">{student.className}</div>
                            </div>

                            <div className="rounded-lg bg-gray-200  dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Contact</div>
                                <div className="font-semibold mt-1">{student.phone ?? student.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades & timetable */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <h3 className="font-semibold mb-3">Grades</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(student.grades ?? []).map((g) => (
                                <div key={g.subject} className="rounded-lg p-3 bg-gray-200  dark:bg-[#000000]">
                                    <div className="text-sm text-slate-500">{g.subject}</div>
                                    <div className="font-semibold mt-1">{g.grade}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Weekly Timetable</h3>
                            <div className="text-sm text-slate-500 dark:text-slate-300">Week</div>
                        </div>

                        {student.events ? (
                            <div className="h-[420px]">
                                <TimetableCalendar initialView="timeGridWeek" events={student.events} height={420} />
                            </div>
                        ) : (
                            <div className="h-44 flex items-center justify-center text-sm text-slate-500 dark:text-slate-300">
                                No timetable available
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{student.email}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{student.phone}</div>
                    </div>

                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <h4 className="font-semibold mb-2">Attendance</h4>
                        <div className="text-sm">{student.attendancePct ?? 0}%</div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
