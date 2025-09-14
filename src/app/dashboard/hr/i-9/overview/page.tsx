
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileText, Clock, CheckSquare, Users } from 'lucide-react';

const verificationStatusData = [
  { name: "Pending", value: 5, fill: "hsl(var(--chart-1))" },
  { name: "Verified", value: 43, fill: "hsl(var(--chart-2))" },
  { name: "Expired", value: 2, fill: "hsl(var(--chart-3))" },
];

const monthlySubmissionsData = [
    { month: "Jan", submissions: 5 },
    { month: "Feb", submissions: 3 },
    { month: "Mar", submissions: 8 },
    { month: "Apr", submissions: 4 },
    { month: "May", submissions: 6 },
    { month: "Jun", submissions: 2 },
];


export default function I9OverviewPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="I-9 Overview" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total I-9 Forms on File</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">50</div>
                            <p className="text-xs text-muted-foreground">Total submissions from all employees</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Reverification</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">2</div>
                            <p className="text-xs text-muted-foreground">Documents expiring soon</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">E-Verify Completed</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">48</div>
                            <p className="text-xs text-muted-foreground">Forms successfully verified</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Hires (YTD)</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">28</div>
                            <p className="text-xs text-muted-foreground">New employees onboarded</p>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Monthly Submissions</CardTitle>
                            <CardDescription>Number of I-9 forms completed each month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <BarChart data={monthlySubmissionsData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} tickMargin={10} axisLine={false} allowDecimals={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="submissions" fill="hsl(var(--primary))" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Document Verification Status</CardTitle>
                            <CardDescription>A breakdown of I-9 document statuses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={verificationStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {verificationStatusData.map((entry, index) => (
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
                
            </main>
        </div>
    );
}
