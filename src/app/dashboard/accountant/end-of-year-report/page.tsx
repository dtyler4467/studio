
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, DollarSign, Percent, Banknote } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

type QuarterData = {
    revenue: number;
    cogs: number;
    expenses: {
        maintenance: number;
        salaries: number;
        marketing: number;
        other: number;
    };
    netIncome: number;
};

type YearData = {
    [quarter: string]: QuarterData;
};

const generateMockDataForYear = (year: number): YearData => {
    const data: YearData = {};
    for (let q = 1; q <= 4; q++) {
        const key = `Q${q}`;
        const revenue = Math.floor(Math.random() * (150000 - 80000 + 1)) + 80000;
        const cogs = revenue * (Math.random() * (0.5 - 0.4) + 0.4);
        const grossProfit = revenue - cogs;
        const maintenance = grossProfit * (Math.random() * (0.15 - 0.1) + 0.1);
        const salaries = grossProfit * (Math.random() * (0.3 - 0.25) + 0.25);
        const marketing = grossProfit * (Math.random() * (0.1 - 0.05) + 0.05);
        const other = grossProfit * (Math.random() * (0.08 - 0.03) + 0.03);
        const totalExpenses = maintenance + salaries + marketing + other;
        const netIncome = grossProfit - totalExpenses;
        data[key] = {
            revenue, cogs,
            expenses: { maintenance, salaries, marketing, other },
            netIncome
        };
    }
    return data;
};

const availableYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

export default function EndOfYearReportPage() {
    const { toast } = useToast();
    const [mockData, setMockData] = useState<Record<number, YearData>>({});
    const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

    useEffect(() => {
        const data: Record<number, YearData> = {};
        availableYears.forEach(year => {
            data[year] = generateMockDataForYear(year);
        });
        setMockData(data);
    }, []);

    const selectedYearData = mockData[selectedYear];

    const yearTotals = useMemo(() => {
        if (!selectedYearData) return null;
        
        let totalRevenue = 0;
        let totalNetIncome = 0;
        let totalExpenses = 0;

        Object.values(selectedYearData).forEach(q => {
            totalRevenue += q.revenue;
            totalNetIncome += q.netIncome;
            totalExpenses += Object.values(q.expenses).reduce((acc, exp) => acc + exp, 0);
        });
        
        const netProfitMargin = totalRevenue > 0 ? (totalNetIncome / totalRevenue) * 100 : 0;

        return { totalRevenue, totalNetIncome, totalExpenses, netProfitMargin };
    }, [selectedYearData]);
    
    const quarterlyChartData = useMemo(() => {
        if (!selectedYearData) return [];
        return Object.entries(selectedYearData).map(([quarter, data]) => ({
            name: quarter,
            revenue: data.revenue,
            netIncome: data.netIncome,
        }));
    }, [selectedYearData]);

    const expenseBreakdownData = useMemo(() => {
        if (!selectedYearData) return [];
        const expenseTotals = { maintenance: 0, salaries: 0, marketing: 0, other: 0 };
        Object.values(selectedYearData).forEach(q => {
            expenseTotals.maintenance += q.expenses.maintenance;
            expenseTotals.salaries += q.expenses.salaries;
            expenseTotals.marketing += q.expenses.marketing;
            expenseTotals.other += q.expenses.other;
        });
        return [
            { name: 'Maintenance', value: expenseTotals.maintenance, fill: 'hsl(var(--chart-1))' },
            { name: 'Salaries', value: expenseTotals.salaries, fill: 'hsl(var(--chart-2))' },
            { name: 'Marketing', value: expenseTotals.marketing, fill: 'hsl(var(--chart-3))' },
            { name: 'Other', value: expenseTotals.other, fill: 'hsl(var(--chart-4))' },
        ]
    }, [selectedYearData]);

    const handleExport = () => {
        if (!selectedYearData || !yearTotals) return;
        
        const dataToExport = [
            { Category: 'Total Revenue', Amount: yearTotals.totalRevenue },
            { Category: 'Total Expenses', Amount: yearTotals.totalExpenses },
            { Category: 'Net Income', Amount: yearTotals.totalNetIncome },
            { Category: 'Net Profit Margin (%)', Amount: yearTotals.netProfitMargin },
            ...Object.entries(selectedYearData).flatMap(([q, data]) => [
                { Category: `${q} Revenue`, Amount: data.revenue },
                { Category: `${q} Net Income`, Amount: data.netIncome },
            ])
        ];
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Report ${selectedYear}`);
        XLSX.writeFile(workbook, `Annual_Report_${selectedYear}.xlsx`);
        toast({ title: 'Export Successful' });
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="End of Year Report" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline">Annual Financial Report</CardTitle>
                    <CardDescription>
                        Select a year to view a comprehensive summary of financial performance.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport} disabled={!selectedYearData}><Download className="mr-2"/>Export Report</Button>
                </div>
            </CardHeader>
            {selectedYearData ? (
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${yearTotals?.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${yearTotals?.totalNetIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{yearTotals?.netProfitMargin.toFixed(1)}%</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${yearTotals?.totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quarterly Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={quarterlyChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => `$${value/1000}K`} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Quarterly Net Income Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <LineChart data={quarterlyChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => `$${value/1000}K`} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="netIncome" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                        <CardHeader>
                            <CardTitle>Annual Expense Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={expenseBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {expenseBreakdownData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

            </CardContent>
             ) : (
                <CardContent>
                    <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                        <p className="text-muted-foreground">Select a year to view the report.</p>
                    </div>
                </CardContent>
            )}
        </Card>
      </main>
    </div>
  );
}
