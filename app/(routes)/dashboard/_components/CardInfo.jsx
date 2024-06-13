import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CardInfo = ({ budgetList }) => {

    const [totalBudget, setTotalBudget] = useState('');
    const [totalSpend, setTotalSpend] = useState(0);
    useEffect(() => {
        budgetList && calculateCardInfo();
    }, [budgetList])

    const calculateCardInfo = () => {
        let total_budget = 0;
        let total_Spend = 0;
        budgetList.forEach(element => {
            total_budget = total_budget + Number(element.amount)
            total_Spend = total_Spend + element.totalSpent
        });
        setTotalBudget(total_budget);
        setTotalSpend(total_Spend);

    }
    return (
        <div>
            {budgetList ?
                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <div className='p-8 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>${totalBudget}</h2>
                        </div>
                        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>

                    <div className='p-8 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spend</h2>
                            <h2 className='font-bold text-2xl'>${totalSpend}</h2>
                        </div>
                        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>

                    <div className='p-8 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>{budgetList?.length}</h2>
                        </div>
                        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>

                </div>
                :
                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {[1, 2, 3].map((item, index) => (
                        <div className='h-[110px] w-full bg-slate-200 animate-pluse rounded-lg'>

                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default CardInfo