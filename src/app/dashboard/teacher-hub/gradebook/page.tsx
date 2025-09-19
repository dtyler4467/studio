
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Download, BookCopy } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

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

function AddStudentDialog({ onAdd }: { onAdd: (name: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    const handleAdd = () => {
        if (name.trim()) {
            onAdd(name.trim());
            setIsOpen(false);
            setName('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2"/> Add Student</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd}>Add Student</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AddAssignmentDialog({ onAdd }: { onAdd: (title: string, totalPoints: number) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [totalPoints, setTotalPoints] = useState('');

    const handleAdd = () => {
        if (title.trim() && totalPoints) {
            onAdd(title.trim(), parseInt(totalPoints, 10));
            setIsOpen(false);
            setTitle('');
            setTotalPoints('');
        }
    };

     return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> Add Assignment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Assignment</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="assignment-title">Assignment Title</Label>
                        <Input id="assignment-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="total-points">Total Points</Label>
                        <Input id="total-points" type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd}>Add Assignment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function GradebookPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const { toast } = useToast();

  const handleGradeChange = (studentId: string, assignmentId: string, grade: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const newGrades = { ...student.grades, [assignmentId]: grade === '' ? null : Number(grade) };
          return { ...student, grades: newGrades };
        }
        return student;
      })
    );
  };
  
  const handleAddStudent = (name: string) => {
    const newStudent: Student = {
        id: `stud_${Date.now()}`,
        name,
        grades: assignments.reduce((acc, ass) => ({ ...acc, [ass.id]: null }), {}),
    };
    setStudents(prev => [...prev, newStudent]);
  };
  
  const handleAddAssignment = (title: string, totalPoints: number) => {
      const newAssignment: Assignment = {
          id: `asg_${Date.now()}`,
          title,
          totalPoints,
      };
      setAssignments(prev => [...prev, newAssignment]);
      setStudents(prevStudents =>
        prevStudents.map(student => ({
            ...student,
            grades: { ...student.grades, [newAssignment.id]: null }
        }))
      );
  };

  const calculateAverage = (studentGrades: { [key: string]: number | null }) => {
    let totalPointsEarned = 0;
    let totalPointsPossible = 0;

    for (const assignmentId in studentGrades) {
        const grade = studentGrades[assignmentId];
        const assignment = assignments.find(a => a.id === assignmentId);
        if (grade !== null && assignment) {
            totalPointsEarned += grade;
            totalPointsPossible += assignment.totalPoints;
        }
    }
    
    return totalPointsPossible > 0 ? (totalPointsEarned / totalPointsPossible) * 100 : 0;
  };
  
  const handleExport = () => {
    const dataToExport = students.map(student => {
        const studentRow: any = { 'Student Name': student.name };
        assignments.forEach(assignment => {
            studentRow[assignment.title] = student.grades[assignment.id] ?? '';
        });
        studentRow['Average'] = `${calculateAverage(student.grades).toFixed(2)}%`;
        return studentRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gradebook");
    XLSX.writeFile(workbook, `Gradebook_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast({ title: "Export Successful", description: "The gradebook has been exported to an Excel file." });
  };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Gradebook" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BookCopy />
                    Gradebook
                </CardTitle>
                <CardDescription>
                Manage student grades and track performance.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <AddStudentDialog onAdd={handleAddStudent} />
                <AddAssignmentDialog onAdd={handleAddAssignment} />
                <Button variant="secondary" onClick={handleExport}><Download className="mr-2"/> Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-background">Student Name</TableHead>
                            {assignments.map(assignment => (
                                <TableHead key={assignment.id} className="text-center">
                                    {assignment.title}
                                    <span className="font-normal text-muted-foreground"> ({assignment.totalPoints} pts)</span>
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Average</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium sticky left-0 bg-background">{student.name}</TableCell>
                                {assignments.map(assignment => {
                                    const grade = student.grades[assignment.id];
                                    return (
                                        <TableCell key={assignment.id}>
                                            <Input
                                                type="number"
                                                value={grade === null ? '' : grade}
                                                onChange={e => handleGradeChange(student.id, assignment.id, e.target.value)}
                                                className="w-24 text-center mx-auto"
                                                max={assignment.totalPoints}
                                            />
                                        </TableCell>
                                    )
                                })}
                                <TableCell className="text-right font-semibold">
                                    {calculateAverage(student.grades).toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

