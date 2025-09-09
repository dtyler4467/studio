
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrainingManagementTable } from '@/components/dashboard/training-management-table';

export default function AdminTrainingPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Assign Task Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Task Assignments</CardTitle>
                <CardDescription>
                    Assign tasks to employees and track their completion status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TrainingManagementTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
