
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BolHistoryTable } from '@/components/dashboard/bol-history-table';

export default function BolHistoryPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Bill of Lading History" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">BOL History</CardTitle>
                <CardDescription>
                    Search and view previously created Bill of Ladings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BolHistoryTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
