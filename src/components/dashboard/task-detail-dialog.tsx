"use client";

import { useState } from 'react';
import { useSchedule, Task, TaskEvent } from '@/hooks/use-schedule';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddMilestoneDialog, NotesSection, TaskTimeline } from './task-timeline';


export const TaskDetailDialog = ({ task, isOpen, onOpenChange }: { task: Task | null; isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const { employees, addTaskEvent } = useSchedule();
    const [isAddMilestoneOpen, setAddMilestoneOpen] = useState(false);
    const [initialMilestoneDate, setInitialMilestoneDate] = useState<Date | undefined>(undefined);
    
    if (!task) return null;

    const assignees = employees.filter(e => task.assigneeIds.includes(e.id));
    
    const handleSaveMilestone = (data: Omit<TaskEvent, 'id' | 'author'>) => {
        addTaskEvent(task.id, data);
    };

    const handleOpenAddMilestone = (date?: Date) => {
        setInitialMilestoneDate(date || new Date());
        setAddMilestoneOpen(true);
    }

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
                        <TaskTimeline task={task} onAddMilestone={handleOpenAddMilestone} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
        <AddMilestoneDialog isOpen={isAddMilestoneOpen} onOpenChange={setAddMilestoneOpen} onSave={handleSaveMilestone} initialDate={initialMilestoneDate} />
        </>
    );
};
