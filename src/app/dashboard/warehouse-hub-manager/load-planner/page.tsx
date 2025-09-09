import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function LoadPlannerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Load Planner" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ClipboardList />
                Load Planner
            </CardTitle>
            <CardDescription>
              Plan and optimize outbound loads for shipping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Load planner content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
