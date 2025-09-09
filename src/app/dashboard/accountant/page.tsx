
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, CreditCard, DollarSign, FilePlus, FileText, Landmark, PieChart, TrendingUp, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, CartesianGrid, XAxis, YAxis, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const recentTransactions = [
    { id: 'INV-001', date: new Date(), type: 'Invoice', customer: 'Acme Inc.', amount: 1250.00, status: 'Paid' },
    { id: 'EXP-001', date: new Date(), type: 'Expense', customer: 'Global Fasteners', amount: -345.50, status: 'Processed' },
    { id: 'INV-002', date: new Date(), type: 'Invoice', customer: 'Stark Industries', amount: 2500.00, status: 'Sent' },
    { id: 'PAY-001', date: new Date(), type: 'Payroll', customer: 'Employee Payout', amount: -5600.00, status: 'Processed' },
    { id: 'INV-003', date: new Date(), type: 'Invoice', customer: 'Globex Corp.', amount: 800.00, status: 'Overdue' },
];

const incomeVsExpenseData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 5000, expense: 3800 },
  { name: 'Apr', income: 2780, expense: 1908 },
  { name: 'May', income: 1890, expense: 1800 },
  { name: 'Jun', income: 2390, expense: 1800 },
];

const expenseByCategoryData = [
  { name: 'Fuel', value: 400, fill: "hsl(var(--chart-1))" },
  { name: 'Maintenance', value: 300, fill: "hsl(var(--chart-2))" },
  { name: 'Payroll', value: 300, fill: "hsl(var(--chart-3))" },
  { name: 'Insurance', value: 200, fill: "hsl(var(--chart-4))" },
  { name: 'Other', value: 278, fill: "hsl(var(--chart-5))" },
];


export default function AccountantPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Accountant Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Overview</h2>
            <div className="flex items-center gap-2">
                <Button><FilePlus className="mr-2"/> New Invoice</Button>
                <Button variant="secondary"><FileText className="mr-2"/> New Expense</Button>
            </div>
        </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-destructive">12</div>
                <p className="text-xs text-muted-foreground">Totaling $12,345.00</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Expenses</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit (YTD)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-600">$120,432.10</div>
                <p className="text-xs text-muted-foreground">Up 15% from last year</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <BarChart />
                        Income vs. Expenses
                    </CardTitle>
                    <CardDescription>
                       A monthly overview of cash flow.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={{}} className="h-[300px] w-full">
                        <BarChart data={incomeVsExpenseData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => `$${value/1000}K`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="income" fill="hsl(var(--primary))" radius={4} />
                            <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={4} />
                        </BarChart>
                   </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <CardTitle className="font-headline flex items-center gap-2">
                        <PieChart />
                        Expenses by Category
                    </CardTitle>
                    <CardDescription>
                       A breakdown of spending for the current month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                     {expenseByCategoryData.map((entry, index) => (
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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Recent Transactions</CardTitle>
                    <CardDescription>
                        A log of the most recent financial activities.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="invoice">Invoices</SelectItem>
                            <SelectItem value="expense">Expenses</SelectItem>
                            <SelectItem value="payroll">Payroll</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button variant="outline">Export Data</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference/Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <Badge variant={tx.type === 'Invoice' ? 'secondary' : 'outline'}>{tx.type}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{tx.customer} <span className="text-muted-foreground">({tx.id})</span></TableCell>
                                <TableCell>{format(tx.date, 'PPP')}</TableCell>
                                <TableCell>
                                     <Badge variant={
                                         tx.status === 'Paid' ? 'default' :
                                         tx.status === 'Overdue' ? 'destructive' : 'secondary'
                                     } className={cn(tx.status === 'Paid' && 'bg-green-600')}>{tx.status}</Badge>
                                </TableCell>
                                <TableCell className={cn("text-right font-semibold", tx.amount > 0 ? "text-green-600" : "text-destructive")}>
                                    {tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
