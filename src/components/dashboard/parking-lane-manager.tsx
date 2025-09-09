
"use client";

import { useMemo, useState, useEffect } from 'react';
import { useSchedule, YardEvent } from '@/hooks/use-schedule';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Truck, PlusCircle, ParkingCircle, Search, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        setFormattedDate(format(date, 'P p'));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[120px]" />;
    }

    return <>{formattedDate}</>;
}


const AddLocationDialog = ({ onAdd }: { onAdd: (id: string) => void }) => {
    const [id, setId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onAdd(id);
            setIsOpen(false);
            setId('');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
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

const MoveTrailerDialog = ({ event, isOpen, onOpenChange }: { event: YardEvent | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { parkingLanes, yardEvents, moveTrailer } = useSchedule();
    const { toast } = useToast();
    const [moveToLane, setMoveToLane] = useState("");

    const handleMove = () => {
        if (event && moveToLane) {
            try {
                moveTrailer(event.id, moveToLane);
                toast({ title: "Move Initiated", description: `Trailer ${event.trailerId} is being moved.` });
                onOpenChange(false);
            } catch (error: any) {
                toast({ variant: 'destructive', title: "Move Failed", description: error.message });
            }
        }
    };
    
    const availableLanes = useMemo(() => {
        const occupiedLanes = new Set(yardEvents.filter(e => e.assignmentType === 'lane_assignment').map(e => e.assignmentValue));
        return parkingLanes.filter(lane => !occupiedLanes.has(lane));
    }, [parkingLanes, yardEvents]);

    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move Trailer {event.trailerId}</DialogTitle>
                    <DialogDescription>
                        Select a new parking lane for this trailer. If the destination is occupied, the trailer will be moved to Lost & Found.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lane" className="text-right">
                            Destination Lane
                        </Label>
                         <Select value={moveToLane} onValueChange={setMoveToLane}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a lane" />
                            </SelectTrigger>
                            <SelectContent>
                                {parkingLanes.map(lane => (
                                    <SelectItem key={lane} value={lane}>{lane}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleMove} disabled={!moveToLane}>Confirm Move</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function ParkingLaneManager() {
    const { yardEvents, parkingLanes, addParkingLane } = useSchedule();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<YardEvent | null>(null);

    const currentAssignments = useMemo(() => {
        const assignments: Record<string, YardEvent> = {};
        const seenTrailers: Record<string, YardEvent> = {};

        const sortedEvents = [...yardEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        for (const event of sortedEvents) {
            if (event.assignmentType !== 'lane_assignment' || !event.assignmentValue) continue;
            
            if (seenTrailers[event.trailerId]) {
                 if (seenTrailers[event.trailerId].timestamp > event.timestamp) {
                    continue;
                 }
            }
            seenTrailers[event.trailerId] = event;

            if (event.transactionType === 'inbound') {
                 assignments[event.assignmentValue] = event;
            }
        }
        
        return assignments;
    }, [yardEvents]);

    const filteredLanes = useMemo(() => {
        if (!searchTerm.trim()) {
            return parkingLanes;
        }

        const lowercasedSearch = searchTerm.toLowerCase();

        return parkingLanes.filter(laneId => {
            const event = currentAssignments[laneId];
            if (!event) return false; // Only show occupied lanes when searching

            return (
                event.trailerId.toLowerCase().includes(lowercasedSearch) ||
                event.carrier.toLowerCase().includes(lowercasedSearch) ||
                event.loadNumber.toLowerCase().includes(lowercasedSearch)
            );
        });
    }, [parkingLanes, currentAssignments, searchTerm]);

    const handleAddLane = (id: string) => {
        try {
            addParkingLane(id);
            toast({ title: "Lane Added", description: `Parking lane ${id} has been added.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        }
    };
    
    const openMoveDialog = (event: YardEvent) => {
        setSelectedEvent(event);
        setIsMoveDialogOpen(true);
    };

    const renderLocation = (locationId: string) => {
        const event = currentAssignments[locationId];

        return (
            <TooltipProvider key={locationId}>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                         <div className={cn(
                            "rounded-md border p-2 flex flex-col justify-between transition-colors shadow-sm h-40",
                            event ? 'bg-amber-400/20 border-amber-500 shadow-lg' : 'bg-muted/50'
                        )}>
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-lg">{locationId}</span>
                                {event ? <Truck className="w-6 h-6 text-amber-600" /> : <ParkingCircle className="w-6 h-6 text-muted-foreground" />}
                            </div>
                            {event ? (
                                <div className="text-xs space-y-1">
                                    <p className="font-semibold truncate">{event.carrier} ({event.scac})</p>
                                    <p className="text-muted-foreground truncate">Trailer: {event.trailerId}</p>
                                    <div className="text-muted-foreground truncate">
                                        <ClientFormattedDate date={event.timestamp} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-muted-foreground">Empty</span>
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    {event && (
                        <TooltipContent className="space-y-2">
                            <div className="space-y-1 text-sm">
                                <p><strong>Trailer:</strong> {event.trailerId}</p>
                                <p><strong>Carrier:</strong> {event.carrier}</p>
                                <p><strong>Load/BOL:</strong> {event.loadNumber}</p>
                                <p><strong>Arrived:</strong> {formatDistanceToNow(event.timestamp, { addSuffix: true })}</p>
                            </div>
                            <Button size="sm" className="w-full" onClick={() => openMoveDialog(event)}>
                                <Move className="mr-2" />
                                Move Trailer
                            </Button>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search lanes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <AddLocationDialog onAdd={handleAddLane} />
            </div>
            {filteredLanes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                    {filteredLanes.map(renderLocation)}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed h-64 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No matching lanes found.</p>
                    <p className="text-sm text-muted-foreground">Try a different search term.</p>
                </div>
             )}
             <MoveTrailerDialog event={selectedEvent} isOpen={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen} />
        </div>
    );
}
