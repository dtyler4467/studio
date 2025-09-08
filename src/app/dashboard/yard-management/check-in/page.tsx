
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { YardCheckInForm } from '@/components/dashboard/yard-check-in-form';

export default function YardCheckInPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Inbound/Outbound Processing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
        <CardHeader>
            <CardTitle className="font-headline">Gate Check In/Out</CardTitle>
            <CardDescription>
            Log truck arrivals and departures at the gate.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <YardCheckInForm />
        </CardContent>
        </Card>
      </main>
    </div>
  );
}
