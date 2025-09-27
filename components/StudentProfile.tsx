"use client";

import React, { useState } from "react";

export type Mark = {
    id?: string;
    score: number;
    date?: string | null;
    subject?: string | null;
};

export type Attendance = {
    id?: string;
    date?: string | null;
    status?: "PRESENT" | "ABSENT" | "CANCELLED" | string;
    subject?: string | null;
};

export type ClientStudent = {
    id: string;
    name: string;
    email: string;
    rollNo: string;
    year: number | string | null;
    phone?: string;
    gender?: string | null;
    address?: string | null;
    avatar?: string | undefined;
    subjects?: string;
    walletaddress?: string | null;
    marks?: Mark[];
    attendances?: Attendance[];
};

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => (n ? n[0] : ""))
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function fmtDate(d?: string | null) {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

function calcAverage(marks: Mark[]) {
    if (!marks.length) return null;
    const sum = marks.reduce((s, m) => s + (m.score || 0), 0);
    return Math.round((sum / marks.length) * 10) / 10;
}

export default function StudentProfile({ student }: { student: ClientStudent }) {
    const marks = student.marks ?? [];
    const attendances = student.attendances ?? [];
    const [copied, setCopied] = useState(false);


    async function handleCopyWallet() {
        const addr = student.walletaddress ?? "";
        if (!addr) {
            // show friendly alert / toast
            alert("No wallet address available for this student.");
            return;
        }
        try {
            await navigator.clipboard.writeText(addr);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
            alert("Failed to copy to clipboard. Try selecting and copying manually.");
        }
    }

    function shortAddr(a?: string | null, len = 6) {
        if (!a) return "—";
        if (a.length <= len * 2 + 3) return a;
        return `${a.slice(0, len)}…${a.slice(-4)}`;
    }

    const attendanceCounts = attendances.reduce(
        (acc, a) => {
            const s = (a.status || "").toUpperCase();
            if (s === "PRESENT") acc.present++;
            else if (s === "ABSENT") acc.absent++;
            else if (s === "CANCELLED") acc.cancelled++;
            return acc;
        },
        { present: 0, absent: 0, cancelled: 0 }
    );

    const totalAttend = attendanceCounts.present + attendanceCounts.absent;
    const attendancePct = totalAttend > 0 ? Math.round((attendanceCounts.present / totalAttend) * 100) : 0;
    const avgMark = calcAverage(marks);

    return (
        <div className="max-w-6xl mx-auto ">
            <div className="bg-white dark:bg-[#1c1c1c] dark:text-slate-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    {/* Left: Avatar + basic info */}
                    <div className="lg:col-span-3 flex flex-col items-center gap-4">
                        <div className="w-36 h-36 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-[#000000] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#111111] dark:to-[#000000] flex items-center justify-center">
                            {student.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={student.avatar} alt={student.name} className="w-36 h-36 object-cover" />
                            ) : (
                                <div className="text-3xl font-semibold text-slate-700 dark:text-slate-300">{initials(student.name || "?")}</div>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-300">{student.email}</div>
                        </div>

                        <div className="w-full text-center mt-2">
                            <div className="text-xs text-slate-400 dark:text-slate-400">Roll No</div>
                            <div className="text-sm font-medium">{student.rollNo}</div>
                        </div>

                        <div className="w-full text-center">
                            <div className="text-xs text-slate-400 dark:text-slate-400">Year</div>
                            <div className="text-sm font-medium">{student.year ?? "N/A"}</div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleCopyWallet}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-2 bg-transparent border border-slate-200 dark:border-[#000000] rounded-md text-sm"
                            >
                                Print
                            </button>
                        </div>
                    </div>

                    {/* Middle: Details, marks */}
                    <div className="lg:col-span-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#000000]">
                                <div className="text-xs text-slate-500 dark:text-slate-400">Contact</div>
                                <div className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{student.phone || "—"}</div>
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Gender</div>
                                <div className="text-sm text-slate-900 dark:text-slate-100">{student.gender || "—"}</div>
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Address</div>
                                <div className="text-sm text-slate-900 dark:text-slate-100">{student.address || "—"}</div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#000000]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Academic</div>
                                        <div className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">Subjects</div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">{student.subjects || "—"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 dark:text-slate-400">Avg. Mark</div>
                                        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{avgMark ?? "—"}</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-xs text-slate-400 dark:text-slate-400">Wallet</div>
                                    <div className="text-sm text-slate-900 dark:text-slate-100 break-all">

                                        {student.walletaddress ? (
                                            <a
                                                href={`https://explorer.solana.com/address/${student.walletaddress}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline"
                                            >
                                                {shortAddr(student.walletaddress)}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500 dark:text-slate-400">—</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marks list with small bars */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#000000]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Marks</h3>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{marks.length} records</div>
                            </div>

                            {marks.length === 0 ? (
                                <div className="mt-4 text-sm text-slate-500">No marks recorded.</div>
                            ) : (
                                <div className="mt-3 space-y-2">
                                    {marks.map((m, i) => {
                                        const pct = Math.max(0, Math.min(100, Math.round((m.score / 100) * 100)));
                                        return (
                                            <div key={m.id ?? i} className="flex items-center gap-3">
                                                <div className="w-40 text-sm text-slate-700 dark:text-slate-300">{m.subject ?? "—"}</div>
                                                <div className="flex-1">
                                                    <div className="w-full bg-slate-200 dark:bg-[#0b0b0b] h-2 rounded-full overflow-hidden">
                                                        <div style={{ width: `${pct}%` }} className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-600" />
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right font-medium">{m.score}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Attendance & recent activity */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#000000] text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Attendance</div>
                            <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{attendancePct}%</div>
                            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Present {attendanceCounts.present} • Absent {attendanceCounts.absent}</div>

                            <div className="mt-4 h-3 w-full bg-slate-200 dark:bg-[#0b0b0b] rounded-full overflow-hidden">
                                <div style={{ width: `${attendancePct}%` }} className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#000000]">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Attendance</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{attendances.length}</div>
                            </div>

                            {attendances.length === 0 ? (
                                <div className="mt-3 text-sm text-slate-500">No attendance recorded.</div>
                            ) : (
                                <ul className="mt-3 space-y-2 max-h-56 overflow-auto">
                                    {attendances
                                        .slice()
                                        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                                        .slice(0, 8)
                                        .map((a, i) => (
                                            <li key={a.id ?? i} className="flex items-center justify-between text-sm">
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">{a.subject ?? "—"}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{fmtDate(a.date)}</div>
                                                </div>
                                                <div className={`px-2 py-1 text-xs rounded ${(a.status || "").toUpperCase() === "PRESENT"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : (a.status || "").toUpperCase() === "ABSENT"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-slate-100 text-slate-700"
                                                    }`}>{(a.status || "").toUpperCase()}</div>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#000000]">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick Actions</div>
                            <div className="mt-3 flex flex-col gap-2">
                                <button className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Message</button>
                                <button className="w-full px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Send Report</button>
                                <button className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-[#000000] bg-transparent text-sm">Export</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
