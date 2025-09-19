
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Mail, User } from 'lucide-react';
import React, { useState, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSchedule } from '@/hooks/use-schedule';

type Student = {
  id: string;
  name: string;
  grades: { [assignmentId: string]: number | null };
};

type Assignment = {
  id: string;
  title: string;
  totalPoints: number;
};

const initialAssignments: Assignment[] = [
  { id: 'hw1', title: 'Homework 1', totalPoints: 20 },
  { id: 'quiz1', title: 'Quiz 1', totalPoints: 50 },
  { id: 'midterm', title: 'Midterm Exam', totalPoints: 100 },
];

const initialStudents: Student[] = [
  { id: 'stud_1', name: 'Alice Johnson', grades: { hw1: 18, quiz1: 45, midterm: 88 } },
  { id: 'stud_2', name: 'Bob Williams', grades: { hw1: 20, quiz1: 40, midterm: 75 } },
  { id: 'stud_3', name: 'Charlie Brown', grades: { hw1: 15, quiz1: 35, midterm: 65 } },
];


const getGradeInfo = (score: number | null, totalPoints: number): { percentage: number; letter: string; gpa: number } => {
    if (score === null || totalPoints === 0) return { percentage: 0, letter: 'N/A', gpa: 0 };
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return { percentage, letter: 'A', gpa: 4.0 };
    if (percentage >= 80) return { percentage, letter: 'B', gpa: 3.0 };
    if (percentage >= 70) return { percentage, letter: 'C', gpa: 2.0 };
    if (percentage >= 60) return { percentage, letter: 'D', gpa: 1.0 };
    return { percentage, letter: 'F', gpa: 0.0 };
};


export default function ReportCardsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [teacherComments, setTeacherComments] = useState('');
  const { toast } = useToast();
  const reportCardRef = useRef<HTMLDivElement>(null);

  const selectedStudent = useMemo(() => {
    return initialStudents.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId]);

  const gradesData = useMemo(() => {
    if (!selectedStudent) return [];
    return initialAssignments.map(assignment => ({
      ...assignment,
      ...getGradeInfo(selectedStudent.grades[assignment.id], assignment.totalPoints),
      score: selectedStudent.grades[assignment.id]
    }));
  }, [selectedStudent]);

  const overallGpa = useMemo(() => {
    if (gradesData.length === 0) return 0;
    const totalGpaPoints = gradesData.reduce((acc, grade) => acc + grade.gpa, 0);
    return totalGpaPoints / gradesData.length;
  }, [gradesData]);

  const handlePrint = () => {
    if (!selectedStudent || !reportCardRef.current) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a student to generate a report card.' });
        return;
    }
    
    const printWindow = window.open('', '', 'height=1100,width=850');
    printWindow?.document.write('<html><head><title>Print Report Card</title>');
    const styles = Array.from(document.styleSheets)
        .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>${Array.from(s.cssRules).map(r => r.cssText).join('')}</style>`)
        .join('\n');
    printWindow?.document.write(`<head>${styles}</head>`);
    printWindow?.document.write('<body style="background-color: white; -webkit-print-color-adjust: exact; padding: 1rem;">');
    printWindow?.document.write(reportCardRef.current.innerHTML);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    setTimeout(() => { printWindow?.print(); }, 500);
  };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Report Cards" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <FileText />
                Report Card Generator
            </CardTitle>
            <CardDescription>
              Select a student to generate their report card.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="student-select">Select Student</Label>
                    <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId}>
                        <SelectTrigger id="student-select">
                            <SelectValue placeholder="Select a student..." />
                        </SelectTrigger>
                        <SelectContent>
                            {initialStudents.map(student => (
                                <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedStudent ? (
                <div ref={reportCardRef}>
                <Card className="border-2 border-primary/50">
                    <CardHeader className="bg-muted/50 text-center">
                        <CardTitle className="font-headline text-2xl">Official Report Card</CardTitle>
                        <CardDescription>2024-2025 School Year</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                             <div>
                                <p className="font-semibold">{selectedStudent.name}</p>
                                <p className="text-sm text-muted-foreground">Student ID: {selectedStudent.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-2xl">{overallGpa.toFixed(2)} GPA</p>
                                <p className="text-sm text-muted-foreground">Overall</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Assignment/Subject</TableHead>
                                        <TableHead className="text-center">Score</TableHead>
                                        <TableHead className="text-center">Percentage</TableHead>
                                        <TableHead className="text-right">Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gradesData.map(grade => (
                                        <TableRow key={grade.id}>
                                            <TableCell className="font-medium">{grade.title}</TableCell>
                                            <TableCell className="text-center">{grade.score}/{grade.totalPoints}</TableCell>
                                            <TableCell className="text-center">{grade.percentage.toFixed(1)}%</TableCell>
                                            <TableCell className="text-right font-semibold">{grade.letter}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="comments">Teacher Comments</Label>
                            <Textarea id="comments" placeholder="Add comments here..." value={teacherComments} onChange={e => setTeacherComments(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
                </div>
            ) : (
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Select a student to generate their report card.</p>
                </div>
            )}
          </CardContent>
           {selectedStudent && (
            <CardFooter className="gap-2">
                <Button onClick={handlePrint}><Printer className="mr-2"/> Print Report Card</Button>
                <Button variant="outline"><Mail className="mr-2"/> Email to Guardian</Button>
            </CardFooter>
           )}
        </Card>
      </main>
    </div>
  );
}
