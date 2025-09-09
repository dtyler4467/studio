
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AiPromptsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="AI Prompts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Prompts</CardTitle>
            <CardDescription>
              Manage and create reusable AI prompts.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">AI Prompts page coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
