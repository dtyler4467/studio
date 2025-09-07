"use client";

import React, { useState, useMemo } from 'react';
import { format, formatISO, isSameDay } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X } from 'lucide-react';
import { DayProps, DayPicker } from 'react-day-picker';
import { ScrollArea } from '../ui/scroll-area';

type Shift = {
    id: string;
    date: string;
    employeeId: string;
    title: string;
    startTime: string;
    endTime: string;
};

export function ShiftManagementCalendar() {
    const { shifts, employees, addShift, updateShift, deleteShift } = useSchedule();
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
        deleteShift(shiftId);
        setDialogOpen(false);
        setEditingShift(null);
    }
    
    const DayCell = ({ date, displayMonth }: DayProps) => {
        const dateKey = formatISO(date, { representation: 'date' });
        const dateShifts = shiftsByDate[dateKey] || [];

        if (displayMonth.getMonth() !== date.getMonth()) {
            return <div className="h-28 w-full"></div>;
        }

        return (
            <div className="relative flex flex-col h-32 w-full p-1 border-t border-r">
                <div className="flex items-center justify-between text-sm font-medium">
                    <span>{format(date, 'd')}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleOpenDialogForNew(date)}>
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>
                <ScrollArea className="flex-1 mt-1">
                    <div className="space-y-1 pr-2">
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
        <>
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
        </>
    );
}
