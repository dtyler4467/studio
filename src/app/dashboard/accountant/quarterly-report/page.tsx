
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, TrendingUp, DollarSign, Percent } from 'lucide-react';
import React, { useState, useMemo } from 'react';
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
    };
    netIncome: number;
};

const generateMockData = (): Record<string, QuarterData> => {
    const data: Record<string, QuarterData> = {};
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year > currentYear - 2; year--) {
        for (let q = 4; q > 0; q--) {
            const key = `${year}-Q${q}`;
            const revenue = Math.floor(Math.random() * (150000 - 80000 + 1)) + 80000;
            const cogs = revenue * (Math.random() * (0.5 - 0.4) + 0.4);
            const grossProfit = revenue - cogs;
            const maintenance = grossProfit * (Math.random() * (0.15 - 0.1) + 0.1);
            const salaries = grossProfit * (Math.random() * (0.3 - 0.25) + 0.25);
            const marketing = grossProfit * (Math.random() * (0.1 - 0.05) + 0.05);
            const totalExpenses = maintenance + salaries + marketing;
            const netIncome = grossProfit - totalExpenses;
            data[key] = {
                revenue, cogs,
                expenses: { maintenance, salaries, marketing },
                netIncome
            };
        }
    }
    return data;
};

const mockData = generateMockData();

export default function QuarterlyReportPage() {
    const { toast } = useToast();
    const [selectedQuarter, setSelectedQuarter] = useState<string>(`${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`);

    const quarterOptions = useMemo(() => Object.keys(mockData).sort().reverse(), []);

    const selectedData = mockData[selectedQuarter];
    
    const historicalData = useMemo(() => {
        return quarterOptions.slice(0, 5).reverse().map(q => ({ name: q, revenue: mockData[q].revenue }));
    }, [quarterOptions]);

    const handleExport = () => {
        if (!selectedData) return;
        
        const dataToExport = [
            { Item: 'Total Revenue', Amount: selectedData.revenue },
            { Item: 'Cost of Goods Sold (COGS)', Amount: -selectedData.cogs },
            { Item: 'Gross Profit', Amount: selectedData.revenue - selectedData.cogs },
            { Item: 'Maintenance Expenses', Amount: -selectedData.expenses.maintenance },
            { Item: 'Salaries & Wages', Amount: -selectedData.expenses.salaries },
            { Item: 'Marketing', Amount: -selectedData.expenses.marketing },
            { Item: 'Net Income', Amount: selectedData.netIncome },
        ];
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Report ${selectedQuarter}`);
        XLSX.writeFile(workbook, `Quarterly_Report_${selectedQuarter}.xlsx`);
        toast({ title: 'Export Successful' });
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Quarterly Report" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline">Quarterly Financial Performance</CardTitle>
                    <CardDescription>
                        Select a quarter to view a summary of financial performance.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a quarter" />
                        </SelectTrigger>
                        <SelectContent>
                            {quarterOptions.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport} disabled={!selectedData}><Download className="mr-2"/>Export Report</Button>
                </div>
            </CardHeader>
            {selectedData ? (
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${selectedData.revenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${selectedData.netIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gross Profit Margin</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(( (selectedData.revenue - selectedData.cogs) / selectedData.revenue) * 100).toFixed(1)}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Quarterly Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={historicalData}>
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
                     <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Quarterly Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>Total Revenue</TableCell><TableCell className="text-right">${selectedData.revenue.toLocaleString()}</TableCell></TableRow>
                                    <TableRow><TableCell>COGS</TableCell><TableCell className="text-right text-destructive">-${selectedData.cogs.toLocaleString()}</TableCell></TableRow>
                                    <TableRow className="font-semibold"><TableCell>Gross Profit</TableCell><TableCell className="text-right">${(selectedData.revenue - selectedData.cogs).toLocaleString()}</TableCell></TableRow>
                                    <TableRow><TableCell>Total Expenses</TableCell><TableCell className="text-right text-destructive">-${(selectedData.expenses.maintenance + selectedData.expenses.salaries + selectedData.expenses.marketing).toLocaleString()}</TableCell></TableRow>
                                    <TableRow className="font-bold text-primary"><TableCell>Net Income</TableCell><TableCell className="text-right">${selectedData.netIncome.toLocaleString()}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

            </CardContent>
             ) : (
                <CardContent>
                    <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                        <p className="text-muted-foreground">Select a quarter to view the report.</p>
                    </div>
                </CardContent>
            )}
        </Card>
      </main>
    </div>
  );
}
