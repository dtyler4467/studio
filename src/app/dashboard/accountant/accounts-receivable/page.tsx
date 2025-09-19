
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AccountsReceivablePage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Accounts Receivable" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Accounts Receivable</CardTitle>
                <CardDescription>
                    Money owed to a company by its customers for goods or services delivered but not yet paid for.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Accounts Receivable content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
