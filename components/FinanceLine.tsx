// FinanceLine.tsx (client)
"use client";
import React, { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const sample = months.map((m, i) => ({
    month: m,
    income: Math.round(900 + Math.sin(i / 1.3) * 900 + Math.random() * 300),
    expense: Math.round(1200 + Math.cos(i / 1.5) * 700 + Math.random() * 300)
}));

export const FinanceLine: React.FC<{ data?: typeof sample; height?: number | string }> = ({
    data = sample,
    height = 360,
}) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted ? resolvedTheme === "dark" : false;

    const incomeColor = isDark ? "#9EE7FF" : "#60A5FA";
    const expenseColor = isDark ? "#D8C7FF" : "#C084FC";
    const bg = isDark ? "#1c1c1c" : "#fff";
    const text = isDark ? "#e6eef8" : "#0f172a";
    const sub = isDark ? "#9aa4b2" : "#6b7280";

    const pxHeight = typeof height === "number" ? `${height}px` : height;

    return (
        <div className="rounded-2xl p-4 shadow-md flex flex-col" style={{ background: bg }}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold" style={{ color: text }}>
                    Finance
                </h3>
                <div style={{ color: sub }} className="text-sm">
                    income • expense
                </div>
            </div>

            <div style={{ height: pxHeight, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 6, right: 6, left: -8, bottom: 6 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke={isDark ? "#0b1a26" : "#f1f5f9"} />
                        <XAxis dataKey="month" tick={{ fill: isDark ? "#9aa4b2" : "#6b7280" }} />
                        <YAxis tick={{ fill: isDark ? "#9aa4b2" : "#6b7280" }} />
                        <Tooltip wrapperStyle={{ background: isDark ? "#071025" : "#fff" }} />
                        <Line type="monotone" dataKey="income" stroke={incomeColor} strokeWidth={2.5} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="expense" stroke={expenseColor} strokeWidth={2.5} dot={{ r: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
