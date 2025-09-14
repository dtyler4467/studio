
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KanbanSquare, PlusCircle } from 'lucide-react';
import { useSchedule, Task, TaskStatus, Employee } from '@/hooks/use-schedule';
import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const statusColumns: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Done'];

const TaskCard = ({ task, onDragStart }: { task: Task; onDragStart: (e: React.DragEvent, taskId: string) => void }) => {
    const { employees } = useSchedule();
    const assignee = employees.find(e => e.id === task.assigneeId);
    
    return (
        <Card 
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="cursor-grab active:cursor-grabbing"
        >
            <CardHeader className="p-4">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <CardDescription className="text-xs pt-1">{task.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {assignee && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{assignee.name}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};


const AddTaskDialog = () => {
    const { employees, addTask } = useSchedule();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');

    const handleSave = () => {
        if (!title || !assigneeId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a title and assignee.' });
            return;
        }
        addTask({
            title,
            description,
            assigneeId,
            status: 'To Do',
        });
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setAssigneeId('');
        toast({ title: 'Task Created', description: `New task "${title}" has been added.` });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Fill out the details for the new task.</DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assignee">Assign To</Label>
                        <Select value={assigneeId} onValueChange={setAssigneeId}>
                            <SelectTrigger id="assignee">
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Create Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function ProjectTasksPage() {
    const { tasks, updateTaskStatus } = useSchedule();
    const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

    const columns = useMemo(() => {
        const cols: Record<TaskStatus, Task[]> = {
            'To Do': [], 'In Progress': [], 'Review': [], 'Done': []
        };
        tasks.forEach(task => {
            if (cols[task.status]) {
                cols[task.status].push(task);
            }
        });
        return cols;
    }, [tasks]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        updateTaskStatus(taskId, newStatus);
        setDraggedOverColumn(null);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
        e.preventDefault();
        setDraggedOverColumn(status);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setDraggedOverColumn(null);
    };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Tasks" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <KanbanSquare />
                        Task Management
                    </CardTitle>
                    <CardDescription>
                        Assign tasks, track progress, and manage your team's workload using a Kanban board.
                    </CardDescription>
                </div>
                <AddTaskDialog />
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {statusColumns.map(status => (
                        <div 
                            key={status} 
                            className="w-80 flex-shrink-0"
                            onDrop={(e) => handleDrop(e, status)}
                            onDragOver={(e) => handleDragOver(e, status)}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="bg-muted p-2 rounded-t-lg sticky top-0 z-10">
                                <h3 className="font-semibold text-center">{status} ({columns[status].length})</h3>
                            </div>
                            <div className={cn(
                                "bg-muted/50 p-2 rounded-b-lg space-y-3 min-h-[60vh] transition-colors",
                                draggedOverColumn === status && "bg-primary/20"
                                )}>
                                {columns[status].map(task => (
                                    <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
