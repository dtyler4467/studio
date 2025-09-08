
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExpenseReportDataTable } from '@/components/dashboard/expense-report-data-table';

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
                 <ExpenseReportDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
