

"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useSchedule, Task } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TaskDetailDialog } from '@/components/dashboard/task-detail-dialog';

const TaskNote = ({ task, position, onClick, onDragStart }: { task: Task; position: { x: number, y: number }; onClick: () => void, onDragStart: (e: React.DragEvent) => void }) => {
    const { employees } = useSchedule();
    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));

    return (
        <div 
            className="absolute w-64 h-auto p-4 shadow-lg rounded-md flex flex-col cursor-grab active:cursor-grabbing"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            draggable
            onDragStart={onDragStart}
            >
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
  const [taskPositions, setTaskPositions] = useState<Record<string, {x: number, y: number}>>({});

  useEffect(() => {
    // Initialize positions on first render
    const initialPositions: Record<string, {x: number, y: number}> = {};
    tasks.forEach((task, index) => {
        if (!taskPositions[task.id]) {
            initialPositions[task.id] = {
                x: (index % 4) * 280 + 40,
                y: Math.floor(index / 4) * 300 + 40,
            };
        }
    });
    if (Object.keys(initialPositions).length > 0) {
        setTaskPositions(prev => ({ ...prev, ...initialPositions }));
    }
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData("offsetX", offsetX.toString());
    e.dataTransfer.setData("offsetY", offsetY.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const offsetX = parseInt(e.dataTransfer.getData("offsetX"), 10);
    const offsetY = parseInt(e.dataTransfer.getData("offsetY"), 10);
    const containerRect = e.currentTarget.getBoundingClientRect();
    
    setTaskPositions(prev => ({
        ...prev,
        [taskId]: {
            x: e.clientX - containerRect.left - offsetX,
            y: e.clientY - containerRect.top - offsetY
        }
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

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
                    A visual overview of all project tasks. This space will transform into a fully interactive whiteboard for your team to brainstorm, plan, and create together. Click a task to see details and collaborate. Drag to rearrange.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div 
                    className="relative w-full h-[800px] rounded-lg border bg-muted/30 overflow-hidden p-4"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {tasks.map((task) => (
                        taskPositions[task.id] && (
                            <TaskNote 
                                key={task.id} 
                                task={task} 
                                position={taskPositions[task.id]}
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                onClick={() => setSelectedTask(task)}
                            />
                        )
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
