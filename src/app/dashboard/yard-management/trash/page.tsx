
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrashDataTable } from '@/components/dashboard/trash-data-table';

export default function YardTrashPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Management Trash" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Deleted Items</CardTitle>
                <CardDescription>
                    Review items that have been deleted from yard management. You can restore them if needed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TrashDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
