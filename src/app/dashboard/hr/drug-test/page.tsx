
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DrugTestPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Drug Testing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Drug Testing Consent & Results</CardTitle>
                <CardDescription>
                    Manage drug testing consent forms and results.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Drug testing form content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
