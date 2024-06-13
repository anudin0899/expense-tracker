"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/utils/dbConfig'


const EditBudget = ({ budgetInfo, refreshData }) => {

    const { user } = useUser();

    const [emojiIcon, setEmojiIcon] = useState('');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo?.icon);
            setName(budgetInfo?.name);
            setAmount(budgetInfo?.amount);
        }
    }, [budgetInfo]);

    const onUpdateBudget = async () => {
        const result = await db.update(Budgets)
            .set({
                name: name,
                amount: amount,
                icon: emojiIcon
            })
            .where(eq(Budgets?.id, budgetInfo?.id))
            .returning()

        if (result) {
            refreshData();
            toast("Budget Updated!")
        }
    }

    return (
        <div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'> <PenBox />Edit</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button
                                    size='lg'
                                    className='text-lg'
                                    variant="outline"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >
                                    {emojiIcon}
                                </Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji)
                                            setOpenEmojiPicker(false)
                                        }}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input
                                        type='text'
                                        defaultValue={budgetInfo?.name}
                                        placeholder='e.g. Home Essentials'
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type='number'
                                        defaultValue={budgetInfo?.amount}
                                        placeholder='e.g. 5000'
                                        onChange={(e) => { setAmount(e.target.value) }}
                                    />
                                </div>

                            </div>

                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                className='mt-5 w-full'
                                disabled={!(name && amount)}
                                onClick={() => onUpdateBudget()}
                            >
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget