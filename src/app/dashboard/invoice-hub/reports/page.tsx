
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart as BarChartIcon, DollarSign, Clock, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const monthlyRevenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 400, fill: "hsl(var(--chart-2))" },
  { name: 'Pending', value: 300, fill: "hsl(var(--chart-1))" },
  { name: 'Overdue', value: 50, fill: "hsl(var(--chart-3))" },
];

const recentInvoices = [
    { id: 'INV-001', customer: 'Acme Inc.', amount: 1250.00, status: 'Paid', date: new Date() },
    { id: 'INV-002', customer: 'Globex Corp.', amount: 800.00, status: 'Overdue', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'INV-003', customer: 'Stark Industries', amount: 2500.00, status: 'Pending', date: new Date(new Date().setDate(new Date().getDate() - 2)) },
];


export default function InvoiceReportsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Invoice Reports" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$19,560.00</div>
                    <p className="text-xs text-muted-foreground">+18.2% from last year</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$3,300.00</div>
                    <p className="text-xs text-muted-foreground">Across 2 pending invoices</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">1</div>
                    <p className="text-xs text-muted-foreground">Totaling $800.00</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time to Paid</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">18 Days</div>
                    <p className="text-xs text-muted-foreground">-3 days from last month</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <BarChartIcon />
                        Monthly Revenue
                    </CardTitle>
                    <CardDescription>
                       A breakdown of revenue collected each month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={monthlyRevenueData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
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
                     <CardTitle className="font-headline flex items-center gap-2">
                        <PieChartIcon />
                        Invoice Status
                    </CardTitle>
                    <CardDescription>
                       A snapshot of all current invoice statuses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={invoiceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                     {invoiceStatusData.map((entry, index) => (
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
                <CardTitle className="font-headline">Recent Invoices</CardTitle>
                <CardDescription>A log of the most recent invoices sent.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date Issued</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.customer}</TableCell>
                                <TableCell>{format(invoice.date, 'PPP')}</TableCell>
                                <TableCell>
                                     <Badge variant={
                                         invoice.status === 'Paid' ? 'default' :
                                         invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                                     } className={cn(invoice.status === 'Paid' && 'bg-green-600')}>{invoice.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    ${invoice.amount.toFixed(2)}
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
