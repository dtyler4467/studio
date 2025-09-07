
import { Header } from '@/components/layout/header';
import { TimeOffApprovalList } from '@/components/dashboard/time-off-approval-list';

export default function AdminTimeOffPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Off Requests" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <TimeOffApprovalList />
      </main>
    </div>
  );
}
