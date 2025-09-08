
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DocumentUpload } from '@/components/dashboard/document-upload';

export default function DocumentUploadPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Upload Documents" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Attach Documents to a Load</CardTitle>
            <CardDescription>
              Use your device's camera to capture a new document or upload an existing file from your computer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUpload />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
