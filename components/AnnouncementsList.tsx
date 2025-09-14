// components/AnnouncementsList.tsx
"use client";
import React from "react";
import { useTheme } from "next-themes";

export type Announcement = {
  id: string;
  title: string;
  date: string; // ISO or display
  body?: string;
  variant?: "info" | "warning" | "success";
};

const sample: Announcement[] = [
  { id: "1", title: "School reopens", date: "2025-09-01", body: "Classes resume after summer break." },
  { id: "2", title: "Cafeteria update", date: "2025-08-25", body: "New healthy menu options available." },
  { id: "3", title: "Holiday notice", date: "2025-08-10", body: "School closed for public holiday." },
];

export default function AnnouncementsList({ items = sample }: { items?: Announcement[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className="rounded-2xl p-4 shadow-md" style={{ background: isDark ? "#1c1c1c" : "#fff" }}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold" style={{ color: isDark ? "#e6eef8" : "#0f172a" }}>Announcements</h4>
        <div className="text-sm" style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}>View All</div>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-lg p-3"
            style={{ background: isDark ? "#000000" : "#f8fafc", border: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(15,23,42,0.02)" }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold" style={{ color: isDark ? "#e6eef8" : "#0f172a" }}>{a.title}</div>
                {a.body && <div className="text-sm mt-1" style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}>{a.body}</div>}
              </div>
              <div className="text-xs" style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
