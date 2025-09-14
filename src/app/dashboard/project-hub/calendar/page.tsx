
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function ProjectCalendarPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Calendar" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Calendar />
                    Project Calendar
                </CardTitle>
                <CardDescription>
                    View project deadlines, meetings, and key milestones in a shared calendar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Project calendar content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
