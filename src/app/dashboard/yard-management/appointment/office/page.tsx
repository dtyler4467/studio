
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { OfficeAppointmentDataTable } from '@/components/dashboard/office-appointment-data-table';

export default function OfficePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Office Appointments" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Manage Office Appointments</CardTitle>
            <CardDescription>
              Schedule and manage meetings, visitor arrivals, and other office appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OfficeAppointmentDataTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
