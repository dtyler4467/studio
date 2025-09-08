
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { YardCheckInForm, FormValues, formSchema } from '@/components/dashboard/yard-check-in-form';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Separator } from '@/components/ui/separator';
import { useSchedule } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';

export default function YardCheckInPage() {
    const { addYardEvent } = useSchedule();
    const { toast } = useToast();
    const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);

     const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            transactionType: "inbound",
            trailerId: "",
            sealNumber: "",
            carrier: "",
            scac: "",
            driverName: "",
            loadNumber: "",
            assignmentType: "empty",
            assignmentValue: "",
        },
     });

    const handleFormSubmit = (data: FormValues) => {
        addYardEvent(data, documentDataUri);
        
        const direction = data.transactionType === 'inbound' ? 'Inbound' : 'Outbound';
        let assignmentDetails = data.assignmentType.replace(/_/g, ' ');
         if (data.assignmentValue) {
            assignmentDetails += `: ${data.assignmentValue}`;
        }
        
        toast({
            title: `${direction} Event Logged`,
            description: (
                 <div className="text-sm space-y-1">
                    <p><strong>Trailer:</strong> {data.trailerId}</p>
                    <p><strong>Seal:</strong> {data.sealNumber || 'N/A'}</p>
                    <p><strong>Carrier:</strong> {data.carrier} (SCAC: {data.scac || 'N/A'})</p>
                    <p><strong>Driver:</strong> {data.driverName}</p>
                    <p className="capitalize"><strong>Assignment:</strong> {assignmentDetails}</p>
                    <p>Document {documentDataUri ? 'attached.' : 'not attached.'}</p>
                    <p><strong>Clerk:</strong> Admin User at {format(new Date(), 'p')}</p>
                 </div>
            ),
        });
        
        setDocumentDataUri(null); // Reset after submission
        form.reset();
    };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Inbound/Outbound Processing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
        <CardHeader>
            <CardTitle className="font-headline">Gate Check In/Out</CardTitle>
            <CardDescription>
            Log truck arrivals and departures at the gate, and optionally attach relevant documents.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <YardCheckInForm form={form} />
            <Separator className="my-8" />
            <div>
                <h3 className="text-lg font-medium mb-2">Attach Documents (Optional)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Use your device's camera to capture a new document or upload an existing file from your computer. The document will be submitted with the gate record.
                </p>
                <DocumentUpload onDocumentChange={setDocumentDataUri} currentDocument={documentDataUri} />
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" form="yard-check-in-form" className="w-full" onClick={form.handleSubmit(handleFormSubmit)}>
                <ArrowLeftRight className="mr-2" />
                Submit Gate Record
            </Button>
        </CardFooter>
        </Card>
      </main>
    </div>
  );
}
