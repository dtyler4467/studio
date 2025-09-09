

"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

type Prompt = {
    category: string;
    questions: string[];
}

const initialPrompts: Prompt[] = [
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
            "Show me all pending time off requests.",
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

export function AddPromptDialog() {
    // This is a placeholder. In a real app, this would be connected to a global state or context.
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [newPromptText, setNewPromptText] = useState('');
    const [newPromptDescription, setNewPromptDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    
    const handleSave = () => {
        const category = newCategory || selectedCategory;
        if (!category || !newPromptText) {
             toast({
                variant: "destructive",
                title: "Incomplete",
                description: "Please fill out both the prompt and category.",
            });
            return;
        }
        // In a real app, this would call a function from context to update the state
        console.log({ category, question: newPromptText, description: newPromptDescription });
        toast({
            title: "Prompt Added!",
            description: "Your new prompt has been added to the library.",
        });
        setIsOpen(false);
        setNewPromptText('');
        setNewPromptDescription('');
        setSelectedCategory('');
        setNewCategory('');
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> New Prompt
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Add New Prompt</DialogTitle>
                    <DialogDescription>
                        Create a new prompt and add it to an existing or new category.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prompt-text" className="text-right">Prompt</Label>
                        <Input 
                            id="prompt-text" 
                            value={newPromptText}
                            onChange={(e) => setNewPromptText(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., How many shipments are scheduled today?"
                        />
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="prompt-description" className="text-right pt-2">Description</Label>
                        <Textarea
                            id="prompt-description"
                            value={newPromptDescription}
                            onChange={(e) => setNewPromptDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Explain what this prompt will do..."
                         />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value);
                                if (value !== 'new') setNewCategory('');
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialPrompts.map(p => (
                                    <SelectItem key={p.category} value={p.category}>{p.category}</SelectItem>
                                ))}
                                <SelectItem value="new">Create new category...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedCategory === 'new' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-category" className="text-right">New Category</Label>
                            <Input 
                                id="new-category" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Reports"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Prompt</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export function AiPromptLibrary() {
  const router = useRouter();
  const [prompts, setPrompts] = useState(initialPrompts);

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
