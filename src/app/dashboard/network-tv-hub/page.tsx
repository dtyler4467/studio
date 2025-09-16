
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tv } from 'lucide-react';

export default function NetworkTvHubPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Network TV Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Tv />
                Network TV Hub
            </CardTitle>
            <CardDescription>
              This is the central hub for managing all network television related activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Network TV Hub content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
