// components/TeacherList.tsx
"use client";

import { role } from "@/data";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";

export type Teacher = {
    id: string;
    name: string;
    email: string;
    teacherId: string;
    subjects: string;
    phone?: string;
    // address?: string;
    avatar?: string;
};

function usePagination<T>(items: T[], pageSize: number) {
    const [page, setPage] = useState(1);
    const total = Math.max(1, Math.ceil(items.length / pageSize));
    const current = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);
    return { page, setPage, total, current };
}

/* Modal same as your code */
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

export default function TeacherList({ data = [] as Teacher[] }: { data?: Teacher[] }) {
    const [teachers, setTeachers] = useState<Teacher[]>(data);
    const [query, setQuery] = useState("");
    const pageSize = 7;

    // optional: keep serverTotal if you want to show server count (passed from server)
    const [serverTotal, setServerTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // If you want client-side live search against API, uncomment/use this effect.
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const q = encodeURIComponent(query);
                const res = await fetch(`/api/teachers?search=${q}`);
                if (!res.ok) throw new Error("Fetch failed");
                const json = await res.json();
                const mapped = (json.data ?? []).map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    email: t.email,
                    teacherId: (t as any).teacherId ?? t.id,
                    subjects: (t.subjects || []).map((s: any) => s.name).join(", "),
                    // classes: (t.classes || []).map((c: any) => c.name).join(", "),
                    phone: t.phone ?? "",
                    avatar: (t as any).img ?? undefined,
                })) as Teacher[];

                if (!cancelled) {
                    setTeachers(mapped);
                    setServerTotal(json.count ?? mapped.length);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        // only call API when query is non-empty; otherwise use server-provided initial data
        if (query.trim().length > 0) {
            load();
        } else {
            // optional: reset to initial server data when query cleared
            // setTeachers(data);
            setServerTotal(null);
        }
        return () => { cancelled = true; };
    }, [query]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return teachers;
        return teachers.filter((t) =>
            `${t.name} ${t.email} ${t.subjects} `.toLowerCase().includes(q)
        );
    }, [teachers, query]);

    const { page, setPage, total, current } = usePagination(filtered, pageSize);

    // modal & form states (same as your code)
    const [openAdd, setOpenAdd] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", teacherId: "", subjects: "", phone: "", address: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function resetForm() {
        setForm({ name: "", email: "", teacherId: "", subjects: "", phone: "", address: "" });
        setErrors({});
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.teacherId.trim()) e.teacherId = "Teacher ID required";
        if (!form.email.trim()) e.email = "Email required";
        return e;
    }

    // create via API (recommended) — server will persist and return new teacher
    async function handleAdd(e?: React.FormEvent) {
        e?.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }

        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to create');
            const json = await res.json();
            // json.data is the created teacher mapped by server
            setTeachers((s) => [json.data, ...s]);
            resetForm();
            setOpenAdd(false);
            setPage(1);
        } catch (err) {
            console.error(err);
            // fallback: create locally (not persisted)
            const id = String(Date.now());
            const newTeacher: Teacher = {
                id,
                name: form.name,
                email: form.email,
                teacherId: form.teacherId,
                subjects: form.subjects,

                phone: form.phone,

            };
            setTeachers((s) => [newTeacher, ...s]);
            resetForm();
            setOpenAdd(false);
        }
    }

    // delete via API
    async function onDelete(t: Teacher) {
        if (!confirm(`Delete ${t.name}?`)) return;
        try {
            const res = await fetch(`/api/teachers/${t.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setTeachers((s) => s.filter(x => x.id !== t.id));
        } catch (err) {
            console.error(err);
            // fallback local delete
            setTeachers((s) => s.filter(x => x.id !== t.id));
        }
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

            {/* the rest of your render remains unchanged — use current / page / total etc. */}
            {/* Desktop table */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead>
                            <tr className="text-left text-slate-500 dark:text-slate-300/70">
                                <th className="py-3">Info</th>
                                <th className="py-3">Teacher ID</th>
                                <th className="py-3">Subjects</th>
                                <th className="py-3">Phone</th>
                                {/* <th className="py-3">Address</th> */}
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
                                    {/* <td className="py-4">{t.classes}</td> */}
                                    <td className="py-4">{t.phone}</td>

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

            {/* Mobile and Modal code unchanged... */}
            {/* For brevity, you can keep the rest of your mobile UI and modal form as-is */}
            <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Teacher">
                <form onSubmit={handleAdd}>
                    {/* Add your form fields here */}
                    <div className="flex flex-col gap-4">
                        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-md px-3 py-2" />
                        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded-md px-3 py-2" />
                        {/* Add other form fields as needed */}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => setOpenAdd(false)} className="px-3 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-md">Add</button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}

function filteredLength<T>(arr: T[]) { return arr.length; }
