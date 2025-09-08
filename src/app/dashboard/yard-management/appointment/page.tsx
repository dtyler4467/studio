
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AppointmentPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Appointments" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Manage Appointments</CardTitle>
            <CardDescription>
              Schedule, view, and manage inbound and outbound appointments for the yard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Appointment scheduling feature coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
