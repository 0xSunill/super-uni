// components/TeacherList.tsx
"use client";

import { role } from "@/data";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export type Teacher = {
    id: string;
    name: string;
    email: string;
    teacherId: string;
    subjects: string;
    classes: string;
    phone?: string;
    address?: string;
    avatar?: string;
};

const sampleTeachers = Array.from({ length: 22 }).map((_, i) => {
    const id = (i + 1).toString();
    return {
        id,
        name: ["John Doe", "Jane Doe", "Mike Geller", "Jay French", "Jane Smith", "Anna Santiago", "Allen Black", "Ophelia Castro", "Derek Briggs", "John Glover"][i % 10],
        email: `teacher${id}@school.com`,
        teacherId: `T${1000 + i}`,
        subjects: ["Math, Geometry", "Physics, Chemistry", "Biology", "History", "Music, History", "Physics", "English, Spanish", "Math, Geometry", "Literature, English", "Biology"][i % 10],
        classes: ["1B, 2A, 3C", "5A, 4B, 3C", "5A, 4B, 3C", "5A, 4B, 3C", "5A, 4B, 3C"][i % 5],
        phone: "1234567890",
        address: "123 Main St, Anytown, USA",
        avatar: undefined,
    } as Teacher;
});

function usePagination<T>(items: T[], pageSize: number) {
    const [page, setPage] = useState(1);
    const total = Math.max(1, Math.ceil(items.length / pageSize));
    const current = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);
    return { page, setPage, total, current };
}

export default function TeacherList({ data = sampleTeachers }: { data?: Teacher[] }) {
    const [query, setQuery] = useState("");
    const pageSize = 7;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter((t) =>
            `${t.name} ${t.email} ${t.subjects} ${t.classes}`.toLowerCase().includes(q)
        );
    }, [data, query]);

    const { page, setPage, total, current } = usePagination(filtered, pageSize);

    function onView(t: Teacher) {
        alert(`View teacher: ${t.name}\nID: ${t.teacherId}\nEmail: ${t.email}`);
    }
    function onDelete(t: Teacher) {
        if (confirm(`Delete ${t.name}?`)) {
            alert("Deleted (demo only). Hook your delete logic here.");
        }
    }

    return (
        <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl ">
            {/* header: responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Teachers</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                    <input
                        className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                        placeholder="Search teachers..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        aria-label="Search teachers"
                    />
                    <div className="flex gap-2">
                        {
                            role === 'admin' && <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Add Teacher</button>
                        }
                    </div>
                </div>
            </div>

            {/* Desktop: horizontal-scrollable table if needed */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead>
                            <tr className="text-left text-slate-500 dark:text-slate-300/70">
                                <th className="py-3">Info</th>
                                <th className="py-3">Teacher ID</th>
                                <th className="py-3">Subjects</th>
                                <th className="py-3">Classes</th>
                                <th className="py-3">Phone</th>
                                <th className="py-3">Address</th>
                                <th className="py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.map((t) => (

                                <tr key={t.id} className="border-b rounded-2xl  hover:bg-gray-300 dark:hover:bg-gray-900 last:border-b-0 border-slate-100 dark:border-slate-700/40">
                                    <td className="p-4 ">
                                        <Link href={`/teacher/${t.id}`} className="">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                    {t.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">{t.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-300/60">{t.email}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>

                                    <td className="py-4">{t.teacherId}</td>
                                    <td className="py-4 max-w-xs">{t.subjects}</td>
                                    <td className="py-4">{t.classes}</td>
                                    <td className="py-4">{t.phone}</td>
                                    <td className="py-4">{t.address}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onView(t)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700" aria-label={`view ${t.name}`}>
                                                <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                            </button>
                                            <button onClick={() => onDelete(t)} className="p-2 rounded-full bg-red-50 hover:bg-red-100" aria-label={`delete ${t.name}`}>
                                                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h16V4h-5V3H9zM6 8v12a2 2 0 002 2h8a2 2 0 002-2V8H6z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-slate-500 dark:text-slate-300">
                        Showing {Math.min((page - 1) * pageSize + 1, filteredLength(filtered))} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                        >
                            Prev
                        </button>
                        <div className="px-3 py-1 text-sm">{page} / {total}</div>
                        <button onClick={() => setPage(Math.min(total, page + 1))} className="px-3 py-1 rounded-md border text-sm disabled:opacity-40">Next</button>
                    </div>
                </div>
            </div>

            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-3">
                {current.map((t) => (
                    <div key={t.id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600">
                                {t.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-300">{t.email}</div>
                                <div className="text-xs mt-2 text-slate-600 dark:text-slate-300/80">{t.subjects}</div>
                                <div className="text-xs text-slate-500 mt-1">{t.classes}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-semibold">{t.teacherId}</div>

                            {/* compact actions menu on mobile */}
                            <div className="flex gap-2">
                                <button onClick={() => onView(t)} className="p-2 rounded-md bg-slate-100 dark:bg-slate-800" aria-label={`view ${t.name}`}>
                                    <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                </button>
                                <button onClick={() => onDelete(t)} className="p-2 rounded-md bg-red-50 hover:bg-red-100" aria-label={`delete ${t.name}`}>
                                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h16V4h-5V3H9zM6 8v12a2 2 0 002 2h8a2 2 0 002-2V8H6z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* mobile pagination */}
                <div className="flex items-center justify-between mt-2">
                    <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 rounded-md border">Prev</button>
                    <div className="text-sm">{page} / {total}</div>
                    <button onClick={() => setPage(Math.min(total, page + 1))} className="px-3 py-1 rounded-md border">Next</button>
                </div>
            </div>
        </div>
    );
}

function filteredLength<T>(arr: T[]) { return arr.length; }
