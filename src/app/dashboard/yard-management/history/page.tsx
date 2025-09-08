
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { YardHistoryTable } from '@/components/dashboard/yard-history-table';

export default function YardHistoryPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Activity History" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Search Gate History</CardTitle>
                <CardDescription>
                    Review, search, and filter all historical gate check-in and check-out records.
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
