"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpenses from '../_components/AddExpenses';
import ExpenseListTable from '../_components/ExpenseListTable';
import { ArrowBigDown, ArrowBigLeftDash, ArrowLeft, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';




const ExpensesScreen = ({ params }) => {

    const { user } = useUser();
    const route = useRouter();
    const [budgetInfo, setBudgetInfo] = useState();
    const [expenseList, setExpenseList] = useState([]);
    useEffect(() => {
        user && getBudgetInfo();
    }, [user, params])

    /* Get Budget Information */
    const getBudgetInfo = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id);
        setBudgetInfo(result[0]);
        getExpenseList();
    }

    /* Get Expense Information */
    const getExpenseList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .orderBy(desc(Expenses.id));
        setExpenseList(result);
    }

    /* Delete the Budget */
    const deleteBudget = async () => {
        const delExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .returning();
        if (delExpenseResult) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
                .returning();
        }
        toast('Budget Deleted!');
        route.replace('/dashboard/budgets');
    }

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => route.back()}>
                    <ArrowLeft /> My Expenses
                </div>

                <div className='flex gap-2 items-center'>

                    <EditBudget
                        budgetInfo={budgetInfo}
                        refreshData={() => getBudgetInfo()}
                    />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex gap-2">
                                <Trash /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    current budget along with the expenses and remove your
                                    data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>


            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
                {
                    budgetInfo ? <BudgetItem data={budgetInfo} /> :
                        <div className='h-[150px] w-full
                         bg-slate-200 rounded-lg animate-pulse'> </div>
                }
                <AddExpenses
                    budgetId={params.id}
                    user={user}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
            <div className='mt-4'>
                <ExpenseListTable expensesList={expenseList} refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    )
}

export default ExpensesScreen