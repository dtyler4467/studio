
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ParkingLaneManager } from '@/components/dashboard/parking-lane-manager';

export default function ParkingLanesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Parking Lane Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Live Parking Lane Status</CardTitle>
                <CardDescription>
                    View real-time status of all parking lanes. Trailers assigned via Inbound/Outbound processing are shown here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ParkingLaneManager />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
