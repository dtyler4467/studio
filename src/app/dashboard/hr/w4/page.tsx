
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useState } from 'react';

export default function W4Page() {
  const [templateUri, setTemplateUri] = useState<string | null>(null);
  
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="W4 Forms" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="manage">
            <TabsList>
                <TabsTrigger value="manage">Manage Employee W4s</TabsTrigger>
                <TabsTrigger value="template">W4 Template</TabsTrigger>
            </TabsList>
            <TabsContent value="manage">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Employee W4 Forms</CardTitle>
                        <CardDescription>
                            Review and manage submitted employee W4 tax forms.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                            <p className="text-muted-foreground">Submitted employee W4 forms will be listed here.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="template">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Upload W4 Template</CardTitle>
                        <CardDescription>
                            Upload a blank W4 PDF form to be sent out to personnel for completion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DocumentUpload onDocumentChange={setTemplateUri} currentDocument={templateUri} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
