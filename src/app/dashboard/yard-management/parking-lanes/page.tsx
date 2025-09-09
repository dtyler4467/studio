
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ParkingLaneManager } from '@/components/dashboard/parking-lane-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LostAndFoundTable } from '@/components/dashboard/lost-and-found-table';
import { TrailerMoveForm } from '@/components/dashboard/trailer-move-form';
import { Move, ParkingCircle, ArchiveRestore } from 'lucide-react';

export default function ParkingLanesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Parking Lane Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="lanes">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="lanes"><ParkingCircle className="mr-2" />Lanes</TabsTrigger>
                <TabsTrigger value="move"><Move className="mr-2" />Move Trailer</TabsTrigger>
                <TabsTrigger value="lost"><ArchiveRestore className="mr-2" />Lost & Found</TabsTrigger>
            </TabsList>
             <TabsContent value="lanes">
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
             </TabsContent>
             <TabsContent value="move">
                <Card>
                     <CardHeader>
                        <CardTitle className="font-headline">Move a Trailer</CardTitle>
                        <CardDescription>
                            Select a trailer and a destination lane to move it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrailerMoveForm />
                    </CardContent>
                </Card>
             </TabsContent>
             <TabsContent value="lost">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Lost & Found Trailers</CardTitle>
                        <CardDescription>
                            This section contains trailers that were moved from a lane that was already occupied.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LostAndFoundTable />
                    </CardContent>
                </Card>
             </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
