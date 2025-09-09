import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

export default function DriverHubPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Driver Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Gamepad2 />
                    Driver Hub
                </CardTitle>
                <CardDescription>
                    Your central command for all driver-related activities and information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Driver Hub content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
