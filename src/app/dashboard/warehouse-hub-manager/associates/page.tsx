
import { Header } from '@/components/layout/header';
import { LoadPickerDashboard } from '@/components/dashboard/load-picker-dashboard';

export default function WarehouseAssociatesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Load Picker Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <LoadPickerDashboard />
      </main>
    </div>
  );
}
