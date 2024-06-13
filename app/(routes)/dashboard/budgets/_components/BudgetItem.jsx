import Link from 'next/link'
import React from 'react'

const BudgetItem = ({ data }) => {

    const calculateProgressPercentage = () => {
        const percentage = (data?.totalSpent / data.amount) * 100;
        return percentage.toFixed(2);
    }
    return (

        <Link href={'/dashboard/expenses/' + data?.id} >
            <div className='p-5 h-[150px] border rounded-lg hover:shadow-md cursor-pointer'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-3xl p-2 bg-slate-100
                        rounded-full'>{data?.icon}</h2>
                        <div>
                            <h2 className='font-bold'>{data?.name}</h2>
                            <h2 className='text-sm text-gray-500'>{data?.totalItem} Item</h2>
                        </div>
                    </div>
                    <h2 className='font-bold text-primary text-lg'>${data?.amount}</h2>
                </div>

                <div className='mt-5 '>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-400'>${data?.totalSpent ? data.totalSpent : 0} Spend</h2>
                        <h2 className='text-xs text-slate-400'>${data?.amount - data?.totalSpent} Remaining</h2>
                    </div>

                    <div className='w-full bg-slate-300 h-2 rounded-full'>
                        <div className=' bg-primary h-2 rounded-full'
                            style={{ width: `${calculateProgressPercentage()}%` }}
                        >

                        </div>
                    </div>
                </div>
            </div>


        </Link>
    )
}

export default BudgetItem