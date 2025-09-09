import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

export default function MileageTrackerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Mileage Tracker" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Gauge />
                    Mileage Tracker
                </CardTitle>
                <CardDescription>
                    Track and manage vehicle mileage for tax and maintenance purposes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Mileage Tracker content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
