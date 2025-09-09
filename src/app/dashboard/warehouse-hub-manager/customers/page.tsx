
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CustomerDataTable } from '@/components/dashboard/customer-data-table';

export default function CustomersPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Manage Customers" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Customer Management</CardTitle>
                <CardDescription>
                    Add, view, and manage your customer accounts and contact information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CustomerDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
