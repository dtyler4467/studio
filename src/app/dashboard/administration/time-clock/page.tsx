
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeClockAdminTable } from '@/components/dashboard/time-clock-admin-table';

export default function AdminTimeClockPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Clock Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Time Clock Entries</CardTitle>
                <CardDescription>
                    Review, edit, and approve time clock entries for all employees.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TimeClockAdminTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
