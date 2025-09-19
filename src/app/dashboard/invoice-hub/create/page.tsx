
import { Header } from '@/components/layout/header';
import { InvoiceCreator } from '@/components/dashboard/invoice-creator';

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Create Invoice" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <InvoiceCreator />
      </main>
    </div>
  );
}
