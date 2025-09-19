
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LiabilitiesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Liabilities" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Liabilities</CardTitle>
                <CardDescription>
                    Obligations that a company owes to external parties, which can be current or long-term.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Liabilities content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
