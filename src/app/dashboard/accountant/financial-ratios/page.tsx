
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function FinancialRatiosPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Financial Ratios" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Financial Ratios</CardTitle>
                <CardDescription>
                    Metrics used to evaluate the financial performance of a company, such as liquidity ratios, profitability ratios, and leverage ratios.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Financial Ratios content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
