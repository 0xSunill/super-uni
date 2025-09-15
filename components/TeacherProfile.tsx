// components/TeacherProfile.tsx
"use client";

import React from "react";
import { useTheme } from "next-themes";
import TimetableCalendar from "./TimetableCalendar"; // optional calendar, pass events if available

export type Teacher = {
    id: string;
    name: string;
    email?: string;
    teacherId?: string;
    subjects?: string;
    classes?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    bio?: string;
    events?: any[]; // optional timetable events compatible with your calendar component
};

export default function TeacherProfile({ teacher }: { teacher: Teacher }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl dark:bg-[#1c1c1c] p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className="w-28 h-28 rounded-full bg-gray-200 dark:bg-[#000000] flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-100"
                        aria-hidden
                    >
                        {teacher.avatar ? (
                            <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            teacher.name
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                        )}
                    </div>

                    <div className="flex-1 gap-2">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-2">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {teacher.name}
                                </h1>
                                <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                                    {teacher.bio ?? "Teacher at your school"}
                                </div>
                                <div className="flex gap-3 mt-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div>
                                        <span className="font-semibold">ID:</span> {teacher.teacherId ?? "-"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Classes:</span> {teacher.classes ?? "-"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Subjects:</span> {teacher.subjects ?? "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">
                                    Message
                                </button>
                                <button className="px-3 py-2 rounded-md border text-sm">Edit</button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-lg bg-gray-200 dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Contact</div>
                                <div className="font-semibold mt-1 text-slate-900 dark:text-slate-100">
                                    {teacher.email ?? "-"}
                                </div>
                                <div className="text-sm text-slate-500">{teacher.phone ?? "-"}</div>
                            </div>

                            <div className="rounded-lg bg-gray-200 dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Office</div>
                                <div className="font-semibold mt-1 text-slate-900 dark:text-slate-100">
                                    {teacher.address ?? "—"}
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-200 dark:bg-[#000000] p-3">
                                <div className="text-xs text-slate-500 dark:text-slate-300">Quick stats</div>
                                <div className="flex gap-4 items-center mt-2">
                                    <div>
                                        <div className="text-lg font-bold">24</div>
                                        <div className="text-xs text-slate-500">Classes / week</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold">120</div>
                                        <div className="text-xs text-slate-500">Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>{" "}{/* header card */}



            {/* Timetable & Extra */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Weekly Timetable</h3>
                            <div className="text-sm text-slate-500 dark:text-slate-300">Week view</div>
                        </div>

                        {/* If you have TimetableCalendar, pass teacher.events as prop; otherwise show placeholder */}
                        {teacher.events ? (
                            <div className="h-[420px]">
                                <TimetableCalendar initialView="timeGridWeek" events={teacher.events} height={420} />
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
                        <h4 className="font-semibold mb-2">Subjects</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{teacher.subjects}</div>
                    </div>

                    <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-md">
                        <h4 className="font-semibold mb-2">Classes</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{teacher.classes}</div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
