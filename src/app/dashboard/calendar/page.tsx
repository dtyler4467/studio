
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScheduleCalendar } from '@/components/dashboard/schedule-calendar';

export default function CalendarPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Calendar" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Company Calendar</CardTitle>
            <CardDescription>
              View all company events, holidays, and schedules in one place.
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
