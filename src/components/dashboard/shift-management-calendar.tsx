"use client";

import React, { useState, useMemo } from 'react';
import { format, formatISO, isSameDay } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleOpenDialogForNew = () => {
        if (!selectedDate) return;
        setEditingShift({ 
            date: formatISO(selectedDate, { representation: 'date' }), 
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
    }
    
    const selectedDayShifts = selectedDate ? shiftsByDate[formatISO(selectedDate, { representation: 'date' })] || [] : [];
    
    const DayCell = ({ date, ...props }: { date: Date } & any) => {
        const dateShifts = shiftsByDate[formatISO(date, { representation: 'date' })] || [];
        const isSelected = selectedDate && isSameDay(date, selectedDate);
        return (
            <div 
                {...props} 
                className={`relative h-24 w-full p-1 border-t border-r ${isSelected ? 'bg-accent/50' : ''}`}
                onClick={() => handleDateClick(date)}
            >
                <div className="text-sm font-medium">{format(date, 'd')}</div>
                <div className="mt-1 space-y-1">
                    {dateShifts.slice(0, 2).map(shift => (
                        <Badge key={shift.id} variant="secondary" className="w-full truncate text-xs p-1">
                            {employees.find(e => e.id === shift.employeeId)?.name}
                        </Badge>
                    ))}
                    {dateShifts.length > 2 && <Badge variant="outline" className="w-full text-xs p-1">+{dateShifts.length - 2} more</Badge>}
                </div>
            </div>
        )
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    components={{ Day: DayCell }}
                    className="p-0 border rounded-md"
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline">
                        Shifts for {selectedDate ? format(selectedDate, 'PPP') : '...'}
                    </CardTitle>
                    <CardDescription>
                       Manage shifts for the selected day.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                   {selectedDayShifts.length > 0 ? (
                       selectedDayShifts.map(shift => (
                           <div key={shift.id} className="flex items-center justify-between p-2 rounded-md bg-muted text-sm">
                               <div>
                                    <p className="font-semibold">{employees.find(e => e.id === shift.employeeId)?.name}</p>
                                    <p className="text-muted-foreground">{shift.startTime} - {shift.endTime}</p>
                               </div>
                               <div>
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialogForEdit(shift)}>Edit</Button>
                               </div>
                           </div>
                       ))
                   ) : (
                       <p className="text-muted-foreground text-sm">No shifts scheduled.</p>
                   )}
                   <Button onClick={handleOpenDialogForNew} className="w-full mt-4">Add Shift</Button>
                </CardContent>
            </Card>

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
                    <DialogFooter className="justify-between">
                        <div>
                            {editingShift && 'id' in editingShift && (
                                <Button variant="destructive" onClick={() => {
                                    handleDeleteShift(editingShift.id);
                                    setDialogOpen(false);
                                }}>Delete Shift</Button>
                            )}
                        </div>
                        <div>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleSaveShift}>Save Shift</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
