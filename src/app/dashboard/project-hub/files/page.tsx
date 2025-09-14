
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { FileDataTable } from '@/components/dashboard/file-data-table';

export default function ProjectFilesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Files" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Folder />
                    Project Document Management
                </CardTitle>
                <CardDescription>
                    Upload, organize, and share all documents and files related to your projects.
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
