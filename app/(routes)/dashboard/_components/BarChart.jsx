import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const BarCharts = ({ budgetList }) => {
    return (
        <div className='border rounded-lg p-5'>
            <h2 className='font-bold text-lg mb-2'>Activity</h2>
            <ResponsiveContainer width={'80%'} height={300}>
                <BarChart
                    data={budgetList}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalSpent" stackId="a" fill="#1C1C1C" />
                    <Bar dataKey="amount" stackId="a" fill="#DADFF7" />
                </BarChart>
            </ResponsiveContainer>
        </div >
    )
}

export default BarCharts