
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LaneManager } from '@/components/dashboard/lane-manager';

export default function LaneManagerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Lane Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Live Yard Map</CardTitle>
                <CardDescription>
                    View real-time status of all dock doors and parking lanes. Trailers assigned via Inbound/Outbound processing are shown here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LaneManager />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
