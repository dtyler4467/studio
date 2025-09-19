
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function LessonPlannerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Lesson Planner" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ClipboardList />
                Lesson Planner
            </CardTitle>
            <CardDescription>
              Create, organize, and schedule your lessons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Lesson planner content will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
