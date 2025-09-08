
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { YardCheckInForm } from '@/components/dashboard/yard-check-in-form';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Separator } from '@/components/ui/separator';

export default function YardCheckInPage() {
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
            <YardCheckInForm />
            <Separator className="my-8" />
            <div>
                <h3 className="text-lg font-medium mb-2">Attach Documents (Optional)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Use your device's camera to capture a new document or upload an existing file from your computer.
                </p>
                <DocumentUpload />
            </div>
        </CardContent>
        </Card>
      </main>
    </div>
  );
}
