
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Siren } from 'lucide-react';

export default function SosAlertsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="SOS Alerts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Siren className="text-destructive" />
                    SOS Alerts
                </CardTitle>
                <CardDescription>
                    Critical, real-time alerts requiring immediate attention.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">SOS alerts content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
