
import { Header } from '@/components/layout/header';
import { PersonnelDataTable } from '@/components/dashboard/personnel-data-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminPersonnelPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Personnel Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Personnel</CardTitle>
                <CardDescription>
                    View, edit roles for, or delete existing users.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PersonnelDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
