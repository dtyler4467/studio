
"use client";

import React, { useState, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2, Printer, CheckSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

type Option = {
  id: number;
  text: string;
};

type Question = {
  id: number;
  type: QuestionType;
  text: string;
  options: Option[];
  correctAnswer: string | string[]; // string for T/F and single-choice MC, array for multiple-select
};

const QuizPreview = React.forwardRef<HTMLDivElement, { title: string, description: string, questions: Question[] }>(({ title, description, questions }, ref) => {
    return (
        <div ref={ref} className="p-8 border rounded-lg bg-white text-black text-sm leading-relaxed">
            <header className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold font-headline">{title || 'Quiz Title'}</h1>
                <p className="text-muted-foreground mt-1">{description || 'Instructions will appear here.'}</p>
                <div className="flex justify-between mt-4 text-xs">
                    <span>Name: _________________________</span>
                    <span>Date: _________________________</span>
                    <span>Score: ______ / {questions.length}</span>
                </div>
            </header>
            <section className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.id}>
                        <p className="font-semibold">{index + 1}. {q.text}</p>
                        {q.type === 'multiple-choice' && (
                            <ul className="mt-2 space-y-2 pl-4">
                                {q.options.map(opt => (
                                    <li key={opt.id} className="flex items-center gap-2">
                                        <div className="h-4 w-4 border border-black rounded-sm"></div>
                                        <span>{opt.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                         {q.type === 'true-false' && (
                            <div className="mt-2 space-x-4 pl-4">
                                <span className="flex items-center gap-2"><div className="h-4 w-4 border border-black rounded-full"></div> True</span>
                                <span className="flex items-center gap-2"><div className="h-4 w-4 border border-black rounded-full"></div> False</span>
                            </div>
                        )}
                         {q.type === 'short-answer' && (
                            <div className="mt-2 border-b border-black h-12"></div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    )
});
QuizPreview.displayName = "QuizPreview";


export default function TestQuizCreatorPage() {
    const { toast } = useToast();
    const previewRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            type: 'multiple-choice',
            text: '',
            options: [{ id: 1, text: '' }],
            correctAnswer: '',
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (id: number, updates: Partial<Question>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    };
    
    const removeQuestion = (id: number) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleOptionChange = (qId: number, optId: number, text: string) => {
        updateQuestion(qId, {
            options: questions.find(q => q.id === qId)!.options.map(opt => opt.id === optId ? {...opt, text} : opt)
        });
    };

    const addOption = (qId: number) => {
        const question = questions.find(q => q.id === qId);
        if (question) {
            updateQuestion(qId, { options: [...question.options, { id: Date.now(), text: '' }] });
        }
    };

    const removeOption = (qId: number, optId: number) => {
        updateQuestion(qId, {
            options: questions.find(q => q.id === qId)!.options.filter(opt => opt.id !== optId)
        });
    }
    
     const handlePrint = () => {
        if (previewRef.current) {
            const printWindow = window.open('', '', 'height=1100,width=850');
            printWindow?.document.write('<html><head><title>Print Quiz</title>');
            const styles = Array.from(document.styleSheets)
                .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>body { font-family: sans-serif; }</style>`)
                .join('\n');
            printWindow?.document.write(`<head>${styles}</head>`);
            printWindow?.document.write('<body style="background-color: white; -webkit-print-color-adjust: exact; padding: 1rem;">');
            printWindow?.document.write(previewRef.current.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => { printWindow?.print(); }, 500);
        }
    };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Test/Quiz Creator" />
      <main className="flex-1 p-4 md:p-8">
         <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CheckSquare />
                        Quiz Builder
                    </CardTitle>
                     <CardDescription>
                        Create your quiz below. The preview will update automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="quiz-title">Quiz Title</Label>
                                <Input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Vocabulary Quiz" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quiz-description">Instructions / Description</Label>
                                <Textarea id="quiz-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Choose the best answer for each question." />
                            </div>
                            
                            <h3 className="font-semibold text-lg border-t pt-4">Questions</h3>

                            {questions.map((q, index) => (
                                <Card key={q.id} className="p-4 bg-muted/50">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold mb-2">Question {index + 1}</p>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeQuestion(q.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[1fr_auto] gap-2">
                                            <Textarea placeholder="Type your question here..." value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} />
                                             <Select value={q.type} onValueChange={(type: QuestionType) => updateQuestion(q.id, { type })}>
                                                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="true-false">True/False</SelectItem>
                                                    <SelectItem value="short-answer">Short Answer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         {q.type === 'multiple-choice' && (
                                            <div className="space-y-2 pl-4">
                                                <Label>Options & Correct Answer</Label>
                                                {q.options.map(opt => (
                                                    <div key={opt.id} className="flex items-center gap-2">
                                                        <Checkbox id={`cb-${opt.id}`} checked={q.correctAnswer === opt.text} onCheckedChange={() => updateQuestion(q.id, { correctAnswer: opt.text })} />
                                                        <Input value={opt.text} onChange={(e) => handleOptionChange(q.id, opt.id, e.target.value)} />
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeOption(q.id, opt.id)}><X className="h-4 w-4"/></Button>
                                                    </div>
                                                ))}
                                                <Button variant="outline" size="sm" onClick={() => addOption(q.id)}><PlusCircle className="mr-2 h-4 w-4" /> Add Option</Button>
                                            </div>
                                        )}
                                        {q.type === 'true-false' && (
                                             <div className="space-y-2 pl-4">
                                                <Label>Correct Answer</Label>
                                                <RadioGroup value={q.correctAnswer as string} onValueChange={(val) => updateQuestion(q.id, { correctAnswer: val })} className="flex gap-4">
                                                    <div className="flex items-center space-x-2"><RadioGroupItem value="True" id={`tf-true-${q.id}`} /><Label htmlFor={`tf-true-${q.id}`}>True</Label></div>
                                                    <div className="flex items-center space-x-2"><RadioGroupItem value="False" id={`tf-false-${q.id}`} /><Label htmlFor={`tf-false-${q.id}`}>False</Label></div>
                                                </RadioGroup>
                                             </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                            <Button variant="secondary" onClick={addQuestion} className="w-full">
                                <PlusCircle className="mr-2" /> Add Question
                            </Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>This is how your quiz will appear when printed.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                        <QuizPreview ref={previewRef} title={title} description={description} questions={questions} />
                     </ScrollArea>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button variant="outline">Save Quiz</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/> Print Quiz</Button>
                </CardFooter>
            </Card>
         </div>
      </main>
    </div>
  );
}
