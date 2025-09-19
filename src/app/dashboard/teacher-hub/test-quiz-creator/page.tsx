
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

export default function TestQuizCreatorPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Test/Quiz Creator" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <CheckSquare />
                Test/Quiz Creator
            </CardTitle>
            <CardDescription>
              Build, manage, and distribute tests and quizzes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Tools for creating tests and quizzes will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
