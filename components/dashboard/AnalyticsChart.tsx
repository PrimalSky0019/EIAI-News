'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', val: 400 },
    { name: 'Tue', val: 300 },
    { name: 'Wed', val: 800 },
    { name: 'Thu', val: 500 },
    { name: 'Fri', val: 900 },
    { name: 'Sat', val: 1100 },
    { name: 'Sun', val: 1000 },
];

export function AnalyticsChart() {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#888'}}
                        dy={10}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '0px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="val"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}