import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScheduleCalendar } from '@/components/dashboard/schedule-calendar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SchedulePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="My Schedule" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">Upcoming Shifts</CardTitle>
                <CardDescription>
                View your assigned work schedule and select a date or range to see details.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/dashboard/time-off">Request Time Off</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScheduleCalendar />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
