
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ClearingHousePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Clearinghouse" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">FMCSA Clearinghouse</CardTitle>
                <CardDescription>
                    Manage queries and consent for the FMCSA Clearinghouse.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Clearinghouse content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
