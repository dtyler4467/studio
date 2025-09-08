
"use client";

import React, { useState, useMemo } from 'react';
import { format, formatISO, isSameDay, isWithinInterval } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, PartyPopper, Plane } from 'lucide-react';
import { DayProps, DayPicker } from 'react-day-picker';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

type Shift = {
    id: string;
    date: string;
    employeeId: string;
    title: string;
    startTime: string;
    endTime: string;
};

export function ShiftManagementCalendar() {
    const { shifts, employees, holidays, addShift, updateShift, deleteShift, timeOffRequests, currentUser } = useSchedule();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | Omit<Shift, 'id'> | null>(null);

    const shiftsByDate = useMemo(() => {
        return shifts.reduce((acc, shift) => {
            const date = shift.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(shift);
            return acc;
        }, {} as Record<string, Shift[]>);
    }, [shifts]);

    const approvedTimeOffByDate = useMemo(() => {
        return timeOffRequests
            .filter(req => req.status === 'Approved')
            .reduce((acc, req) => {
                let currentDate = new Date(req.startDate);
                const endDate = new Date(req.endDate);
                while(currentDate <= endDate) {
                    const dateKey = formatISO(currentDate, { representation: 'date' });
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(req);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return acc;
        }, {} as Record<string, any[]>);
    }, [timeOffRequests]);

    const handleOpenDialogForNew = (date: Date) => {
        setEditingShift({ 
            date: formatISO(date, { representation: 'date' }), 
            employeeId: '', 
            title: 'New Shift', 
            startTime: '09:00', 
            endTime: '17:00' 
        });
        setDialogOpen(true);
    };

    const handleOpenDialogForEdit = (shift: Shift) => {
        setEditingShift(shift);
        setDialogOpen(true);
    }

    const handleSaveShift = () => {
        if (!editingShift) return;

        if ('id' in editingShift) {
             updateShift(editingShift);
        } else {
            addShift(editingShift);
        }
        setDialogOpen(false);
        setEditingShift(null);
    };

    const handleDeleteShift = (shiftId: string) => {
        deleteShift(shiftId, currentUser?.id || 'system');
        setDialogOpen(false);
        setEditingShift(null);
    }
    
    const DayCell = ({ date, displayMonth }: DayProps) => {
        const dateKey = formatISO(date, { representation: 'date' });
        const dateShifts = shiftsByDate[dateKey] || [];
        const holiday = holidays.find(h => isSameDay(h.date, date));
        const dateApprovedTimeOff = approvedTimeOffByDate[dateKey] || [];

        if (displayMonth.getMonth() !== date.getMonth()) {
            return <div className="h-32 w-full"></div>;
        }

        return (
            <div className={cn("relative flex flex-col h-32 w-full p-1 border-t border-r", holiday && "bg-accent/10", dateApprovedTimeOff.length > 0 && "bg-destructive/5")}>
                <div className="flex items-center justify-between text-sm font-medium">
                    <span className={cn(holiday && "text-accent-foreground font-bold")}>{format(date, 'd')}</span>
                     {holiday ? (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <PartyPopper className="h-5 w-5 text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{holiday.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleOpenDialogForNew(date)}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <ScrollArea className="flex-1 mt-1">
                    <div className="space-y-1 pr-2">
                         {dateApprovedTimeOff.map(req => (
                            <Tooltip key={req.id} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="w-full text-left p-1.5 rounded-md bg-destructive/10 text-xs">
                                        <p className="font-semibold text-destructive truncate flex items-center gap-1.5"><Plane className="w-3 h-3" /> {employees.find(e => e.id === req.employeeId)?.name}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Approved Time Off</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {dateShifts.map(shift => (
                            <button 
                                key={shift.id} 
                                onClick={() => handleOpenDialogForEdit(shift)}
                                className="w-full text-left p-1.5 rounded-md bg-muted text-xs transition-colors hover:bg-primary/10"
                            >
                                <p className="font-semibold truncate">{employees.find(e => e.id === shift.employeeId)?.name}</p>
                                <p className="text-muted-foreground">{shift.startTime} - {shift.endTime}</p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        )
    };

    return (
        <TooltipProvider>
            <div id="shift-calendar-printable">
                <DayPicker
                    showOutsideDays
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    components={{ Day: DayCell }}
                    className="p-0 border rounded-md w-full"
                    classNames={{
                        table: 'w-full border-collapse',
                        head_row: 'flex w-full',
                        head_cell: 'w-full text-muted-foreground text-sm font-normal',
                        row: 'flex w-full',
                        cell: 'w-full',
                        day: 'w-full h-auto',
                    }}
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingShift && 'id' in editingShift ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
                    </DialogHeader>
                    {editingShift && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="employee" className="text-right">Employee</Label>
                                <Select
                                    value={editingShift.employeeId}
                                    onValueChange={(value) => setEditingShift({...editingShift, employeeId: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select an employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input 
                                    id="title" 
                                    value={editingShift.title}
                                    onChange={(e) => setEditingShift({...editingShift, title: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="startTime" className="text-right">Start Time</Label>
                                <Input 
                                    id="startTime" 
                                    type="time"
                                    value={editingShift.startTime}
                                    onChange={(e) => setEditingShift({...editingShift, startTime: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="endTime" className="text-right">End Time</Label>
                                <Input 
                                    id="endTime" 
                                    type="time"
                                    value={editingShift.endTime}
                                    onChange={(e) => setEditingShift({...editingShift, endTime: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="justify-between sm:justify-between">
                        <div>
                            {editingShift && 'id' in editingShift && (
                                <Button variant="destructive" onClick={() => handleDeleteShift(editingShift.id)}>
                                    Delete Shift
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleSaveShift}>Save Shift</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
