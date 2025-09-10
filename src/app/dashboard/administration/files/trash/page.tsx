
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrashDataTable } from '@/components/dashboard/trash-data-table';
import { Trash2 } from 'lucide-react';

export default function AdminFilesTrashPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Deleted Files" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Trash2 />
                    File Trash
                </CardTitle>
                <CardDescription>
                    Review files that have been deleted. You can restore them if needed.
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
