// StudentDonut.tsx (client component)
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTheme } from "next-themes";

type Row = { name: string; value: number };

export const StudentDonut: React.FC<{ data?: Row[]; height?: number | string }> = ({
  data = [
    { name: "Boys", value: 1234 },
    { name: "Girls", value: 1014 },
  ],
  height = 280, // default height (px)
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const LIGHT = {
    boys: ["#bde6ff", "#3B82F6"],
    girls: ["#fff4cc", "#F59E0B"],
    card: "#ffffff",
    text: "#0f172a",
    sub: "#6b7280",
  };
  const DARK = {
    boys: ["#083358", "#60A5FA"],
    girls: ["#5f3206", "#FACC15"],
    card: "#071025",
    text: "#e6eef8",
    sub: "#9aa4b2",
  };

  const palette = isDark ? DARK : LIGHT;
  const total = useMemo(() => data.reduce((s, r) => s + r.value, 0), [data]);
  const enriched = data.map((d) => ({ ...d, pct: (d.value / total) * 100 }));

  const gid = isDark ? "g-dark" : "g-light";
  const pxHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className="rounded-2xl p-5 shadow-md flex flex-col"
      style={{ background: palette.card, color: palette.text }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">Students</h3>
        <div className="text-sm" style={{ color: palette.sub }}>
          ...
        </div>
      </div>

      {/* Chart container sized by prop */}
      <div style={{ height: pxHeight, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id={`${gid}-boys`} x1="0" x2="1">
                <stop offset="0%" stopColor={palette.boys[0]} />
                <stop offset="100%" stopColor={palette.boys[1]} />
              </linearGradient>
              <linearGradient id={`${gid}-girls`} x1="0" x2="1">
                <stop offset="0%" stopColor={palette.girls[0]} />
                <stop offset="100%" stopColor={palette.girls[1]} />
              </linearGradient>
            </defs>

            <Pie
              data={enriched}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="transparent"
            >
              <Cell key="boys" fill={`url(#${gid}-boys)`} />
              <Cell key="girls" fill={`url(#${gid}-girls)`} />
            </Pie>

            <Pie
              data={enriched}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              cx="50%"
              cy="50%"
              innerRadius="42%"
              outerRadius="56%"
              paddingAngle={2}
              stroke="transparent"
            >
              <Cell key="boys-i" fill={palette.boys[1]} opacity={0.9} />
              <Cell key="girls-i" fill={palette.girls[1]} opacity={0.9} />
            </Pie>

            <Tooltip
              formatter={(value: number, name: string) => {
                const p = ((value / total) * 100).toFixed(1);
                return [`${value.toLocaleString()} (${p}%)`, name];
              }}
              wrapperStyle={{
                background: isDark ? "#071025" : "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
            />

            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: 20, fontWeight: 700, fill: palette.text }}>
              {mounted ? `${Math.round(enriched[0].pct)}%` : ""}
            </text>
            <text x="50%" y="50%" dy={22} textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: 12, fill: palette.sub }}>
              Boys
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* badges */}
      <div className="mt-4 flex items-center justify-between">
        {enriched.map((d, i) => {
          const colors = i === 0 ? palette.boys : palette.girls;
          return (
            <div key={d.name} className="flex items-center space-x-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
              />
              <div>
                <div className="font-semibold" style={{ color: palette.text }}>
                  {d.value.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: palette.sub }}>
                  {d.name} • {mounted ? Math.round(d.pct) + "%" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
