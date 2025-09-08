
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestion, Mail, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DetailItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
);

const createPrintableHTML = (event: YardEvent) => {
    return `
      <html>
        <head>
          <title>Gate Event Report - ${event.id}</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
            .capitalize { text-transform: capitalize; }
          </style>
        </head>
        <body>
          <h1>Gate Event Report</h1>
          <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          <h2>Event ID: ${event.id}</h2>
          <table>
            <tr><th>Attribute</th><th>Value</th></tr>
            <tr><td>Date & Time</td><td>${format(event.timestamp, 'Pp')}</td></tr>
            <tr><td>Type</td><td class="capitalize">${event.transactionType}</td></tr>
            <tr><td>Trailer ID</td><td>${event.trailerId}</td></tr>
            <tr><td>Seal #</td><td>${event.sealNumber || 'N/A'}</td></tr>
            <tr><td>Carrier</td><td>${event.carrier} (SCAC: ${event.scac})</td></tr>
            <tr><td>Driver</td><td>${event.driverName}</td></tr>
            <tr><td>Clerk</td><td>${event.clerkName}</td></tr>
            <tr><td>Load/BOL #</td><td>${event.loadNumber}</td></tr>
            <tr><td>Assignment</td><td class="capitalize">${event.assignmentType.replace(/_/g, ' ')}${event.assignmentValue ? `: ${event.assignmentValue}` : ''}</td></tr>
          </table>
          ${event.documentDataUri ? `<h2>Attached Document</h2><img src="${event.documentDataUri}" alt="Attached Document" />` : '<h2>No Document Attached</h2>'}
        </body>
      </html>
    `;
};


export default function DocumentViewerPage() {
  const { getYardEventById } = useSchedule();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [event, setEvent] = useState<YardEvent | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id === 'string') {
        const foundEvent = getYardEventById(id);
        setEvent(foundEvent);
    }
  }, [id, getYardEventById]);

  const handlePrint = () => {
    if (!event) {
        toast({ variant: 'destructive', title: "Error", description: "Cannot print event data." });
        return;
    }
    const printableHTML = createPrintableHTML(event);
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printableHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleEmail = () => {
    if (!event) {
        toast({ variant: 'destructive', title: "Error", description: "Cannot email event data." });
        return;
    }
    const subject = `Details for Gate Event: ${event.id}`;
    const body = [
        `Event ID: ${event.id}`,
        `Date: ${format(event.timestamp, 'Pp')}`,
        `Type: ${event.transactionType}`,
        `Trailer: ${event.trailerId}`,
        `Carrier: ${event.carrier}`,
        `Driver: ${event.driverName}`,
        `Clerk: ${event.clerkName}`,
        `---`
    ].join('\n');
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


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
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="mr-2" /> Print
                        </Button>
                         <Button variant="outline" size="sm" onClick={handleEmail}>
                            <Mail className="mr-2" /> Email
                        </Button>
                        <Badge variant={event.transactionType === 'inbound' ? 'secondary' : 'outline'} className="capitalize text-base">{event.transactionType}</Badge>
                     </div>
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
                                <DetailItem label="Seal Number" value={event.sealNumber} />
                                <DetailItem label="Carrier" value={event.carrier} />
                                <DetailItem label="SCAC" value={event.scac} />
                                <DetailItem label="Driver" value={event.driverName} />
                                <DetailItem label="Processing Clerk" value={event.clerkName} />
                                <DetailItem label="Assignment" value={assignmentDetails} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Attached Document</h3>
                        <div className="border rounded-md p-2 bg-muted h-[600px] flex items-center justify-center">
                            {event.documentDataUri ? (
                                <Image
                                    src={event.documentDataUri}
                                    alt="Attached document"
                                    width={800}
                                    height={1100}
                                    className="object-contain max-h-full max-w-full rounded-md"
                                />
                            ) : (
                                <Alert variant="default" className="max-w-sm mx-auto">
                                    <FileQuestion className="h-4 w-4" />
                                    <AlertTitle>No Document Attached</AlertTitle>
                                    <AlertDescription>
                                        There was no document uploaded for this gate event.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
