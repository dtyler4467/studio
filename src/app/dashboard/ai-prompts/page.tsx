
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AiPromptLibrary, AddPromptDialog } from '@/components/dashboard/ai-prompt-library';
import { useState } from 'react';

export default function AiPromptsPage() {
  const [isAddOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="AI Prompts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <CardTitle className="font-headline">AI Prompt Library</CardTitle>
                <CardDescription>
                Select a prompt to quickly ask the AI Assistant, or add your own.
                </CardDescription>
            </div>
            <AddPromptDialog />
          </CardHeader>
          <CardContent>
            <AiPromptLibrary />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
