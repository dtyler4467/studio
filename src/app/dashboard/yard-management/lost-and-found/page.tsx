
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LostAndFoundTable } from '@/components/dashboard/lost-and-found-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrailerMoveForm } from '@/components/dashboard/trailer-move-form';
import { Move, ArchiveRestore, ArrowLeftRight } from 'lucide-react';
import { YardCheckInPageContent } from '@/components/dashboard/yard-check-in-page-content';

export default function LostAndFoundPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Lost & Found" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="lost">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="lost"><ArchiveRestore className="mr-2" />Lost & Found</TabsTrigger>
                <TabsTrigger value="move"><Move className="mr-2" />Move Trailer</TabsTrigger>
                <TabsTrigger value="check-in-out"><ArrowLeftRight className="mr-2" />Check In/Out</TabsTrigger>
            </TabsList>
             <TabsContent value="lost">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Lost & Found Trailers</CardTitle>
                        <CardDescription>
                            This section contains trailers that were moved from a lane that was already occupied. You can move them to an available lane from here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LostAndFoundTable />
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
             <TabsContent value="check-in-out">
                <YardCheckInPageContent />
             </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
