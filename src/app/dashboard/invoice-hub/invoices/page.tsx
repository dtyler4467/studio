
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InvoiceDataTable } from '@/components/dashboard/invoice-data-table';

export default function AllInvoicesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="All Invoices" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">All Invoices</CardTitle>
            <CardDescription>
              View, search, and manage all incoming and outgoing invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceDataTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
