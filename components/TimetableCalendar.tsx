// components/TimetableCalendar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import type { EventInput } from "@fullcalendar/core";

type Props = {
    initialView?: "timeGridWeek" | "timeGridDay";
    events?: EventInput[];
    height?: number | string; // e.g. 480 | "480px" | "60vh" | "70%"
    mobileBreakpoint?: number; // px width under which we treat as "mobile"
    mobileHeight?: number; // px height to use on mobile
    desktopHeight?: number; // px height to use on desktop
    // minWidthForScroll determines how wide the inner calendar is (so columns force horizontal scroll)
    minWidthForScroll?: number | string; // e.g. 900 or "900px"
};

export default function TimetableCalendar({
    initialView = "timeGridWeek",
    events,
    height = 480,
    mobileBreakpoint = 768,
    mobileHeight = 380,
    desktopHeight = 480,
    minWidthForScroll = 900,
}: Props) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [heightPx, setHeightPx] = useState<number>(typeof height === "number" ? height : desktopHeight);
    const [minWidth, setMinWidth] = useState<string | number>(minWidthForScroll);
    const calendarRef = useRef<any>(null);
    const [currentView, setCurrentView] = useState<"timeGridWeek" | "timeGridDay">(initialView);

    useEffect(() => setMounted(true), []);

    // responsive detection
    useEffect(() => {
        function update() {
            const w = window.innerWidth;
            const mobile = w < mobileBreakpoint;
            setIsMobile(mobile);
            // Adjust minWidth for mobile vs desktop: make it smaller on phones but still > viewport
            if (typeof minWidthForScroll === "number") {
                setMinWidth(mobile ? Math.max(600, Math.round(minWidthForScroll * 0.7)) : minWidthForScroll);
            } else {
                setMinWidth(minWidthForScroll);
            }
        }
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [mobileBreakpoint, minWidthForScroll]);

    // compute heightPx reliably (supports number, px, vh, %)
    useEffect(() => {
        function compute() {
            if (typeof height === "number") {
                setHeightPx(Math.max(200, Math.round(height)));
                return;
            }
            const s = String(height).trim();
            if (s.endsWith("px")) {
                const v = parseFloat(s.replace("px", ""));
                if (!isNaN(v)) { setHeightPx(Math.max(200, Math.round(v))); return; }
            }
            if (s.endsWith("vh")) {
                const v = parseFloat(s.replace("vh", ""));
                if (!isNaN(v)) { setHeightPx(Math.max(200, Math.round((v / 100) * window.innerHeight))); return; }
            }
            if (s.endsWith("%")) {
                const v = parseFloat(s.replace("%", ""));
                if (!isNaN(v)) { setHeightPx(Math.max(200, Math.round((v / 100) * window.innerHeight))); return; }
            }
            const parsed = parseFloat(s);
            if (!isNaN(parsed)) {
                setHeightPx(Math.max(200, Math.round(parsed)));
                return;
            }
            setHeightPx(isMobile ? mobileHeight : desktopHeight);
        }

        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, [height, isMobile, mobileHeight, desktopHeight]);

    // switch view between week/day on mobile/desktop
    useEffect(() => {
        const cal = calendarRef.current?.getApi?.();
        const targetView = isMobile ? "timeGridDay" : initialView;
        setCurrentView(targetView as "timeGridWeek" | "timeGridDay");
        if (cal && cal.view && cal.view.type !== targetView) {
            cal.changeView(targetView);
        }
    }, [isMobile, initialView]);

    // sample events if none provided
    const sampleEvents: EventInput[] = [
        {
            id: "math-mon-8",
            title: "Math",
            start: dayjs().startOf("week").add(1, "day").hour(8).minute(0).format(),
            end: dayjs().startOf("week").add(1, "day").hour(9).minute(0).format(),
            color: "#BAE6FD",
            textColor: "#072454",
        },
        {
            id: "eng-mon-9",
            title: "English",
            start: dayjs().startOf("week").add(1, "day").hour(9).minute(0).format(),
            end: dayjs().startOf("week").add(1, "day").hour(10).minute(0).format(),
            color: "#FEF3C7",
            textColor: "#452B00",
        },
        {
            id: "phy-wed-11",
            title: "Physics",
            start: dayjs().startOf("week").add(3, "day").hour(11).minute(0).format(),
            end: dayjs().startOf("week").add(3, "day").hour(12).minute(0).format(),
            color: "#FCE7F3",
            textColor: "#2A0A2A",
        },
    ];

    const calendarEvents = events ?? sampleEvents;
    const isDark = mounted ? resolvedTheme === "dark" : false;

    // ensure minWidth string value (px) for inline style
    const minWidthCss = typeof minWidth === "number" ? `${minWidth}px` : String(minWidth);

    return (
        <div
            className="rounded-2xl shadow-md p-2 lg:mb-[600px]"
            style={{ background: isDark ? "#1c1c1c" : "#ffffff", color: isDark ? "#e6eef8" : "#0f172a" }}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Schedule (Class Timetable)</h3>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const cal = calendarRef.current?.getApi();
                            cal?.changeView("timeGridWeek");
                            setCurrentView("timeGridWeek");
                        }}
                        className="px-3 py-1 rounded-md text-sm"
                        style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.03)" }}
                    >
                        Week
                    </button>

                    <button
                        onClick={() => {
                            const cal = calendarRef.current?.getApi();
                            cal?.changeView("timeGridDay");
                            setCurrentView("timeGridDay");
                        }}
                        className="px-3 py-1 rounded-md text-sm"
                        style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.03)" }}
                    >
                        Day
                    </button>
                </div>
            </div>

            {/* HORIZONTAL SCROLL WRAPPER */}
            <div className="overflow-x-auto lg:overflow-x-visible">
                {/* inner container has minWidth > viewport to force horizontal scrolling on small screens */}
                <div style={{ minWidth: isMobile ? minWidthCss : "100%", height: `${heightPx}px` }}>
                    <FullCalendar
                        ref={(ref) => (calendarRef.current = ref)}
                        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                        initialView={currentView}
                        headerToolbar={false}
                        allDaySlot={false}
                        slotMinTime={isMobile ? "08:00:00" : "08:00:00"}
                        slotMaxTime={isMobile ? "17:00:00" : "18:00:00"}
                        slotDuration={isMobile ? "00:30:00" : "00:15:00"}
                        slotLabelInterval={{ hours: 1 }}
                        slotLabelFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
                        nowIndicator={true}
                        expandRows={false}
                        events={calendarEvents}
                        eventDisplay="block"
                        editable={false}
                        selectable={false}
                        dayHeaderFormat={{ weekday: "short" }}
                        height={heightPx}
                        contentHeight="auto"
                        eventContent={(arg) => (
                            <div style={{ padding: "6px 8px", lineHeight: 1.05 }}>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{arg.event.title}</div>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* theme + layout overrides (keeps look consistent) */}
            <style jsx global>{`
        .fc {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
            "Helvetica Neue", Arial;
        }

        .fc .fc-timegrid-slot-label,
        .fc .fc-timegrid-axis {
          color: ${isDark ? "#94a3b8" : "#6b7280"};
        }
        .fc .fc-col-header-cell-cushion {
          color: ${isDark ? "#cbd5e1" : "#374151"};
          font-weight: 600;
        }

        /* grid lines */
        .fc .fc-timegrid-slot {
          border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)"};
        }

        /* events */
        .fc .fc-event {
          border: none;
          border-radius: 8px;
          box-shadow: ${isDark ? "0 6px 20px rgba(2,6,23,0.6)" : "0 6px 18px rgba(2,6,23,0.06)"};
        }

        /* KEY: hide vertical scroll inside calendar so only horizontal scroll is used */
        .fc .fc-scroller {
          overflow-y: hidden !important;
        }

        /* scroller harness background */
        .fc .fc-scroller-harness,
        .fc .fc-scroller-harness .fc-scroller {
          background: ${isDark ? "#0b1220" : "#fff"};
        }

        /* mobile tweaks */
        @media (max-width: 640px) {
          .fc .fc-timegrid-col-frame .fc-timegrid-col {
            min-width: 100%;
          }
          .fc .fc-timegrid-slot-label,
          .fc .fc-timegrid-axis,
          .fc .fc-col-header-cell-cushion {
            font-size: 12px;
          }
          .fc .fc-event {
            font-size: 12px;
            padding: 4px 6px;
          }
        }
      `}</style>
        </div>
    );
}
