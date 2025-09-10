
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
import { FileShareHistoryTable } from '@/components/dashboard/file-share-history-table';

export default function AdminFileShareHistoryPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="File Share History" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <History />
                    Share History
                </CardTitle>
                <CardDescription>
                    A log of all files that have been shared, by whom, and with whom.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FileShareHistoryTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
