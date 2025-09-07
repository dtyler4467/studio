import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoadsDataTable } from '@/components/dashboard/loads-data-table';

export default function LoadsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Loads Board" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Available Loads</CardTitle>
            <CardDescription>
              Browse, add, assign, and manage available loads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadsDataTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
