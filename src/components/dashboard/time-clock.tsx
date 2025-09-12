

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut, Coffee, Fingerprint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';

const pad = (num: number) => num.toString().padStart(2, '0');

function Stopwatch({ startTime }: { startTime: Date }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(new Date().getTime() - startTime.getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);

    return (
        <div className="text-xl font-mono text-muted-foreground">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>
    );
}

export function TimeClock() {
    const { toast } = useToast();
    const { addTimeClockEvent, timeClockEvents, currentUser } = useSchedule();
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
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
                    {time ? format(time, 'p') : 'Loading...'}
                </div>
                <div className="text-sm text-muted-foreground">
                     {time ? format(time, 'PPPP') : '...'}
                </div>
                {isClockedIn && lastClockInTime && (
                    <div className="mt-2 text-center space-y-1">
                        <p className="text-sm text-muted-foreground">
                            Clocked in at <span className="font-semibold text-foreground">{format(lastClockInTime, 'p')}</span>
                        </p>
                        <Stopwatch startTime={lastClockInTime} />
                    </div>
                )}
                <div className="flex gap-4 mt-4">
                    {isClockedIn ? (
                        <>
                             <Button size="lg" variant="outline" onClick={handleClockOut}>
                                <LogOut className="mr-2" /> Clock Out
                            </Button>
                        </>
                    ) : (
                         <Button size="lg" onClick={handleClockIn}>
                            <LogIn className="mr-2" /> Clock In
                        </Button>
                    )}
                </div>
                 <div className="flex gap-4 mt-2">
                    <Button variant="secondary" disabled={!isClockedIn}><Coffee className="mr-2"/> Start Break</Button>
                    <Button variant="secondary" disabled><LogOut className="mr-2"/> End Break</Button>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-center">
                 <p className="text-xs text-muted-foreground">Biometric authentication can be used.</p>
                 <Fingerprint className="w-6 h-6 text-muted-foreground/50" />
            </CardFooter>
        </>
    );
}
