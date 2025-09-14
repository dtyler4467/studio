
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CrmTasksDataTable } from '@/components/dashboard/crm-tasks-data-table';

export default function CrmTasksPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="CRM Tasks" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Tasks</CardTitle>
                <CardDescription>
                    Track your sales activities, follow-ups, and meetings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CrmTasksDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
