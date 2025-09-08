
"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useSchedule, TrainingModule, TrainingQuestion } from "@/hooks/use-schedule";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Award, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function ModuleExamPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { getTrainingModuleById } = useSchedule();
    const { id } = params;

    const [module, setModule] = useState<TrainingModule | null | undefined>(undefined);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    
    useEffect(() => {
        if (typeof id === 'string') {
            const foundModule = getTrainingModuleById(id);
            setModule(foundModule);
        }
    }, [id, getTrainingModuleById]);

    if (!module?.exam) {
        notFound();
    }
    const { exam } = module;
    
    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < exam.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
            toast({
                title: "Exam Completed!",
                description: `You scored ${score} out of ${exam.length}.`,
            });
        }
    };

    const score = Object.entries(selectedAnswers).reduce((correctCount, [questionIndex, selectedAnswer]) => {
        const question = exam[parseInt(questionIndex)];
        if (question.correctAnswer === selectedAnswer) {
            return correctCount + 1;
        }
        return correctCount;
    }, 0);
    const progress = ((currentQuestionIndex + (isFinished ? 1 : 0)) / exam.length) * 100;
    const passingScore = exam.length * 0.8;
    const hasPassed = score >= passingScore;

    if (module === undefined) {
         return (
            <div className="flex flex-col w-full">
                <Header pageTitle="Loading Exam..." />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 justify-center items-center">
                    <Skeleton className="h-96 w-full max-w-2xl" />
                </main>
            </div>
        )
    }

    if (isFinished) {
        return (
             <div className="flex flex-col w-full">
                <Header pageTitle={`Exam Results: ${module.title}`} />
                 <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader className="text-center">
                            <Award className={cn("w-16 h-16 mx-auto", hasPassed ? "text-green-500" : "text-destructive")} />
                            <CardTitle className="font-headline text-3xl mt-4">
                                {hasPassed ? "Congratulations! You Passed!" : "Needs Improvement"}
                            </CardTitle>
                            <CardDescription>
                                You answered {score} out of {exam.length} questions correctly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="text-center">
                                <p className="text-lg font-semibold">{hasPassed ? "Excellent work!" : "Please review the material and try again."}</p>
                             </div>
                             <div className="space-y-2">
                                {exam.map((q, index) => {
                                     const userAnswer = selectedAnswers[index];
                                     const isCorrect = userAnswer === q.correctAnswer;
                                     return (
                                        <div key={index} className="p-3 border rounded-md bg-muted/50">
                                            <p className="font-semibold flex items-center gap-2">
                                                {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500"/> : <XCircle className="w-4 h-4 text-destructive"/>}
                                                {q.question}
                                            </p>
                                            <p className="text-sm pl-6">
                                                Your answer: <span className={cn(isCorrect ? 'text-green-600' : 'text-destructive')}>{userAnswer}</span>
                                                {!isCorrect && <span className="text-muted-foreground ml-2">(Correct: {q.correctAnswer})</span>}
                                            </p>
                                        </div>
                                     );
                                })}
                             </div>
                             <Button onClick={() => router.push('/dashboard/resources')} className="w-full">
                                Back to Training
                             </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }
    
    const currentQuestion = exam[currentQuestionIndex];

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle={`Exam: ${module.title}`} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-muted-foreground">Return to Module</h1>
                </div>
                <Card className="max-w-4xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="font-headline">Question {currentQuestionIndex + 1} of {exam.length}</CardTitle>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <p className="text-lg font-semibold">{currentQuestion.question}</p>
                         <RadioGroup 
                            onValueChange={handleAnswerSelect} 
                            value={selectedAnswers[currentQuestionIndex]}
                            className="space-y-2"
                         >
                            {currentQuestion.options.map((option, index) => (
                                <Label key={index} className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                                    <span>{option}</span>
                                </Label>
                            ))}
                         </RadioGroup>
                         <Button 
                            onClick={handleNextQuestion} 
                            disabled={!selectedAnswers[currentQuestionIndex]}
                            className="w-full"
                         >
                            {currentQuestionIndex < exam.length - 1 ? "Next Question" : "Finish Exam"}
                            <ChevronsRight className="ml-2" />
                         </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
