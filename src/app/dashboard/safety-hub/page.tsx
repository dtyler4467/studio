
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function SafetyHubPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Safety Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ShieldCheck />
                Safety Hub
            </CardTitle>
            <CardDescription>
              A central place for all safety-related information, reporting, and resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Safety Hub content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
