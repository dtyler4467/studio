
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AiAssistantChat } from '@/components/dashboard/ai-assistant-chat';

export default function AiAssistantPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="AI Assistant" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Assistant</CardTitle>
            <CardDescription>
              Your intelligent partner for logistics management. Ask a question to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiAssistantChat />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
