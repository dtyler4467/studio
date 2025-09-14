
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { KanbanSquare } from 'lucide-react';

export default function ProjectTasksPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Tasks" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <KanbanSquare />
                    Task Management
                </CardTitle>
                <CardDescription>
                    Assign tasks, track progress, and manage your team's workload using a Kanban board or list view.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Task board and assignment features coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
