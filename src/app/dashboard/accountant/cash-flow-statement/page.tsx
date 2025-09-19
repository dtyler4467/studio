
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CashFlowStatementPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Cash Flow Statement" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Cash Flow Statement</CardTitle>
                <CardDescription>
                    A financial statement that provides data about the cash inflows and outflows of a company during a specific period.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Cash Flow Statement content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
