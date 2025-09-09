import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminTermsAndAgreementsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Terms & Agreements" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Terms & Agreements</CardTitle>
                <CardDescription>
                    Review the terms of service and other legal agreements.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Terms and agreements content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
