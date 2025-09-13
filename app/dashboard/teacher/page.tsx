import UserCard from '@/components/UserCard'
import React from 'react'

const page = () => {
    return (
        <div className='p-4 flex gap-4 flex-col md:flex-row'>
            <div className='w-full lg:w-2/3'>
                <div className='flex flex-row justify-around mb-4 md:gap-4 items-center'>
                    <UserCard type="students" />
                    <UserCard type="teachers" />
                </div>
            </div>
            <div>right side</div>
        </div>
    )
}

export default page