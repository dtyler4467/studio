
"use client";

import { useMemo, useState } from 'react';
import { useSchedule, YardEvent } from '@/hooks/use-schedule';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Truck, PlusCircle, ParkingCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';


const AddLocationDialog = ({ onAdd }: { onAdd: (id: string) => void }) => {
    const [id, setId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onAdd(id);
            setIsOpen(false);
            setId('');
        } catch (error: any) {
             alert(error.message); // Simple alert for now
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2" />
                    Add Lane
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Parking Lane</DialogTitle>
                        <DialogDescription>
                            Enter a unique ID for the new lane.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Lane ID
                        </Label>
                        <Input
                            id="name"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="col-span-3"
                            placeholder={'e.g., L21'}
                        />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Lane</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function ParkingLaneManager() {
    const { yardEvents, parkingLanes, addParkingLane } = useSchedule();
    const { toast } = useToast();

    const currentAssignments = useMemo(() => {
        const assignments: Record<string, YardEvent> = {};
        const seenTrailers: Record<string, YardEvent> = {};

        const sortedEvents = [...yardEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        for (const event of sortedEvents) {
            if (seenTrailers[event.trailerId]) continue;
            
            seenTrailers[event.trailerId] = event;

            if (event.transactionType === 'inbound' && event.assignmentType === 'lane_assignment' && event.assignmentValue) {
                 if (!assignments[event.assignmentValue]) {
                    assignments[event.assignmentValue] = event;
                }
            }
        }
        
        return assignments;
    }, [yardEvents]);

    const handleAddLane = (id: string) => {
        try {
            addParkingLane(id);
            toast({ title: "Lane Added", description: `Parking lane ${id} has been added.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        }
    };

    const renderLocation = (locationId: string) => {
        const event = currentAssignments[locationId];

        return (
            <TooltipProvider key={locationId}>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                         <div className={cn(
                            "rounded-md border p-4 h-32 flex flex-col justify-between transition-colors shadow-sm",
                            event ? 'bg-amber-400/20 border-amber-500 shadow-lg' : 'bg-muted/50'
                        )}>
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-lg">{locationId}</span>
                                {event ? <Truck className="w-6 h-6 text-amber-600" /> : <ParkingCircle className="w-6 h-6 text-muted-foreground" />}
                            </div>
                            {event ? (
                                <div className="text-sm">
                                    <p className="font-semibold truncate">{event.trailerId}</p>
                                    <p className="text-muted-foreground truncate">{event.carrier}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-muted-foreground">Empty</span>
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
            <div className="flex justify-end">
                <AddLocationDialog onAdd={handleAddLane} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                {parkingLanes.map(renderLocation)}
            </div>
        </div>
    );
}
