import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TimeClock } from '@/components/dashboard/time-clock';

export default function TimeClockPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Clock" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <Card className="w-full max-w-md">
            <TimeClock />
        </Card>
      </main>
    </div>
  );
}
