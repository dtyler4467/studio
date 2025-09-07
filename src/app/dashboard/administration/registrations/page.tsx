
import { Header } from '@/components/layout/header';
import { RegistrationApprovalList } from '@/components/dashboard/registration-approval-list';

export default function AdminRegistrationsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Registration Approvals" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <RegistrationApprovalList />
      </main>
    </div>
  );
}
