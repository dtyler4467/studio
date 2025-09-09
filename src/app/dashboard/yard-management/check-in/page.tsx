
import { Header } from '@/components/layout/header';
import { YardCheckInPageContent } from '@/components/dashboard/yard-check-in-page-content';

export default function YardCheckInPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Inbound Processing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <YardCheckInPageContent defaultTransactionType="inbound" />
      </main>
    </div>
  );
}

