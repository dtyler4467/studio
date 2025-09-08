
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';

export function TimeClock() {
    const { toast } = useToast();
    const { addTimeClockEvent, timeClockEvents, currentUser } = useSchedule();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const lastEvent = timeClockEvents
        .filter(e => e.employeeId === currentUser?.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const isClockedIn = lastEvent?.type === 'in';
    const lastClockInTime = isClockedIn ? new Date(lastEvent.timestamp) : null;

    const handleClockIn = () => {
        if (!currentUser) return;
        addTimeClockEvent({ employeeId: currentUser.id, type: 'in' });
        toast({
            title: "Clocked In",
            description: `You clocked in at ${format(new Date(), 'p')}.`,
        });
    };

    const handleClockOut = () => {
        if (!currentUser || !lastClockInTime) return;
        
        const now = new Date();
        addTimeClockEvent({ employeeId: currentUser.id, type: 'out' });

        const hours = differenceInHours(now, lastClockInTime);
        const minutes = differenceInMinutes(now, lastClockInTime) % 60;
        
        let duration = 'a few moments';
        if (hours > 0) {
             duration = `${hours} hour(s) and ${minutes} minute(s)`;
        } else if (minutes > 0) {
             duration = `${minutes} minute(s)`;
        }

        toast({
            title: "Clocked Out",
            description: `You clocked out at ${format(now, 'p')}. You were clocked in for ${duration}.`,
        });
    };

    return (
        <>
            <CardHeader className="text-center">
                <Clock className="w-12 h-12 mx-auto text-primary" />
                <CardTitle className="font-headline mt-2">Time Clock</CardTitle>
                <CardDescription>Clock in and out for your shift</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="text-4xl font-bold font-mono">
                    {format(time, 'p')}
                </div>
                <div className="text-sm text-muted-foreground">
                     {format(time, 'PPPP')}
                </div>
                <div className="flex gap-4 mt-4">
                    <Button size="lg" onClick={handleClockIn} disabled={isClockedIn}>
                        <LogIn className="mr-2" /> Clock In
                    </Button>
                     <Button size="lg" variant="outline" onClick={handleClockOut} disabled={!isClockedIn}>
                        <LogOut className="mr-2" /> Clock Out
                    </Button>
                </div>
                 {isClockedIn && lastClockInTime && (
                    <div className="mt-4 text-sm text-muted-foreground">
                        Clocked in at <span className="font-semibold text-foreground">{format(lastClockInTime, 'p')}</span>
                    </div>
                )}
            </CardContent>
        </>
    );
}
