
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CompaniesDataTable } from '@/components/dashboard/companies-data-table';

export default function CrmCompaniesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="CRM Companies" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Companies</CardTitle>
                <CardDescription>
                    Track accounts and company-level information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CompaniesDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
