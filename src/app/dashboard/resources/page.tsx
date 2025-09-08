
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrainingProgramList } from '@/components/dashboard/training-program-list';

export default function ResourcesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Training Resources" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Training & Onboarding</CardTitle>
            <CardDescription>
              Access assigned training modules for onboarding and annual requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrainingProgramList />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
