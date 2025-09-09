
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DockDoorManager } from '@/components/dashboard/dock-door-manager';

export default function DockDoorsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Dock Door Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Live Dock Door Status</CardTitle>
                <CardDescription>
                    View real-time status of all dock doors. Trailers assigned via Inbound/Outbound processing are shown here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DockDoorManager />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
