import React from 'react'

const UserCard = ({ type }: { type: string }) => {
    return (
        <div className='rounded-2xl lg:w-[70%]  odd:bg-lamaPurple odd:dark:bg-lamaPurple-dark even:bg-lamaYellow even:dark:bg-lamaYellow-dark p-2 lg:p-4 flex flex-col justify-center items-center'>
            <span className='font-bold  lg:text-2xl capitalize'> {type}</span>
            <div className='lg:text-2xl font-bold'>100</div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>Total {type}</div>

        </div>
    )
}
export default UserCard