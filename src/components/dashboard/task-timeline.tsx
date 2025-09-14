
"use client";

import React, { useState, useEffect } from 'react';
import { useSchedule, Task, TaskEvent } from '@/hooks/use-schedule';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DocumentUpload } from './document-upload';
import { Calendar } from '../ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Milestone, GitCommit, PlusCircle, ExternalLink, CalendarIcon } from 'lucide-react';


export const NotesSection = ({ task }: { task: Task }) => {
    const { addTaskEvent, currentUser } = useSchedule();
    const [newNote, setNewNote] = useState('');

    const handlePostNote = () => {
        if (newNote.trim()) {
            addTaskEvent(task.id, {
                type: 'note',
                content: newNote.trim(),
                timestamp: new Date(),
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

export const AddMilestoneDialog = ({ isOpen, onOpenChange, onSave, initialDate }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSave: (data: Omit<TaskEvent, 'id' | 'author'>) => void; initialDate?: Date }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const [eventDate, setEventDate] = useState<Date>(initialDate || new Date());
    const { toast } = useToast();
    
    useEffect(() => {
        if(isOpen) {
            setEventDate(initialDate || new Date());
        }
    }, [isOpen, initialDate]);

    const handleSave = () => {
        if (!name.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a name for the milestone.' });
            return;
        }
        onSave({ type: 'milestone', name, content, documentUri, timestamp: eventDate });
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
                        <Label htmlFor="event-date">Event Date & Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(eventDate, "PPP p")}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={eventDate}
                                    onSelect={(d) => d && setEventDate(d)}
                                    initialFocus
                                />
                                <div className="p-2 border-t">
                                     <Input type="time" value={format(eventDate, 'HH:mm')} onChange={(e) => {
                                         const [hours, minutes] = e.target.value.split(':');
                                         const newDate = new Date(eventDate);
                                         newDate.setHours(parseInt(hours));
                                         newDate.setMinutes(parseInt(minutes));
                                         setEventDate(newDate);
                                     }} />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
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


export const TaskTimeline = ({ task, onAddMilestone }: { task: Task, onAddMilestone: (date: Date) => void }) => {
    const [intermediatePoints, setIntermediatePoints] = useState(3);
    const sortedEvents = [...(task.events || [])].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const timelineStart = task.events.length > 0 ? new Date(Math.min(...task.events.map(e => new Date(e.timestamp).getTime()))) : new Date();
    const timelineEnd = task.dueDate || new Date(new Date().setDate(new Date().getDate() + 7));
    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();

    const getPosition = (date: Date) => {
        const eventTime = date.getTime();
        if (totalDuration <= 0) return 0;
        const position = ((eventTime - timelineStart.getTime()) / totalDuration) * 100;
        return Math.max(0, Math.min(100, position));
    }
    
    const getDateFromPosition = (percentage: number) => {
        const timeOffset = totalDuration * (percentage / 100);
        return new Date(timelineStart.getTime() + timeOffset);
    }

    return (
        <div className="pt-8 pb-4">
            <div className="flex justify-end mb-2">
                 <Button variant="outline" size="sm" onClick={() => setIntermediatePoints(p => p + 1)}>
                    Add Section
                </Button>
            </div>
            <div className="flex items-center w-full">
                <div className="flex flex-col items-center">
                    <Milestone className="w-8 h-8 p-1.5 bg-green-500 text-white rounded-full" />
                    <span className="text-xs font-semibold mt-1">Start</span>
                </div>
                <div className="flex-1 h-2 bg-border relative -mx-1">
                    {/* Existing event nodes */}
                    {sortedEvents.map((event) => (
                        <Popover key={event.id}>
                            <PopoverTrigger asChild>
                                <button 
                                    className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    style={{ left: `${getPosition(event.timestamp)}%` }}
                                ></button>
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

                    {/* Plus icons for adding new events */}
                    {Array.from({ length: intermediatePoints }).map((_, i) => {
                        const percentage = (100 / (intermediatePoints + 1)) * (i + 1);
                        const date = getDateFromPosition(percentage);
                        return (
                             <button
                                key={`add-${i}`}
                                className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-muted rounded-full hover:scale-125 hover:bg-primary/20 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center"
                                style={{ left: `${percentage}%` }}
                                onClick={() => onAddMilestone(date)}
                            >
                                <PlusCircle className="h-3 w-3 text-muted-foreground" />
                            </button>
                        )
                    })}

                </div>
                 <div className="flex flex-col items-center">
                    <Milestone className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full" />
                    <span className="text-xs font-semibold mt-1">Finish</span>
                </div>
            </div>
        </div>
    )
}

    