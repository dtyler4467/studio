
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useSchedule, Task } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Label } from '@/components/ui/label';

const NotesSection = ({ task }: { task: Task }) => {
    const { addTaskNote, currentUser } = useSchedule();
    const [newNote, setNewNote] = useState('');

    const handlePostNote = () => {
        if (newNote.trim()) {
            addTaskNote(task.id, newNote);
            setNewNote('');
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="font-semibold">Notes & Collaboration</h4>
            <div className="space-y-2">
                <Label htmlFor="new-note">Add a note</Label>
                <Textarea 
                    id="new-note"
                    placeholder="Type your comment here..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handlePostNote} size="sm" disabled={!newNote.trim()}>Post Note</Button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {task.notes && [...task.notes].reverse().map((note, index) => (
                    <div key={index} className="flex items-start gap-3">
                         <Avatar className="h-8 w-8 border">
                             <AvatarFallback className="text-xs">{note.author.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <div className="bg-muted p-3 rounded-md flex-1">
                             <div className="flex justify-between items-center">
                                <p className="font-semibold text-sm">{note.author}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(note.timestamp, { addSuffix: true })}</p>
                             </div>
                             <p className="text-sm mt-1">{note.content}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const TaskDetailDialog = ({ task, isOpen, onOpenChange }: { task: Task | null; isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const { employees } = useSchedule();
    if (!task) return null;

    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{task.title}</DialogTitle>
                    <DialogDescription>{task.description}</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Assigned To</h4>
                        <div className="flex flex-wrap gap-2">
                            {assignees.map(assignee => (
                                <div key={assignee.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{assignee.name}</span>
                                </div>
                            ))}
                        </div>
                         {task.documentUri && (
                            <div>
                                <h4 className="font-semibold mt-4">Attached Document</h4>
                                <div className="mt-2 border rounded-md p-2">
                                     <Image src={task.documentUri} alt={`Document for ${task.title}`} width={800} height={600} className="rounded-md w-full h-auto" />
                                </div>
                            </div>
                        )}
                    </div>
                    <NotesSection task={task} />
                </div>
            </DialogContent>
        </Dialog>
    );
};


const TaskNote = ({ task, position, rotation, onClick }: { task: Task; position: string; rotation: string; onClick: () => void }) => {
    const { employees } = useSchedule();
    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));

    return (
        <div className={`absolute w-64 h-auto p-4 shadow-lg rounded-md flex flex-col ${position} ${rotation}`}>
            <button onClick={onClick} className="w-full text-left">
                <Card className="bg-yellow-200 text-yellow-900 border-yellow-300 hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription className="text-yellow-800 text-xs pt-1 truncate">{task.description}</CardDescription>
                    </CardHeader>
                    {task.documentUri && (
                        <CardContent className="p-2">
                            <div className="relative aspect-video rounded-md overflow-hidden border border-yellow-300/50 bg-yellow-100">
                                <Image src={task.documentUri} alt={`Document for ${task.title}`} layout="fill" objectFit="cover" />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-white/70" />
                                </div>
                            </div>
                        </CardContent>
                    )}
                    <CardFooter>
                        <div className="flex items-center justify-end w-full">
                            <div className="flex -space-x-2">
                                {assignees.map(assignee => (
                                    <Avatar key={assignee.id} className="h-6 w-6 border-2 border-yellow-200">
                                        <AvatarFallback className="text-xs bg-yellow-300">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </button>
        </div>
    );
};


export default function ProjectWhiteboardPage() {
  const { tasks } = useSchedule();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const taskPositions = [
      { position: 'top-10 left-10', rotation: '-rotate-3' },
      { position: 'top-48 left-80', rotation: 'rotate-2' },
      { position: 'top-20 right-20', rotation: 'rotate-1' },
      { position: 'bottom-20 left-32', rotation: 'rotate-3' },
      { position: 'bottom-10 right-64', rotation: '-rotate-2' },
  ];

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Whiteboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <PenSquare />
                    Collaborative Whiteboard
                </CardTitle>
                <CardDescription>
                    A visual overview of all project tasks. Click a task to see more details and collaborate.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-[800px] rounded-lg border bg-muted/30 overflow-hidden p-4">
                    {tasks.map((task, index) => (
                        <TaskNote 
                            key={task.id} 
                            task={task} 
                            position={taskPositions[index % taskPositions.length].position}
                            rotation={taskPositions[index % taskPositions.length].rotation}
                            onClick={() => setSelectedTask(task)}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-muted-foreground">No tasks to display. Add tasks on the "Tasks" page to see them here.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <TaskDetailDialog 
            task={selectedTask}
            isOpen={!!selectedTask}
            onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      </main>
    </div>
  );
}
