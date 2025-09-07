"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShiftManagementCalendar } from '@/components/dashboard/shift-management-calendar';
import { TimeOffApprovalList } from '@/components/dashboard/time-off-approval-list';

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
                <ShiftManagementCalendar />
            </TabsContent>
            <TabsContent value="pto">
                <TimeOffApprovalList />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
