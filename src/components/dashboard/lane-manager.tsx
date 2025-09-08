
"use client";

import { useMemo } from 'react';
import { useSchedule, YardEvent } from '@/hooks/use-schedule';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Truck, ArrowLeftRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '../ui/separator';

const WAREHOUSE_DOORS = Array.from({ length: 10 }, (_, i) => `D${i + 1}`);
const PARKING_LANES = Array.from({ length: 20 }, (_, i) => `L${i + 1}`);

export function LaneManager() {
    const { yardEvents } = useSchedule();

    const currentAssignments = useMemo(() => {
        const assignments: Record<string, YardEvent> = {};
        const seenTrailers: Record<string, YardEvent> = {};

        // Sort events by timestamp descending to process the most recent first
        const sortedEvents = [...yardEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        for (const event of sortedEvents) {
            // If we've already processed a newer event for this trailer, skip
            if (seenTrailers[event.trailerId]) continue;
            
            seenTrailers[event.trailerId] = event;

            if (event.transactionType === 'inbound' && (event.assignmentType === 'door_assignment' || event.assignmentType === 'lane_assignment') && event.assignmentValue) {
                // If an inbound event has a location assignment, mark that location as occupied
                 if (!assignments[event.assignmentValue]) { // Don't overwrite if a newer trailer is there
                    assignments[event.assignmentValue] = event;
                }
            }
        }
        
        return assignments;
    }, [yardEvents]);

    const renderLocation = (locationId: string) => {
        const event = currentAssignments[locationId];

        return (
            <TooltipProvider key={locationId}>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "rounded-md border p-2 h-24 flex flex-col justify-between transition-colors",
                            event ? 'bg-primary/10 border-primary shadow' : 'bg-muted/50'
                        )}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">{locationId}</span>
                                {event && <Truck className="w-5 h-5 text-primary" />}
                            </div>
                            {event ? (
                                <div className="text-xs">
                                    <p className="font-semibold truncate">{event.trailerId}</p>
                                    <p className="text-muted-foreground truncate">{event.carrier}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-xs text-muted-foreground">Empty</span>
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    {event && (
                        <TooltipContent>
                            <div className="space-y-1 text-sm">
                                <p><strong>Trailer:</strong> {event.trailerId}</p>
                                <p><strong>Carrier:</strong> {event.carrier}</p>
                                <p><strong>Load/BOL:</strong> {event.loadNumber}</p>
                                <p><strong>Arrived:</strong> {formatDistanceToNow(event.timestamp, { addSuffix: true })}</p>
                            </div>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2 font-headline">Warehouse Dock Doors</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {WAREHOUSE_DOORS.map(renderLocation)}
                </div>
            </div>
            <Separator />
            <div>
                 <h3 className="text-lg font-semibold mb-2 font-headline">Yard Parking Lanes</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {PARKING_LANES.map(renderLocation)}
                </div>
            </div>
        </div>
    );
}

