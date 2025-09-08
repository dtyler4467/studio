
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function TimeClock() {
    const { toast } = useToast();
    const [time, setTime] = useState(new Date());
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [lastClockIn, setLastClockIn] = useState<Date | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClockIn = () => {
        setIsClockedIn(true);
        const now = new Date();
        setLastClockIn(now);
        toast({
            title: "Clocked In",
            description: `You clocked in at ${format(now, 'p')}.`,
        });
    };

    const handleClockOut = () => {
        setIsClockedIn(false);
        const now = new Date();
        let duration = 'a few moments';
        if (lastClockIn) {
            const diff = now.getTime() - lastClockIn.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 0) {
                 duration = `${hours} hour(s) and ${minutes} minute(s)`;
            } else if (minutes > 0) {
                 duration = `${minutes} minute(s)`;
            }
        }
        toast({
            title: "Clocked Out",
            description: `You clocked out at ${format(now, 'p')}. You were clocked in for ${duration}.`,
        });
        setLastClockIn(null);
    };

    return (
        <Card>
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
                 {isClockedIn && lastClockIn && (
                    <div className="mt-4 text-sm text-muted-foreground">
                        Clocked in at <span className="font-semibold text-foreground">{format(lastClockIn, 'p')}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
