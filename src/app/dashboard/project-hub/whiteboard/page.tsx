

"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PenSquare, PlusCircle } from 'lucide-react';
import { useSchedule, Task, TaskEvent } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, GitCommit, Milestone, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const NotesSection = ({ task }: { task: Task }) => {
    const { addTaskEvent, currentUser } = useSchedule();
    const [newNote, setNewNote] = useState('');

    const handlePostNote = () => {
        if (newNote.trim()) {
            addTaskEvent(task.id, {
                type: 'note',
                content: newNote.trim(),
            });
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
                {task.events && [...task.events].filter(e => e.type === 'note').reverse().map((note) => (
                    <div key={note.id} className="flex items-start gap-3">
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

const AddMilestoneDialog = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSave: (data: Omit<TaskEvent, 'id' | 'author' | 'timestamp'>) => void }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a name for the milestone.' });
            return;
        }
        onSave({ type: 'milestone', name, content, documentUri });
        onOpenChange(false);
        setName('');
        setContent('');
        setDocumentUri(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add New Timeline Event</DialogTitle>
                    <DialogDescription>
                        Create a new milestone or event on the task timeline.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="milestone-name">Event Name</Label>
                        <Input id="milestone-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Client Approval" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="milestone-content">Description/Notes</Label>
                        <Textarea id="milestone-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add any relevant details..." />
                    </div>
                     <div className="space-y-2">
                        <Label>Attach Document (Optional)</Label>
                        <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Event</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const TaskTimeline = ({ task, onAddMilestone }: { task: Task, onAddMilestone: () => void }) => {
    const sortedEvents = [...(task.events || [])].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());

    return (
        <div className="pt-8 pb-4">
            <div className="flex items-center w-full">
                <div className="flex flex-col items-center">
                    <Milestone className="w-8 h-8 p-1.5 bg-green-500 text-white rounded-full" />
                    <span className="text-xs font-semibold mt-1">Start</span>
                </div>
                <div className="flex-1 h-1 bg-border relative -mx-1 flex items-center">
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-full absolute left-1/2 -translate-x-1/2 z-10" onClick={onAddMilestone}>
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                    <div className="absolute inset-0 flex items-center justify-around px-10">
                        {sortedEvents.map((event) => (
                             <Popover key={event.id}>
                                <PopoverTrigger asChild>
                                    <button className="h-4 w-4 bg-primary rounded-full hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"></button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs">{event.author.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-sm">{event.name || event.author}</span>
                                            <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{format(event.timestamp, 'PPP p')}</p>
                                        <Separator />
                                        <p className="text-sm">{event.content}</p>
                                        {event.documentUri && (
                                            <Button variant="link" asChild className="p-0 h-auto">
                                                <a href={event.documentUri} target="_blank" rel="noopener noreferrer">
                                                    View Document <ExternalLink className="ml-2 h-3 w-3" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>
                </div>
                 <div className="flex flex-col items-center">
                    <Milestone className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full" />
                    <span className="text-xs font-semibold mt-1">Finish</span>
                </div>
            </div>
        </div>
    )
}

const TaskDetailDialog = ({ task, isOpen, onOpenChange }: { task: Task | null; isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const { employees, addTaskEvent } = useSchedule();
    const [isAddMilestoneOpen, setAddMilestoneOpen] = useState(false);
    
    if (!task) return null;

    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));
    
    const handleSaveMilestone = (data: Omit<TaskEvent, 'id' | 'author' | 'timestamp'>) => {
        addTaskEvent(task.id, data);
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{task.title}</DialogTitle>
                    <DialogDescription>{task.description}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="details">
                    <TabsList>
                        <TabsTrigger value="details">Details & Notes</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="max-h-[70vh] overflow-y-auto pr-4">
                        <div className="grid md:grid-cols-2 gap-6 py-4">
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
                    </TabsContent>
                    <TabsContent value="timeline">
                        <TaskTimeline task={task} onAddMilestone={() => setAddMilestoneOpen(true)} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
        <AddMilestoneDialog isOpen={isAddMilestoneOpen} onOpenChange={setAddMilestoneOpen} onSave={handleSaveMilestone} />
        </>
    );
};


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
                y: Math.floor(index / 4) * 220 + 40,
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
                    A visual overview of all project tasks. Click a task to see more details and collaborate. Drag to rearrange.
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

