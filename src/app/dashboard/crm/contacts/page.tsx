
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CrmContactsDataTable } from '@/components/dashboard/crm-contacts-data-table';

export default function CrmContactsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="CRM Contacts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Contacts</CardTitle>
                <CardDescription>
                    A central place for all your customer and lead contact information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CrmContactsDataTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}


    