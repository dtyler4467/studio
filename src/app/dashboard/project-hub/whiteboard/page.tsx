

"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useSchedule, Task } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import React from 'react';

const TaskNote = ({ task, position, rotation }: { task: Task; position: string; rotation: string }) => {
    const { employees } = useSchedule();
    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));

    return (
        <div className={`absolute w-64 h-auto p-4 shadow-lg rounded-md flex flex-col ${position} ${rotation}`}>
            <Card className="bg-yellow-200 text-yellow-900 border-yellow-300">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className="text-yellow-800 text-xs pt-1">{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {task.documentUri && (
                        <div className="relative aspect-video rounded-md overflow-hidden border border-yellow-300/50">
                             <Image src={task.documentUri} alt={`Document for ${task.title}`} layout="fill" objectFit="cover" />
                             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                 <FileText className="w-8 h-8 text-white/70" />
                             </div>
                        </div>
                    )}
                </CardContent>
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
        </div>
    );
};


export default function ProjectWhiteboardPage() {
  const { tasks } = useSchedule();

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
                    A visual overview of all project tasks, assignees, and attached documents.
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
      </main>
    </div>
  );
}
