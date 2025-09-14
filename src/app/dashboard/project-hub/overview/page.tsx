
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { View } from 'lucide-react';

export default function ProjectHubOverviewPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Hub Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <View />
                    Project Overview
                </CardTitle>
                <CardDescription>
                    A high-level view of all ongoing projects, deadlines, and team progress.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Project overview content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
