
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Users, Target, DollarSign } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar as BarChartComponent } from 'recharts';

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18000 },
  { month: "Mar", sales: 22000 },
  { month: "Apr", sales: 15000 },
  { month: "May", sales: 25000 },
  { month: "Jun", sales: 32000 },
];


export default function CrmOverviewPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="CRM Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$250,521.89</div>
                    <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">+2 since last week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">25.3%</div>
                    <p className="text-xs text-muted-foreground">+1.1% from last month</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Sales Performance</CardTitle>
                <CardDescription>
                    An overview of your monthly sales performance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                     <BarChartComponent data={salesData} />
                </ChartContainer>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
