
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSchedule } from '@/hooks/use-schedule';
import { useMemo } from 'react';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function QualityControlOverviewPage() {
    const { qualityHolds } = useSchedule();

    const holdsByReason = useMemo(() => {
        const counts = qualityHolds.reduce((acc, hold) => {
            acc[hold.reason] = (acc[hold.reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value], index) => ({
            name,
            value,
            fill: COLORS[index % COLORS.length]
        }));
    }, [qualityHolds]);

    const holdsByCategory = useMemo(() => {
        // This is a mock-up. In a real app, you'd link items to categories.
         const data = [
            { name: "Raw Materials", value: 4, fill: "hsl(var(--chart-1))" },
            { name: "Finished Goods", value: 2, fill: "hsl(var(--chart-2))" },
            { name: "Packaging", value: 1, fill: "hsl(var(--chart-3))" },
        ];
        return data;
    }, []);
    
    const monthlyHoldData = [
      { month: "Jan", holds: 4 },
      { month: "Feb", holds: 3 },
      { month: "Mar", holds: 5 },
      { month: "Apr", holds: 4 },
      { month: "May", holds: 6 },
      { month: "Jun", holds: 5 },
    ];


    return (
        <div className="flex flex-col w-full">
        <Header pageTitle="Quality Control Overview" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Holds by Reason</CardTitle>
                        <CardDescription>A breakdown of why items are being placed on hold.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={holdsByReason} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {holdsByReason.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Holds by Item Category</CardTitle>
                        <CardDescription>Which types of items are most frequently put on hold.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={holdsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} label>
                                        {holdsByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Monthly Hold Trends</CardTitle>
                    <CardDescription>Total number of items placed on hold each month.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[300px] w-full">
                        <BarChart data={monthlyHoldData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} tickMargin={10} axisLine={false} allowDecimals={false}/>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="holds" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                   </ChartContainer>
                </CardContent>
            </Card>
        </main>
        </div>
    );
}

