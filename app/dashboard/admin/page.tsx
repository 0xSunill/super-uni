// app/page.tsx
import { AttendanceBar } from '@/components/AttendanceBar'
import { FinanceLine } from '@/components/FinanceLine'
import { StudentDonut } from '@/components/StudentDonut'
import UserCard from '@/components/UserCard'
import React from 'react'

const Page = () => {
    return (
        <div className="p-6 flex gap-6 flex-col lg:flex-row min-h-screen">
            {/* Left content */}
            <div className="w-full lg:w-2/3 space-y-6">
                {/* Top user cards */}
                <div className="grid grid-cols-2 gap-6">
                    <UserCard type="students" />
                    <UserCard type="teachers" />
                </div>

                {/* Students + Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 flex">
                        <div className="w-full h-full">
                            <StudentDonut />
                        </div>
                    </div>
                    <div className="col-span-2 flex">
                        <div className="w-full h-full">
                            <AttendanceBar />
                        </div>
                    </div>
                </div>

                {/* Finance + placeholder for right column */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-4 flex">
                        <div className="w-full h-full">
                            <FinanceLine />
                        </div>
                    </div>

                </div>
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 h-60">
                    Right side block 1
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 h-60">
                    Right side block 2
                </div>
            </div>
        </div>
    )
}

export default Page
