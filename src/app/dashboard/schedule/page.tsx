import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScheduleCalendar } from '@/components/dashboard/schedule-calendar';

export default function SchedulePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="My Schedule" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Shifts</CardTitle>
            <CardDescription>
              View your assigned work schedule and select a date or range to see details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleCalendar />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
