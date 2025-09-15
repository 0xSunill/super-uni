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

const initialTeachers = Array.from({ length: 8 }).map((_, i) => {
    const id = (i + 1).toString();
    return {
        id,
        name: ["John Doe", "Jane Doe", "Mike Geller", "Jay French", "Jane Smith", "Anna Santiago", "Allen Black", "Ophelia Castro"][i % 8],
        email: `teacher${id}@school.com`,
        teacherId: `T${1000 + i}`,
        subjects: ["Math", "Physics", "Biology", "History", "Music", "Chemistry", "English", "Geography"][i % 8],
        classes: ["1B,2A", "3A", "4C", "5B"][i % 4],
        phone: "1234567890",
        address: "123 Main St",
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

/* Simple modal component (inline) */
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl p-4 bg-white dark:bg-[#1c1c1c] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                    <button onClick={onClose} className="px-2 py-1 rounded text-sm">✕</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

export default function TeacherList({ data = initialTeachers }: { data?: Teacher[] }) {
    const [teachers, setTeachers] = useState<Teacher[]>(data);
    const [query, setQuery] = useState("");
    const pageSize = 7;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return teachers;
        return teachers.filter((t) =>
            `${t.name} ${t.email} ${t.subjects} ${t.classes}`.toLowerCase().includes(q)
        );
    }, [teachers, query]);

    const { page, setPage, total, current } = usePagination(filtered, pageSize);

    // modal state & form state
    const [openAdd, setOpenAdd] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", teacherId: "", subjects: "", classes: "", phone: "", address: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function resetForm() {
        setForm({ name: "", email: "", teacherId: "", subjects: "", classes: "", phone: "", address: "" });
        setErrors({});
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.teacherId.trim()) e.teacherId = "Teacher ID required";
        if (!form.email.trim()) e.email = "Email required";
        return e;
    }

    function handleAdd(e?: React.FormEvent) {
        e?.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }
        const id = String(Date.now());
        const newTeacher: Teacher = {
            id,
            name: form.name,
            email: form.email,
            teacherId: form.teacherId,
            subjects: form.subjects,
            classes: form.classes,
            phone: form.phone,
            address: form.address,
        };
        setTeachers((s) => [newTeacher, ...s]);
        resetForm();
        setOpenAdd(false);
        setPage(1);
    }

    function onDelete(t: Teacher) {
        if (!confirm(`Delete ${t.name}?`)) return;
        setTeachers((s) => s.filter(x => x.id !== t.id));
    }

    return (
        <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Teachers</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                    <input
                        className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm bg-white dark:bg-[#000000] border-slate-200 dark:border-[#000000]"
                        placeholder="Search teachers..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        aria-label="Search teachers"
                    />
                    <div className="flex gap-2">
                        {role === 'admin' && (
                            <button onClick={() => { resetForm(); setOpenAdd(true); }} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                + Add Teacher
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop table */}
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
                                <tr key={t.id} className="border-b hover:bg-gray-200 dark:hover:bg-[#000000] last:border-b-0 border-slate-100 dark:border-[#000000]">
                                    <td className="p-4">
                                        <Link href={`/teachers/${t.id}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-500">
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
                                            <Link href={`/teachers/${t.id}`} className="p-2 rounded-full bg-slate-100 dark:bg-[#000000]" aria-label={`view ${t.name}`}>
                                                <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                            </Link>
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
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded-md border text-sm disabled:opacity-40">Prev</button>
                        <div className="px-3 py-1 text-sm">{page} / {total}</div>
                        <button onClick={() => setPage(Math.min(total, page + 1))} className="px-3 py-1 rounded-md border text-sm disabled:opacity-40">Next</button>
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {current.map((t) => (
                    <div key={t.id} className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-600">
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

                            <div className="flex gap-2">
                                <Link href={`/teachers/${t.id}`} className="p-2 rounded-md bg-slate-100 dark:bg-[#000000]" aria-label={`view ${t.name}`}>
                                    <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                </Link>
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

            {/* ADD TEACHER MODAL */}
            <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Teacher">
                <form onSubmit={handleAdd} className="space-y-3">
                    <div>
                        <label className="text-sm block mb-1">Name *</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm block mb-1">Teacher ID *</label>
                            <input value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                            {errors.teacherId && <div className="text-xs text-red-500 mt-1">{errors.teacherId}</div>}
                        </div>
                        <div>
                            <label className="text-sm block mb-1">Email *</label>
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Subjects</label>
                        <input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Classes" value={form.classes} onChange={e => setForm({ ...form, classes: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                    </div>

                    <div>
                        <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setOpenAdd(false)} className="px-3 py-2 rounded border">Cancel</button>
                        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function filteredLength<T>(arr: T[]) { return arr.length; }
