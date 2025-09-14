
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useSchedule, Task, OfficeAppointment } from '@/hooks/use-schedule';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';

type Milestone = {
    id: string;
    title: string;
    date: Date;
    description: string;
}

const initialMilestones: Milestone[] = [
    { id: 'M01', title: 'Project Kick-off', date: new Date(new Date().setDate(new Date().getDate() - 5)), description: 'Initial meeting for the Q3 campaign.'},
    { id: 'M02', title: 'Design Phase Complete', date: new Date(new Date().setDate(new Date().getDate() + 10)), description: 'All mockups and wireframes to be finalized.'},
];

const AddEventDialog = ({ onSave, isOpen, onOpenChange }: { onSave: (event: Omit<OfficeAppointment, 'id' | 'status'>) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { employees } = useSchedule();
    const employeeOptions: MultiSelectOption[] = useMemo(() => employees.map(e => ({ value: e.name, label: e.name })), [employees]);
    const [formData, setFormData] = useState<Omit<OfficeAppointment, 'id' | 'status' | 'type'>>({
        title: '',
        attendees: [],
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        notes: '',
    });

    const handleSave = () => {
        onSave({ ...formData, type: 'Meeting' });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm"><PlusCircle className="mr-2" /> New Event</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Calendar Event</DialogTitle>
                    <DialogDescription>Schedule a new meeting or project milestone.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="attendees">Attendees</Label>
                        <MultiSelect 
                            options={employeeOptions}
                            selected={formData.attendees}
                            onChange={selected => setFormData({...formData, attendees: selected})}
                            placeholder="Select attendees..."
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Event</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ProjectCalendarPage() {
    const { tasks, officeAppointments, addOfficeAppointment } = useSchedule();
    const [milestones, setMilestones] = useState(initialMilestones);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isAddEventOpen, setAddEventOpen] = useState(false);

    const eventsByDate = useMemo(() => {
        const events: Record<string, { tasks: Task[], meetings: OfficeAppointment[], milestones: Milestone[] }> = {};
        tasks.forEach(task => {
            const dateKey = format(task.dueDate || new Date(), 'yyyy-MM-dd');
            if (!events[dateKey]) events[dateKey] = { tasks: [], meetings: [], milestones: [] };
            events[dateKey].tasks.push(task);
        });
        officeAppointments.forEach(meeting => {
            const dateKey = format(meeting.startTime, 'yyyy-MM-dd');
            if (!events[dateKey]) events[dateKey] = { tasks: [], meetings: [], milestones: [] };
            events[dateKey].meetings.push(meeting);
        });
        milestones.forEach(milestone => {
             const dateKey = format(milestone.date, 'yyyy-MM-dd');
            if (!events[dateKey]) events[dateKey] = { tasks: [], meetings: [], milestones: [] };
            events[dateKey].milestones.push(milestone);
        });
        return events;
    }, [tasks, officeAppointments, milestones]);

    const selectedDayEvents = eventsByDate[format(selectedDate, 'yyyy-MM-dd')] || { tasks: [], meetings: [], milestones: [] };

    const handleSaveEvent = (event: Omit<OfficeAppointment, 'id' | 'status'>) => {
        addOfficeAppointment(event);
        toast({ title: 'Event Created', description: `Meeting "${event.title}" has been scheduled.` });
    };
    
    const DayCell = ({ date, ...props }: any) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayEvents = eventsByDate[dateKey];
        const hasEvents = dayEvents && (dayEvents.tasks.length > 0 || dayEvents.meetings.length > 0 || dayEvents.milestones.length > 0);

        const content = (
            <div className={cn("relative h-9 w-9 p-0 flex items-center justify-center", props.modifiers.today && "bg-accent text-accent-foreground rounded")}>
                {format(date, 'd')}
                {hasEvents && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
            </div>
        );
        
        if (hasEvents) {
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        {content}
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2 space-y-1 text-sm">
                        {dayEvents.tasks.map(t => <div key={t.id}>- Task: {t.title}</div>)}
                        {dayEvents.meetings.map(m => <div key={m.id}>- Meeting: {m.title}</div>)}
                        {dayEvents.milestones.map(m => <div key={m.id}>- Milestone: {m.title}</div>)}
                    </PopoverContent>
                </Popover>
            )
        }

        return content;
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Calendar" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CalendarIcon />
                        Project Calendar
                    </CardTitle>
                    <CardDescription>
                        View project deadlines, meetings, and key milestones in a shared calendar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border p-0"
                        classNames={{
                            month: "p-4 space-y-4",
                            caption_label: "text-lg font-medium",
                            head_row: "flex justify-around",
                            row: "flex w-full mt-2 justify-around",
                        }}
                        components={{ Day: DayCell }}
                    />
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex-row justify-between items-start">
                     <div>
                        <CardTitle className="font-headline">Events for {format(selectedDate, 'MMM d')}</CardTitle>
                        <CardDescription>A summary of today's events.</CardDescription>
                    </div>
                    <AddEventDialog isOpen={isAddEventOpen} onOpenChange={setAddEventOpen} onSave={handleSaveEvent} />
                </CardHeader>
                 <CardContent>
                    <div className="space-y-4 h-[60vh] overflow-y-auto pr-2">
                        {selectedDayEvents.tasks.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Tasks Due</h4>
                                {selectedDayEvents.tasks.map(task => (
                                    <div key={task.id} className="p-2 border rounded-md text-sm flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>{task.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedDayEvents.meetings.length > 0 && (
                             <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Meetings</h4>
                                {selectedDayEvents.meetings.map(meeting => (
                                    <div key={meeting.id} className="p-2 border rounded-md text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{meeting.title} at {format(meeting.startTime, 'p')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedDayEvents.milestones.length > 0 && (
                             <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Milestones</h4>
                                {selectedDayEvents.milestones.map(milestone => (
                                    <div key={milestone.id} className="p-2 border rounded-md text-sm bg-blue-50 border-blue-200">
                                        <p className="font-semibold">{milestone.title}</p>
                                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedDayEvents.tasks.length === 0 && selectedDayEvents.meetings.length === 0 && selectedDayEvents.milestones.length === 0 && (
                            <p className="text-muted-foreground text-center pt-10">No events scheduled for this day.</p>
                        )}
                    </div>
                 </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

