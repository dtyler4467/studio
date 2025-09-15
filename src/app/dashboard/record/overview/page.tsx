
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Videotape } from 'lucide-react';

export default function RecordOverviewPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Recording Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Videotape />
                    Recording Dashboard
                </CardTitle>
                <CardDescription>
                    Review your saved screen and voice recordings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Overview content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
