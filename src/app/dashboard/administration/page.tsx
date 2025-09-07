
"use client";

import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShiftManagementCalendar } from '@/components/dashboard/shift-management-calendar';
import { TimeOffApprovalList } from '@/components/dashboard/time-off-approval-list';
import { PrintSchedule } from '@/components/dashboard/print-schedule';
import { AdminHomepage } from '@/components/dashboard/admin-homepage';

export default function AdministrationPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Administration" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="homepage">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                <TabsTrigger value="homepage">Homepage</TabsTrigger>
                <TabsTrigger value="shifts">Shift Management</TabsTrigger>
                <TabsTrigger value="pto">Time Off Requests</TabsTrigger>
                <TabsTrigger value="print">Print/Email Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="homepage">
                <AdminHomepage />
            </TabsContent>
            <TabsContent value="shifts">
                <ShiftManagementCalendar />
            </TabsContent>
            <TabsContent value="pto">
                <TimeOffApprovalList />
            </TabsContent>
            <TabsContent value="print">
                <PrintSchedule />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
