
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AiPromptLibrary } from '@/components/dashboard/ai-prompt-library';

export default function AiPromptsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="AI Prompts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Prompt Library</CardTitle>
            <CardDescription>
              Select a prompt to quickly ask the AI Assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiPromptLibrary />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
