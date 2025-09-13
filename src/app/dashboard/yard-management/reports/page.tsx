

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { YardHistoryTable } from '@/components/dashboard/yard-history-table';

export default function YardReportsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Reports" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Yard Activity & Dwell Time Reports</CardTitle>
                <CardDescription>
                    Generate and view reports related to yard activity. Use the filters to narrow down the data and export it to Excel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <YardHistoryTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
