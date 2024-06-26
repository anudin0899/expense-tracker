"use client"
import React from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {

    const menuList = [
        { id: 1, name: 'Dashboard', icon: <LayoutGrid />, path: '/dashboard' },
        { id: 2, name: 'PiggyBank', icon: <PiggyBank />, path: '/dashboard/budgets' },
        { id: 3, name: 'Expense', icon: <ReceiptText />, path: '/dashboard/expenses' },
        // { id: 4, name: 'Upgrade', icon: <ShieldCheck />, path: '/dashboard/upgrade' },
    ];

    const path = useParams();

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src={'/logo.svg'} alt='logo' width={160} height={100} />
            <div className='mt-5'>
                {menuList.map((menu, index) => (
                    <Link href={menu.path} key={index}>
                        <h2 className={`flex gap-2 items-center text-gray-500 
                        font-medium p-5 mb-2 cursor-pointer rounded-md
                        hover:text-primary hover:bg-gray-200
                        ${path == menu.path && 'text-primary bg-gray-200'}`}>
                            {menu.icon}
                            {menu.name}
                        </h2>
                    </Link>
                ))}
            </div>
            <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
                <UserButton />
                Profile
            </div>
        </div>
    )
}

export default Sidebar