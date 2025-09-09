
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const prompts = [
    {
        category: "Yard Management",
        questions: [
            "How many trailers are in the yard?",
            "What is the status of dock door D4?",
            "Show me the gate history from yesterday.",
        ]
    },
    {
        category: "Personnel",
        questions: [
            "Who is on shift today?",
            "What is Jane Doe's schedule for next week?",
            "Show me pending user registrations.",
        ]
    },
    {
        category: "Creative",
        questions: [
            "Generate an image of a futuristic logistics warehouse.",
            "Write a short blog post about the importance of on-time delivery.",
            "Draw a picture of a cargo ship at sea.",
        ]
    },
    {
        category: "General Knowledge",
        questions: [
            "What are the current DOT regulations for driver hours?",
            "Are there any major weather events affecting routes in the Midwest?",
            "Explain what a 'bill of lading' is.",
        ]
    }
];

export function AiPromptLibrary() {
  const router = useRouter();

  const handlePromptClick = (question: string) => {
    const encodedQuestion = encodeURIComponent(question);
    router.push(`/dashboard/ai-assistant?prompt=${encodedQuestion}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {prompts.map((promptCategory) => (
        <Card key={promptCategory.category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Lightbulb className="w-5 h-5 text-primary" />
                {promptCategory.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {promptCategory.questions.map((question) => (
                <li key={question}>
                  <button
                    onClick={() => handlePromptClick(question)}
                    className="w-full text-left p-3 rounded-md border text-sm transition-colors hover:bg-muted/50 flex justify-between items-center group"
                  >
                    <span>{question}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
