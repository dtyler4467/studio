
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoadsDataTable } from '@/components/dashboard/loads-data-table';

export default function LocalLoadsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Local Load Board" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Local Loads</CardTitle>
            <CardDescription>
              Manage local routes, assign drivers, and track active shipments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadsDataTable isEditable={true} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
