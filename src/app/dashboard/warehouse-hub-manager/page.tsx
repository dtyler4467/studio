
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { ArrowDownToLine, ArrowUpFromLine, Target, PackageCheck, BarChart } from 'lucide-react';
import { WarehouseActivityChart } from '@/components/dashboard/warehouse-activity-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const recentActivity = [
  { id: 'REC001', type: 'Inbound', reference: 'PO-2024-003', items: 3, time: '10:45 AM' },
  { id: 'SHP001', type: 'Outbound', reference: 'SO-2024-512', items: 5, time: '11:20 AM' },
  { id: 'REC002', type: 'Inbound', reference: 'PO-2024-001', items: 8, time: '11:55 AM' },
  { id: 'SHP002', type: 'Outbound', reference: 'SO-2024-513', items: 2, time: '12:30 PM' },
];

export default function WarehouseHubManagerPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Dock Hub Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Dock Activity Overview</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbound Today</CardTitle>
              <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outbound Today</CardTitle>
              <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">-3 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Cycle count pending for Aisle 3</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders to Ship</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">4 high priority</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <BarChart />
                        Daily Activity
                    </CardTitle>
                    <CardDescription>
                        An overview of inbound and outbound transactions for the selected date range.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <WarehouseActivityChart />
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Recent Transactions</CardTitle>
                    <CardDescription>
                        A log of the most recent warehouse activities.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivity.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        <Badge variant={activity.type === 'Inbound' ? 'secondary' : 'outline'}>{activity.type}</Badge>
                                    </TableCell>
                                    <TableCell>{activity.reference}</TableCell>
                                    <TableCell>{activity.items}</TableCell>
                                    <TableCell>{activity.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
