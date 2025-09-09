
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OfficePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Office" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Office</CardTitle>
            <CardDescription>
              This is the office page for appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Office page content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
