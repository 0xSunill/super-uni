// app/page.tsx (snippet)
import TimetableCalendar from "@/components/TimetableCalendar";
import MiniCalendar from "@/components/MiniCalendar";
import AnnouncementsList from "@/components/AnnouncementsList";

export default function Page() {
    return (
        <div className="min-h-screen p-1 md:p-6">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 ">
                        {/* Responsive: component will switch view & height by viewport */}
                        <TimetableCalendar
                            height={480}          // desktop fallback (px)
                            mobileBreakpoint={768}
                            mobileHeight={380}    // height used on small screens
                            initialView="timeGridWeek"
                        />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <MiniCalendar />
                        <AnnouncementsList />
                    </div>
                </div>
            </div>
        </div>
    );
}
