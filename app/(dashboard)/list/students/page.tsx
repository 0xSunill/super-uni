"use client";

import { role } from "@/data";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export type Student = {
    id: string;
    name: string;
    email?: string;
    roll?: string;
    className?: string;
    phone?: string;
    avatar?: string;
};

const initialStudents = Array.from({ length: 12 }).map((_, i) => {
    const id = (i + 1).toString();
    return {
        id,
        name: ["Alya", "Ben", "Cathy", "David", "Elsa", "Frank", "Gina", "Hugo", "Ivy", "Jake", "Lina", "Moe"][i % 12] + " " + (i + 1),
        email: `student${id}@school.com`,
        roll: `R${100 + i}`,
        className: ["4A", "4B", "5A", "3C"][i % 4],
        phone: "9876543210",
    } as Student;
});

function usePagination2<T>(items: T[], pageSize: number) {
    const [page, setPage] = useState(1);
    const total = Math.max(1, Math.ceil(items.length / pageSize));
    const current = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);
    return { page, setPage, total, current };
}

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

export default function StudentList({ data = initialStudents }: { data?: Student[] }) {
    const [students, setStudents] = useState<Student[]>(data);
    const [query, setQuery] = useState("");
    const pageSize = 8;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return students;
        return students.filter((s) => `${s.name} ${s.email} ${s.className} ${s.roll}`.toLowerCase().includes(q));
    }, [students, query]);

    const { page, setPage, total, current } = usePagination2(filtered, pageSize);

    const [openAdd, setOpenAdd] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", roll: "", className: "", phone: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function resetForm() { setForm({ name: "", email: "", roll: "", className: "", phone: "" }); setErrors({}); }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name required";
        if (!form.roll.trim()) e.roll = "Roll required";
        return e;
    }

    function handleAdd(e?: React.FormEvent) {
        e?.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }
        const id = String(Date.now());
        const newStudent: Student = {
            id,
            name: form.name,
            email: form.email,
            roll: form.roll,
            className: form.className,
            phone: form.phone,
        };
        setStudents((s) => [newStudent, ...s]);
        resetForm();
        setOpenAdd(false);
        setPage(1);
    }

    function onDelete(s: Student) {
        if (!confirm(`Delete ${s.name}?`)) return;
        setStudents((slist) => slist.filter(x => x.id !== s.id));
    }

    return (
        <div className="rounded-2xl dark:bg-[#1c1c1c] p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Students</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                    <input
                        className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm bg-white dark:bg-[#000000] border-slate-200 dark:border-[#000000]"
                        placeholder="Search students..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    />
                    {role === 'admin' && <button onClick={() => { resetForm(); setOpenAdd(true); }} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">+ Add Student</button>}
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr className="text-left text-slate-500 dark:text-slate-300/70">
                                <th className="py-3">Info</th>
                                <th className="py-3">Roll</th>
                                <th className="py-3">Class</th>
                                <th className="py-3">Phone</th>
                                <th className="py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {current.map((s) => (
                                <tr key={s.id} className="border-b rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 last:border-b-0 border-slate-100 dark:border-[#000000]">
                                    <td className="p-4">
                                        <Link href={`/student/${s.id}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-500">
                                                    {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">{s.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-300/60">{s.email}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>

                                    <td className="py-4">{s.roll}</td>
                                    <td className="py-4">{s.className}</td>
                                    <td className="py-4">{s.phone}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/students/${s.id}`} className="p-2 rounded-full bg-slate-100 dark:bg-[#000000]" aria-label={`view ${s.name}`}>
                                                <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                            </Link>
                                            <button onClick={() => onDelete(s)} className="p-2 rounded-full bg-red-50 hover:bg-red-100" aria-label={`delete ${s.name}`}>
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
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-300">
                        Showing {Math.min((page - 1) * pageSize + 1, filteredLength(filtered))} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 rounded-md border">Prev</button>
                        <div className="px-3 py-1 text-sm">{page} / {total}</div>
                        <button onClick={() => setPage(Math.min(total, page + 1))} className="px-3 py-1 rounded-md border">Next</button>
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {current.map((s) => (
                    <div key={s.id} className="bg-slate-50 dark:bg-[#000000] rounded-lg p-3 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-600">
                                {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-300">{s.email}</div>
                                <div className="text-xs mt-1 text-slate-600 dark:text-slate-300/80">Class: {s.className}</div>
                                <div className="text-xs text-slate-500">Roll: {s.roll}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-semibold">{s.roll}</div>
                            <div className="flex gap-2">
                                <Link href={`/students/${s.id}`} className="p-2 rounded-md bg-slate-100 dark:bg-[#000000]" aria-label={`view ${s.name}`}>
                                    <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" /></svg>
                                </Link>
                                <button onClick={() => onDelete(s)} className="p-2 rounded-md bg-red-50 hover:bg-red-100" aria-label={`delete ${s.name}`}>
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

            {/* ADD STUDENT MODAL */}
            <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Student">
                <form onSubmit={handleAdd} className="space-y-3">
                    <div>
                        <label className="text-sm block mb-1">Name *</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm block mb-1">Roll *</label>
                            <input value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                            {errors.roll && <div className="text-xs text-red-500 mt-1">{errors.roll}</div>}
                        </div>
                        <div>
                            <label className="text-sm block mb-1">Class</label>
                            <input value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
                        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded border bg-white dark:bg-[#000000] text-sm" />
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
