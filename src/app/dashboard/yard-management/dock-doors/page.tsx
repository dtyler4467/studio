
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DockDoorManager } from '@/components/dashboard/dock-door-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrailerMoveForm } from '@/components/dashboard/trailer-move-form';
import { Move, Warehouse, ArchiveRestore } from 'lucide-react';
import { LostAndFoundTable } from '@/components/dashboard/lost-and-found-table';

export default function DockDoorsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Dock Door Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="doors">
             <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="doors"><Warehouse className="mr-2" />Doors</TabsTrigger>
                <TabsTrigger value="move"><Move className="mr-2" />Move Trailer</TabsTrigger>
                <TabsTrigger value="lost"><ArchiveRestore className="mr-2" />Lost &amp; Found</TabsTrigger>
            </TabsList>
            <TabsContent value="doors">
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
            </TabsContent>
            <TabsContent value="move">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Move a Trailer</CardTitle>
                        <CardDescription>
                            Select a trailer from a dock door or parking lane and a destination lane to move it.
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
