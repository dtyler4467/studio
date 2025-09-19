
"use client";

import React, { useState, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, PlusCircle, Trash2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GradingCriterion = {
  id: number;
  name: string;
  weight: number;
};

type ScheduleItem = {
  id: number;
  week: string;
  topic: string;
  assignment: string;
};

const SyllabusPreview = React.forwardRef<HTMLDivElement, { syllabusData: any }>(({ syllabusData }, ref) => {
    const { courseTitle, courseCode, credits, instructorName, instructorEmail, officeHours, description, objectives, materials, gradingPolicy, schedule } = syllabusData;

    return (
        <div ref={ref} className="p-8 border rounded-lg bg-white text-black text-sm leading-relaxed">
            <header className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold font-headline">{courseTitle || '[Course Title]'}</h1>
                <p className="text-lg text-gray-600">{courseCode || '[Course Code]'} | {credits || '0'} Credits</p>
            </header>

            <section className="mb-6">
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Instructor Information</h2>
                <p><strong>Name:</strong> {instructorName || 'TBD'}</p>
                <p><strong>Email:</strong> {instructorEmail || 'TBD'}</p>
                <p><strong>Office Hours:</strong> {officeHours || 'TBD'}</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Course Description</h2>
                <p>{description || 'No description provided.'}</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Learning Objectives</h2>
                <ul className="list-disc pl-5">
                    {objectives.split('\n').filter(Boolean).map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Required Materials</h2>
                <p>{materials || 'No materials listed.'}</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Grading Policy</h2>
                <p className="mb-2">{gradingPolicy || 'Grades will be based on the following criteria.'}</p>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Category</th>
                            <th className="border p-2 text-right">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {syllabusData.gradingCriteria.map((item: GradingCriterion) => (
                            <tr key={item.id}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2 text-right">{item.weight}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b mb-2 pb-1">Course Schedule</h2>
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 w-1/6">Week</th>
                            <th className="border p-2 w-2/5">Topic</th>
                            <th className="border p-2 w-2/5">Assignments/Readings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((item: ScheduleItem) => (
                            <tr key={item.id}>
                                <td className="border p-2">{item.week}</td>
                                <td className="border p-2">{item.topic}</td>
                                <td className="border p-2">{item.assignment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
});
SyllabusPreview.displayName = 'SyllabusPreview';

export default function SyllabusCreatorPage() {
    const { toast } = useToast();
    const previewRef = useRef<HTMLDivElement>(null);
    const [syllabusData, setSyllabusData] = useState({
        courseTitle: 'Introduction to Logistics',
        courseCode: 'LOG101',
        credits: 3,
        instructorName: '',
        instructorEmail: '',
        officeHours: '',
        description: 'This course provides a comprehensive overview of logistics and supply chain management.',
        objectives: 'Understand key logistics concepts.\nAnalyze supply chain strategies.\nApply principles to real-world scenarios.',
        materials: 'Textbook: "Logistics Management" by Dr. John Smith',
        gradingPolicy: 'Final grades are determined based on the weighted average of all assignments.',
        gradingCriteria: [
            { id: 1, name: 'Homework', weight: 20 },
            { id: 2, name: 'Midterm Exam', weight: 30 },
            { id: 3, name: 'Final Project', weight: 50 },
        ],
        schedule: [
            { id: 1, week: '1', topic: 'Introduction to Supply Chain', assignment: 'Read Chapter 1' },
            { id: 2, week: '2', topic: 'Inventory Management', assignment: 'Read Chapter 2, Homework 1 Due' },
        ],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSyllabusData(prev => ({ ...prev, [name]: name === 'credits' ? parseInt(value) || 0 : value }));
    };

    const handleGradingChange = (id: number, field: 'name' | 'weight', value: string) => {
        setSyllabusData(prev => ({
            ...prev,
            gradingCriteria: prev.gradingCriteria.map(item =>
                item.id === id ? { ...item, [field]: field === 'weight' ? parseInt(value) || 0 : value } : item
            )
        }));
    };
    
    const addGradingCriterion = () => {
        setSyllabusData(prev => ({
            ...prev,
            gradingCriteria: [...prev.gradingCriteria, { id: Date.now(), name: '', weight: 0 }]
        }));
    };

    const removeGradingCriterion = (id: number) => {
        setSyllabusData(prev => ({
            ...prev,
            gradingCriteria: prev.gradingCriteria.filter(item => item.id !== id)
        }));
    };

    const handleScheduleChange = (id: number, field: 'week' | 'topic' | 'assignment', value: string) => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: prev.schedule.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const addScheduleItem = () => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: [...prev.schedule, { id: Date.now(), week: `${prev.schedule.length + 1}`, topic: '', assignment: '' }]
        }));
    };

    const removeScheduleItem = (id: number) => {
        setSyllabusData(prev => ({
            ...prev,
            schedule: prev.schedule.filter(item => item.id !== id)
        }));
    };
    
    const handlePrint = () => {
        if (previewRef.current) {
            const printWindow = window.open('', '', 'height=1100,width=850');
            printWindow?.document.write('<html><head><title>Print Syllabus</title>');
            const styles = Array.from(document.styleSheets)
                .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>${Array.from(s.cssRules).map(r => r.cssText).join('')}</style>`)
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
      <Header pageTitle="Syllabus Creator" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <BookOpen />
                            Syllabus Editor
                        </CardTitle>
                        <CardDescription>
                          Fill in the details below to create your course syllabus. The preview on the right will update live.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="font-semibold text-lg mb-2">Course Information</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="courseTitle">Course Title</Label>
                                            <Input id="courseTitle" name="courseTitle" value={syllabusData.courseTitle} onChange={handleInputChange} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="courseCode">Course Code</Label>
                                                <Input id="courseCode" name="courseCode" value={syllabusData.courseCode} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="credits">Credits</Label>
                                                <Input id="credits" name="credits" type="number" value={syllabusData.credits} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="font-semibold text-lg mb-2">Instructor Details</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="instructorName">Name</Label>
                                            <Input id="instructorName" name="instructorName" value={syllabusData.instructorName} onChange={handleInputChange} />
                                        </div>
                                         <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="instructorEmail">Email</Label>
                                                <Input id="instructorEmail" name="instructorEmail" type="email" value={syllabusData.instructorEmail} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="officeHours">Office Hours</Label>
                                                <Input id="officeHours" name="officeHours" value={syllabusData.officeHours} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <Separator />
                                <section className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Course Description</Label>
                                        <Textarea id="description" name="description" value={syllabusData.description} onChange={handleInputChange} className="h-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
                                        <Textarea id="objectives" name="objectives" value={syllabusData.objectives} onChange={handleInputChange} className="h-24" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="materials">Required Materials</Label>
                                        <Textarea id="materials" name="materials" value={syllabusData.materials} onChange={handleInputChange} className="h-20" />
                                    </div>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="font-semibold text-lg mb-2">Grading Policy</h3>
                                     <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gradingPolicy">Policy Summary</Label>
                                            <Textarea id="gradingPolicy" name="gradingPolicy" value={syllabusData.gradingPolicy} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Grading Breakdown</Label>
                                            {syllabusData.gradingCriteria.map(item => (
                                                <div key={item.id} className="flex items-center gap-2">
                                                    <Input placeholder="Category" value={item.name} onChange={(e) => handleGradingChange(item.id, 'name', e.target.value)} />
                                                    <Input type="number" placeholder="%" value={item.weight} onChange={(e) => handleGradingChange(item.id, 'weight', e.target.value)} className="w-20" />
                                                    <Button variant="ghost" size="icon" onClick={() => removeGradingCriterion(item.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={addGradingCriterion}><PlusCircle className="mr-2 h-4 w-4"/> Add Category</Button>
                                        </div>
                                    </div>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="font-semibold text-lg mb-2">Course Schedule</h3>
                                    <div className="space-y-2">
                                        {syllabusData.schedule.map(item => (
                                            <div key={item.id} className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2">
                                                <Input placeholder="Week" value={item.week} onChange={(e) => handleScheduleChange(item.id, 'week', e.target.value)} className="w-16" />
                                                <Input placeholder="Topic" value={item.topic} onChange={(e) => handleScheduleChange(item.id, 'topic', e.target.value)} />
                                                <Input placeholder="Assignment/Reading" value={item.assignment} onChange={(e) => handleScheduleChange(item.id, 'assignment', e.target.value)} />
                                                <Button variant="ghost" size="icon" onClick={() => removeScheduleItem(item.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={addScheduleItem}><PlusCircle className="mr-2 h-4 w-4"/> Add Week</Button>
                                    </div>
                                </section>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                        <CardDescription>This is how your syllabus will appear.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                            <SyllabusPreview syllabusData={syllabusData} ref={previewRef} />
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button className="w-full" onClick={handlePrint}><Printer className="mr-2"/> Print Syllabus</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
