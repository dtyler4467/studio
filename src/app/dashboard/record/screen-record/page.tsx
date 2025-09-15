
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Monitor } from 'lucide-react';

export default function ScreenRecordPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Screen Record" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Monitor />
                    Screen Recording
                </CardTitle>
                <CardDescription>
                    Start, stop, and manage your screen recordings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Screen recording functionality coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
