
"use client";

import { useSchedule, BillOfLading } from "@/hooks/use-schedule";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestion, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DetailItem = ({ label, value }: { label: string, value: string | number | undefined}) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
);

const createPrintableHTML = (bol: BillOfLading) => {
    return `
      <html>
        <head>
          <title>Bill of Lading - ${bol.bolNumber}</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <h1>Bill of Lading: ${bol.bolNumber}</h1>
          <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          <table>
            <tr><th>Attribute</th><th>Value</th></tr>
            <tr><td>Customer</td><td>${bol.customer}</td></tr>
            <tr><td>Origin</td><td>${bol.origin}</td></tr>
            <tr><td>Destination</td><td>${bol.destination}</td></tr>
            <tr><td>Carrier</td><td>${bol.carrier}</td></tr>
            <tr><td>Delivery Date</td><td>${format(new Date(bol.deliveryDate), 'PPP')}</td></tr>
          </table>
          ${bol.documentUri ? `<h2>BOL Document</h2><img src="${bol.documentUri}" alt="BOL Document" />` : '<h2>No Document Attached</h2>'}
          ${bol.otherDocuments ? bol.otherDocuments.map(doc => `<h2>Attached Document</h2><img src="${doc.uri}" alt="${doc.name}" />`).join('') : ''}
        </body>
      </html>
    `;
};


export default function BolDocumentPage() {
  const { bolHistory } = useSchedule();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [bol, setBol] = useState<BillOfLading | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id === 'string') {
        const foundBol = bolHistory.find(b => b.id === id);
        setBol(foundBol);
    }
  }, [id, bolHistory]);

  const handlePrint = () => {
    if (!bol) {
        toast({ variant: 'destructive', title: "Error", description: "Cannot print BOL data." });
        return;
    }
    const printableHTML = createPrintableHTML(bol);
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printableHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleEmail = () => {
    if (!bol) {
        toast({ variant: 'destructive', title: "Error", description: "Cannot email BOL data." });
        return;
    }
    const subject = `Bill of Lading: ${bol.bolNumber}`;
    const body = `Please see the details for BOL #${bol.bolNumber}:\n\n` +
                 `Customer: ${bol.customer}\n` +
                 `Origin: ${bol.origin}\n` +
                 `Destination: ${bol.destination}\n` +
                 `Carrier: ${bol.carrier}\n` +
                 `Delivery Date: ${format(new Date(bol.deliveryDate), 'PPP')}\n\n` +
                 `This is an automated message.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (bol === undefined) {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Loading BOL..." />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                    <CardContent><Skeleton className="w-full h-96" /></CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (bol === null) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle={`BOL: ${bol.bolNumber}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Bill of Lading Details</CardTitle>
                        <CardDescription>
                            Viewing details for BOL <span className="font-semibold">{bol.bolNumber}</span>.
                        </CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="mr-2" /> Print
                        </Button>
                         <Button variant="outline" size="sm" onClick={handleEmail}>
                            <Mail className="mr-2" /> Email
                        </Button>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Shipment Information</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                <DetailItem label="BOL Number" value={bol.bolNumber} />
                                <DetailItem label="Customer" value={bol.customer} />
                                <DetailItem label="Origin" value={bol.origin} />
                                <DetailItem label="Destination" value={bol.destination} />
                                <DetailItem label="Carrier" value={bol.carrier} />
                                <DetailItem label="Delivery Date" value={format(new Date(bol.deliveryDate), 'PPP')} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">BOL Document</h3>
                        <div className="border rounded-md p-2 bg-muted h-[600px] flex items-center justify-center">
                            {bol.documentUri ? (
                                <Image
                                    src={bol.documentUri}
                                    alt="BOL document"
                                    width={800}
                                    height={1100}
                                    className="object-contain max-h-full max-w-full rounded-md"
                                />
                            ) : (
                                <Alert variant="default" className="max-w-sm mx-auto">
                                    <FileQuestion className="h-4 w-4" />
                                    <AlertTitle>No Document Attached</AlertTitle>
                                    <AlertDescription>
                                        There was no document uploaded for this BOL.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                        {bol.otherDocuments && bol.otherDocuments.map((doc, index) => (
                             <div key={index} className="space-y-4 mt-4">
                                <h3 className="text-lg font-semibold">{doc.name}</h3>
                                <div className="border rounded-md p-2 bg-muted h-[600px] flex items-center justify-center">
                                    <Image
                                        src={doc.uri}
                                        alt={doc.name}
                                        width={800}
                                        height={1100}
                                        className="object-contain max-h-full max-w-full rounded-md"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
