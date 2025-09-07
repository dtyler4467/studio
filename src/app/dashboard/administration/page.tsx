"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShiftManagementCalendar } from '@/components/dashboard/shift-management-calendar';

export default function AdministrationPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Administration" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="shifts">
            <TabsList className="grid w-full grid-cols-2 max-w-lg">
                <TabsTrigger value="shifts">Shift Management</TabsTrigger>
                <TabsTrigger value="pto">Time Off Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="shifts">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Manage Employee Shifts</CardTitle>
                        <CardDescription>
                            Click a date to add or edit a shift. View all scheduled shifts on the calendar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ShiftManagementCalendar />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="pto">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Approve Time Off Requests</CardTitle>
                        <CardDescription>
                            Review and approve or deny paid time off requests from employees.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                            <p className="text-muted-foreground">PTO approval tools coming soon.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
