
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DealKanbanBoard } from '@/components/dashboard/deal-kanban-board';
import { AddDealDialog } from '@/components/dashboard/add-deal-dialog';

export default function CrmDealsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="CRM Deals" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline">Sales Pipeline</CardTitle>
                    <CardDescription>
                        Manage your deals and track your sales pipeline. Drag and drop deals to update their stage.
                    </CardDescription>
                </div>
                <AddDealDialog />
            </CardHeader>
            <CardContent>
                <DealKanbanBoard />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
