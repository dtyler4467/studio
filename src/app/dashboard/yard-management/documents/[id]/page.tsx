
"use client";

import { useSchedule, YardEvent } from "@/hooks/use-schedule";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DetailItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
);

export default function DocumentViewerPage() {
  const { getYardEventById } = useSchedule();
  const params = useParams();
  const { id } = params;
  const [event, setEvent] = useState<YardEvent | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id === 'string') {
        const foundEvent = getYardEventById(id);
        setEvent(foundEvent);
    }
  }, [id, getYardEventById]);

  if (event === undefined) {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Loading Documents..." />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                             </div>
                             <div>
                                <Skeleton className="w-full h-96" />
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (event === null) {
    notFound();
  }

  const assignmentDetails = `${event.assignmentType.replace(/_/g, ' ')}${event.assignmentValue ? `: ${event.assignmentValue}` : ''}`;

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle={`Documents for Load ${event.loadNumber}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Gate Event Details</CardTitle>
                        <CardDescription>
                            Viewing documents and details for trailer <span className="font-semibold">{event.trailerId}</span> from <span className="font-semibold">{format(event.timestamp, 'Pp')}</span>.
                        </CardDescription>
                    </div>
                     <Badge variant={event.transactionType === 'inbound' ? 'secondary' : 'outline'} className="capitalize text-lg">{event.transactionType}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Shipment Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                <DetailItem label="Trailer ID" value={event.trailerId} />
                                <DetailItem label="Load/BOL Number" value={event.loadNumber} />
                                <DetailItem label="Carrier" value={event.carrier} />
                                <DetailItem label="SCAC" value={event.scac} />
                                <DetailItem label="Driver" value={event.driverName} />
                                <DetailItem label="Processing Clerk" value={event.clerkName} />
                                <DetailItem label="Assignment" value={assignmentDetails} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Associated Documents</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <p className="text-sm text-muted-foreground">Click to view document.</p>
                                <div className="mt-2 space-y-2">
                                    <Button variant="outline" className="w-full justify-start">Bill of Lading (BOL)</Button>
                                    <Button variant="outline" className="w-full justify-start">Gate Pass</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Document Preview</h3>
                        <div className="border rounded-md p-2 bg-muted h-[600px] flex items-center justify-center">
                            <Image
                                src="https://picsum.photos/seed/bol/800/1100"
                                alt="Bill of Lading Document"
                                width={800}
                                height={1100}
                                className="object-contain max-h-full max-w-full rounded-md"
                                data-ai-hint="document bill lading"
                             />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
