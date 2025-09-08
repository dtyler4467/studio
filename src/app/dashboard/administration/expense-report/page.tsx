
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function AdminExpenseReportPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Expense Reports" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Expense Reports</CardTitle>
                <CardDescription>
                    Review, approve, and process submitted expense reports from drivers and personnel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center rounded-md border border-dashed h-96 text-center">
                    <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Expense Report Management Coming Soon</p>
                    <p className="text-sm text-muted-foreground">This area will allow you to track and manage all employee expenses.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
