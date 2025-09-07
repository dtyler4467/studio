
import { Header } from '@/components/layout/header';
import { PrintSchedule } from '@/components/dashboard/print-schedule';

export default function AdminPrintPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Print or Email Schedule" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md-p-8">
        <PrintSchedule />
      </main>
    </div>
  );
}
