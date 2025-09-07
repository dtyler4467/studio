
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShiftManagementCalendar } from '@/components/dashboard/shift-management-calendar';

export default function AdminShiftsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Shift Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Team Schedule</CardTitle>
                <CardDescription>
                    Add, edit, or delete shifts. Click a date to add a new shift or click an existing shift to modify it.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ShiftManagementCalendar />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
