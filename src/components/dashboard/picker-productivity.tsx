
"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { DatePickerWithRange } from '../ui/date-range-picker';
import { useSchedule } from '@/hooks/use-schedule';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { differenceInMinutes } from 'date-fns';
import { Clock, PackageCheck, Truck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function PickerProductivity() {
    const { salesOrders, employees } = useSchedule();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({ from: new Date(new Date().setDate(new Date().getDate() - 7)), to: new Date() });
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string>('all');

    const productivityData = useMemo(() => {
        let filteredOrders = salesOrders.filter(o => o.status === 'Shipped' || o.status === 'Staged');

        if (dateRange?.from) {
            filteredOrders = filteredOrders.filter(o => {
                const orderDate = o.pickEndTime || o.shipDate;
                return orderDate >= dateRange.from! && orderDate <= (dateRange.to || dateRange.from!);
            });
        }
        
        if (selectedEmployeeId !== 'all') {
            filteredOrders = filteredOrders.filter(o => o.assignedPicker === selectedEmployeeId);
        }

        const stats = {
            totalOrders: filteredOrders.length,
            totalItems: filteredOrders.reduce((acc, o) => acc + o.items.length, 0),
            avgTime: 0,
        };

        const totalPickingMinutes = filteredOrders.reduce((acc, o) => {
            if (o.pickStartTime && o.pickEndTime) {
                return acc + differenceInMinutes(o.pickEndTime, o.pickStartTime);
            }
            return acc;
        }, 0);
        
        stats.avgTime = filteredOrders.length > 0 ? totalPickingMinutes / filteredOrders.length : 0;
        
        return stats;

    }, [salesOrders, dateRange, selectedEmployeeId]);
    
    const chartData = useMemo(() => {
        // Mock daily data for chart
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: Math.floor(Math.random() * 10) + 2 // Random orders between 2 and 12
            })
        }
        return data;
    }, [selectedEmployeeId, dateRange]);


    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <CardTitle className="font-headline">Picker Productivity</CardTitle>
                        <CardDescription>Review picking performance over a selected period.</CardDescription>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                         <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Pickers</SelectItem>
                                {employees.filter(e => e.role === 'Forklift' || e.role === 'Laborer').map(e => (
                                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <Truck className="h-6 w-6 mx-auto text-primary" />
                        <p className="text-2xl font-bold mt-2">{productivityData.totalOrders}</p>
                        <p className="text-sm text-muted-foreground">Orders Picked</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <PackageCheck className="h-6 w-6 mx-auto text-primary" />
                        <p className="text-2xl font-bold mt-2">{productivityData.totalItems}</p>
                        <p className="text-sm text-muted-foreground">Items Picked</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <Clock className="h-6 w-6 mx-auto text-primary" />
                        <p className="text-2xl font-bold mt-2">{productivityData.avgTime.toFixed(1)} <span className="text-base">min</span></p>
                        <p className="text-sm text-muted-foreground">Avg. Time / Order</p>
                    </div>
                </div>
                 <ChartContainer config={{ orders: { label: "Orders", color: "hsl(var(--primary))" } }} className="h-[250px] w-full">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

