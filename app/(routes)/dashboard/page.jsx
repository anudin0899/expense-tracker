"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BarChart from './_components/BarChart';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

const Dashboard = () => {
    const { user } = useUser();
    const [budgetList, setBudgetList] = useState([]);
    const [expensesList, setExpensesList] = useState([]);

    useEffect(() => {
        user && getBudgetList();
    }, [user])

    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));
        setBudgetList(result);
        getAllExpenses();
    }

    /* Get All Expenses List */
    const getAllExpenses = async () => {
        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt
        }).from(Budgets)
            .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(Expenses.id));
        setExpensesList(result);
    }

    return (
        <div className='h-screen p-8'>
            <h2 className='font-bold text-3xl'>Hi,{user?.fullName}✌</h2>
            <p className='text-gray-500 mt-1'>Here's what happenning with your money, Lets manage your expenses</p>
            <CardInfo budgetList={budgetList} />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-6'>
                <div className='lg:col-span-2'>
                    <BarChart budgetList={budgetList} />
                    <ExpenseListTable expensesList={expensesList} />
                </div>
                <div className='grid gap-5'>
                    <h2 className='text-lg font-bold'>Latest Budget</h2>
                    {budgetList.map((budget, index) => (
                        <BudgetItem data={budget} key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard