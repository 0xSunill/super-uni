// AttendanceBar.tsx (client)
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

const sample = [
    { day: "Mon", present: 60, absent: 50 },
    { day: "Tue", present: 70, absent: 60 },
    { day: "Wed", present: 95, absent: 75 },
    { day: "Thu", present: 60, absent: 68 },
    { day: "Fri", present: 57, absent: 50 },
];

export const AttendanceBar: React.FC<{ data?: typeof sample; height?: number | string }> = ({
    data = sample,
    height = 280,
}) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted ? resolvedTheme === "dark" : false;

    const presentColor = isDark ? "#FACC15" : "#FBBF24";
    const absentColor = isDark ? "#60A5FA" : "#93C5FD";
    const bg = isDark ? "#071025" : "#ffffff";
    const text = isDark ? "#e6eef8" : "#0f172a";
    const sub = isDark ? "#9aa4b2" : "#6b7280";

    const pxHeight = typeof height === "number" ? `${height}px` : height;

    // Calculate totals + percentages
    const totals = useMemo(() => {
        const presentTotal = data.reduce((s, d) => s + d.present, 0);
        const absentTotal = data.reduce((s, d) => s + d.absent, 0);
        const total = presentTotal + absentTotal;
        return {
            present: presentTotal,
            absent: absentTotal,
            presentPct: (presentTotal / total) * 100,
            absentPct: (absentTotal / total) * 100,
        };
    }, [data]);

    return (
        <div className="rounded-2xl p-4 shadow-md flex flex-col" style={{ background: bg }}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold" style={{ color: text }}>
                    Attendance
                </h3>
                <div style={{ color: sub }} className="text-sm">
                    present • absent
                </div>
            </div>

            <div style={{ height: pxHeight, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 6, right: 6, left: -8, bottom: 6 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#0b1a26" : "#f1f5f9"} />
                        <XAxis dataKey="day" tick={{ fill: isDark ? "#9aa4b2" : "#6b7280" }} />
                        <YAxis tick={{ fill: isDark ? "#9aa4b2" : "#6b7280" }} />
                        <Tooltip wrapperStyle={{ background: isDark ? "#071025" : "#fff" }} />
                        <Bar dataKey="present" stackId="a" fill={presentColor} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="absent" stackId="a" fill={absentColor} radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ✅ Summary row like StudentDonut */}
            <div className="mt-6 flex items-center justify-between ">
                <div className="flex items-center space-x-3 ">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: presentColor }}
                    />
                    <div>
                        <div className="font-semibold" style={{ color: text }}>
                            {totals.present}
                        </div>
                        <div className="text-sm" style={{ color: sub }}>
                            Present • {mounted ? Math.round(totals.presentPct) + "%" : ""}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3 ">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: absentColor }}
                    />
                    <div>
                        <div className="font-semibold" style={{ color: text }}>
                            {totals.absent}
                        </div>
                        <div className="text-sm" style={{ color: sub }}>
                            Absent • {mounted ? Math.round(totals.absentPct) + "%" : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
