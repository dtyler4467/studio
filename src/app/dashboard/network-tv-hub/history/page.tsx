
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function NetworkTvHistoryPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Network TV History" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <History />
                    Content History
                </CardTitle>
                <CardDescription>
                    A log of all changes, uploads, and edits made to the network TV content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Content history log coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
