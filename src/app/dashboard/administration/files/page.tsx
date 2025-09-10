
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { FileDataTable } from '@/components/dashboard/file-data-table';

export default function AdminFilesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Files" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Folder />
                    File Management
                </CardTitle>
                <CardDescription>
                    Manage all application files and documents from this central location.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FileDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
