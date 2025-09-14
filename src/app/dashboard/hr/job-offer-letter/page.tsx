
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function JobOfferLetterPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Job Offer Letters" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Job Offer Letters</CardTitle>
                <CardDescription>
                    Create, manage, and send job offer letters to candidates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Job offer letter content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
