// components/MiniCalendar.tsx
"use client";
import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useTheme } from "next-themes";

type Props = {
  onSelect?: (date: Date) => void;
};

export default function MiniCalendar({ onSelect }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const [viewDate, setViewDate] = useState(dayjs());
  const [selected, setSelected] = useState<dayjs.Dayjs | null>(dayjs());

  const startOfMonth = viewDate.startOf("month");
  const endOfMonth = viewDate.endOf("month");
  const startWeek = startOfMonth.startOf("week");
  const endWeek = endOfMonth.endOf("week");

  const days = useMemo(() => {
    const d: dayjs.Dayjs[] = [];
    let cur = startWeek;
    while (cur.isBefore(endWeek) || cur.isSame(endWeek)) {
      d.push(cur);
      cur = cur.add(1, "day");
    }
    return d;
  }, [viewDate]);

  function prevMonth() {
    setViewDate((v) => v.subtract(1, "month"));
  }
  function nextMonth() {
    setViewDate((v) => v.add(1, "month"));
  }
  function goToday() {
    const now = dayjs();
    setViewDate(now);
    setSelected(now);
    onSelect?.(now.toDate());
  }

  return (
    <div
      className="rounded-2xl p-4 shadow-md"
      style={{ background: isDark ? "#1c1c1c" : "#fff" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: isDark ? "#e6eef8" : "#0f172a" }}>
            {viewDate.format("MMMM YYYY")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous month"
            onClick={prevMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#0b1220]"
            style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}
          >
            ◀
          </button>
          <button
            aria-label="Next month"
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#0b1220]"
            style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2" style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isCurrentMonth = d.month() === viewDate.month();
          const isToday = d.isSame(dayjs(), "day");
          const isSelected = selected && d.isSame(selected, "day");

          return (
            <button
              key={d.toString()}
              onClick={() => {
                setSelected(d);
                onSelect?.(d.toDate());
              }}
              className={`py-2 rounded-md text-sm flex items-center justify-center
                ${isCurrentMonth ? "" : "opacity-40"}
                ${isSelected ? "ring-2 ring-offset-1" : ""}
              `}
              style={{
                background: isSelected ? (isDark ? "#0b1220" : "#EEF2FF") : "transparent",
                color: isSelected ? (isDark ? "#9EE7FF" : "#0f172a") : isToday ? (isDark ? "#9EE7FF" : "#2563EB") : (isDark ? "#e6eef8" : "#0f172a"),
              }}
            >
              <span className="select-none">{d.date()}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={goToday}
          className="text-sm px-3 py-1 rounded-md border"
          style={{ color: isDark ? "#e6eef8" : "#0f172a", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#eef2ff" }}
        >
          Today
        </button>
        <div className="text-xs" style={{ color: isDark ? "#9aa4b2" : "#6b7280" }}>
          {selected ? `Selected: ${selected.format("MMM D")}` : ""}
        </div>
      </div>
    </div>
  );
}
