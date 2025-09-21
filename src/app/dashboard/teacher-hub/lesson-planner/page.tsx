
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, Lightbulb, Pencil, CheckSquare, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

type Lesson = {
    id: string;
    date: Date;
    subject: string;
    title: string;
    objective: string;
    materials: string;
    activities: string;
    assessment: string;
};

const getInitialLessons = (): Lesson[] => [
    {
        id: 'L1',
        date: new Date(),
        subject: 'Mathematics',
        title: 'Introduction to Algebra',
        objective: 'Students will be able to solve basic linear equations.',
        materials: 'Whiteboard, markers, worksheets',
        activities: '1. Warm-up problems.\n2. Lecture on variables and constants.\n3. Group work on practice problems.',
        assessment: 'Worksheet completion and exit ticket.'
    },
    {
        id: 'L2',
        date: new Date(),
        subject: 'English Language Arts',
        title: 'The Great Gatsby - Chapter 1',
        objective: 'Students will analyze the characters and setting introduced in the first chapter.',
        materials: 'The Great Gatsby book, notebooks',
        activities: '1. Read chapter 1 aloud.\n2. Group discussion on first impressions.\n3. Journal entry from Nick Carraway\'s perspective.',
        assessment: 'Participation in discussion and journal entry.'
    },
    {
        id: 'L3',
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        subject: 'Science',
        title: 'The Water Cycle',
        objective: 'Students will be able to describe the stages of the water cycle.',
        materials: 'Diagrams, beakers, hot plate, ice',
        activities: '1. Watch a video on the water cycle.\n2. In-class demonstration of evaporation and condensation.\n3. Students draw and label their own water cycle diagrams.',
        assessment: 'Labeled diagram accuracy.'
    },
];

function AddLessonDialog({ onSave, onOpenChange, isOpen, initialDate }: { onSave: (lesson: Omit<Lesson, 'id'>) => void, onOpenChange: (open: boolean) => void, isOpen: boolean, initialDate?: Date }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        date: initialDate || new Date(),
        subject: 'Mathematics',
        title: '',
        objective: '',
        materials: '',
        activities: '',
        assessment: '',
    });

    React.useEffect(() => {
        if (initialDate) {
            setFormData(prev => ({ ...prev, date: initialDate }));
        }
    }, [initialDate]);

    const handleSave = () => {
        if (!formData.title || !formData.subject || !formData.objective) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out at least Title, Subject, and Objective.'});
            return;
        }
        onSave(formData);
        onOpenChange(false);
        // Reset form
        setFormData({ date: new Date(), subject: 'Mathematics', title: '', objective: '', materials: '', activities: '', assessment: '' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Lesson Plan</DialogTitle>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Lesson Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => d && setFormData({...formData, date: d})} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Lesson Title</Label>
                                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select value={formData.subject} onValueChange={(val) => setFormData({...formData, subject: val})}>
                                    <SelectTrigger id="subject"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="English Language Arts">English Language Arts</SelectItem>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                                        <SelectItem value="Art">Art</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="objective">Objective</Label>
                            <Textarea id="objective" placeholder="What will students be able to do?" value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="materials">Materials</Label>
                            <Textarea id="materials" placeholder="List all required materials..." value={formData.materials} onChange={e => setFormData({...formData, materials: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="activities">Activities / Procedure</Label>
                            <Textarea id="activities" className="h-24" placeholder="Describe the lesson flow..." value={formData.activities} onChange={e => setFormData({...formData, activities: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="assessment">Assessment / Homework</Label>
                            <Textarea id="assessment" placeholder="How will you check for understanding?" value={formData.assessment} onChange={e => setFormData({...formData, assessment: e.target.value})} />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Lesson</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function LessonPlannerPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setLessons(getInitialLessons());
        setSelectedDate(new Date());
    }, []);

    const handleAddLesson = (lesson: Omit<Lesson, 'id'>) => {
        const newLesson = { ...lesson, id: `L${Date.now()}` };
        setLessons(prev => [...prev, newLesson]);
        toast({ title: 'Lesson Created', description: `Your lesson "${lesson.title}" has been scheduled.` });
    };

    const lessonsByDate = useMemo(() => {
        return lessons.reduce((acc, lesson) => {
            const dateKey = format(lesson.date, 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(lesson);
            return acc;
        }, {} as Record<string, Lesson[]>);
    }, [lessons]);

    const selectedDayLessons = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return lessonsByDate[dateKey] || [];
    }, [selectedDate, lessonsByDate]);

    const lessonsBySubject = useMemo(() => {
        return selectedDayLessons.reduce((acc, lesson) => {
            if (!acc[lesson.subject]) acc[lesson.subject] = [];
            acc[lesson.subject].push(lesson);
            return acc;
        }, {} as Record<string, Lesson[]>);
    }, [selectedDayLessons]);
    
    const lessonDates = Object.keys(lessonsByDate);
    const modifiers = { scheduled: lessonDates.map(dateStr => new Date(dateStr + 'T00:00:00')) };
    const modifiersStyles = { scheduled: { border: "2px solid hsl(var(--primary))", borderRadius: 'var(--radius)' }};

    if (!selectedDate) {
        return null; // or a loading skeleton
    }

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Lesson Planner" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="font-headline">Calendar</CardTitle>
                            <CardDescription>Select a date to view or add lessons.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                className="rounded-md border p-0"
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                            />
                            <Button className="w-full mt-4" onClick={() => setAddDialogOpen(true)}><PlusCircle className="mr-2"/> Add New Lesson</Button>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline">Lessons for {format(selectedDate, 'PPP')}</CardTitle>
                            <CardDescription>A summary of planned lessons for the selected day.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ScrollArea className="h-[60vh] pr-4">
                                {Object.keys(lessonsBySubject).length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(lessonsBySubject).map(([subject, subjectLessons]) => (
                                            <div key={subject}>
                                                <h3 className="text-lg font-semibold text-primary border-b pb-1 mb-2">{subject}</h3>
                                                {subjectLessons.map(lesson => (
                                                     <div key={lesson.id} className="p-3 border rounded-md space-y-3">
                                                         <div className="flex justify-between items-start">
                                                            <h4 className="font-semibold">{lesson.title}</h4>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4"/></Button>
                                                         </div>
                                                         <div className="space-y-2 text-sm text-muted-foreground">
                                                            <p><strong className="text-foreground font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Objective:</strong> {lesson.objective}</p>
                                                            <p><strong className="text-foreground font-medium flex items-center gap-2"><BookOpen className="w-4 h-4"/> Activities:</strong> {lesson.activities}</p>
                                                            <p><strong className="text-foreground font-medium flex items-center gap-2"><CheckSquare className="w-4 h-4"/> Assessment:</strong> {lesson.assessment}</p>
                                                         </div>
                                                     </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <p className="text-lg font-semibold">No lessons planned for this day.</p>
                                        <p className="text-muted-foreground text-sm">Click "Add New Lesson" to get started.</p>
                                    </div>
                                )}
                             </ScrollArea>
                        </CardContent>
                    </Card>
                 </div>
                 <AddLessonDialog onSave={handleAddLesson} isOpen={isAddDialogOpen} onOpenChange={setAddDialogOpen} initialDate={selectedDate} />
            </main>
        </div>
    );
}
