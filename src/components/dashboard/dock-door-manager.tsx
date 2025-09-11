

"use client";

import { useMemo, useState } from 'react';
import { useSchedule, YardEvent, YardEventStatus } from '@/hooks/use-schedule';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Truck, PlusCircle, Warehouse, Search, MoreVertical, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';


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
                    Add Door
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Dock Door</DialogTitle>
                        <DialogDescription>
                            Enter a unique ID for the new door.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Door ID
                        </Label>
                        <Input
                            id="name"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="col-span-3"
                            placeholder={'e.g., D11'}
                        />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Door</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const EditStatusDialog = ({ event, isOpen, onOpenChange, onSave }: { event: YardEvent | null, isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (status: YardEventStatus, notes?: string) => void }) => {
    const [status, setStatus] = useState<YardEventStatus | undefined>(event?.status);
    const [notes, setNotes] = useState(event?.statusNotes || '');

    const statuses: YardEventStatus[] = ['Checked In', 'Loaded', 'Empty', 'Blocked', 'Repair Needed', 'Rejected', 'Late', 'Early', 'Product on hold', 'Exited', 'Waiting for dock'];

    React.useEffect(() => {
        setStatus(event?.status);
        setNotes(event?.statusNotes || '');
    }, [event]);

    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status for Trailer {event.trailerId}</DialogTitle>
                    <DialogDescription>
                        Set a new status and add optional notes for this trailer.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value: YardEventStatus) => setStatus(value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any relevant notes..."/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => { onSave(status!, notes); onOpenChange(false); }}>Save Status</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function DockDoorManager() {
    const { yardEvents, warehouseDoors, addWarehouseDoor, updateYardEventStatus } = useSchedule();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEvent, setEditingEvent] = useState<YardEvent | null>(null);
    const [isStatusDialogOpen, setStatusDialogOpen] = useState(false);

    const currentAssignments = useMemo(() => {
        const assignments: Record<string, YardEvent> = {};
        const seenTrailers: Record<string, YardEvent> = {};

        const sortedEvents = [...yardEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        for (const event of sortedEvents) {
            if (event.assignmentType !== 'door_assignment' || !event.assignmentValue) continue;

            // Find the most recent inbound event for this trailer
            const latestEventForTrailer = sortedEvents.find(e => e.trailerId === event.trailerId && e.transactionType === 'inbound');
            if (latestEventForTrailer?.assignmentValue !== event.assignmentValue || latestEventForTrailer?.assignmentType !== 'door_assignment') continue;


            if (seenTrailers[event.trailerId]) continue;
            seenTrailers[event.trailerId] = event;

            if (event.transactionType === 'inbound') {
                if (!assignments[event.assignmentValue]) {
                    assignments[event.assignmentValue] = event;
                }
            }
        }
        
        return assignments;
    }, [yardEvents]);
    
    const filteredDoors = useMemo(() => {
        if (!searchTerm.trim()) {
            return warehouseDoors;
        }

        const lowercasedSearch = searchTerm.toLowerCase();

        return warehouseDoors.filter(doorId => {
            const event = currentAssignments[doorId];
            if (!event) return false; // Only show occupied doors when searching

            return (
                event.trailerId.toLowerCase().includes(lowercasedSearch) ||
                event.carrier.toLowerCase().includes(lowercasedSearch) ||
                event.loadNumber.toLowerCase().includes(lowercasedSearch) ||
                event.status?.toLowerCase().includes(lowercasedSearch)
            );
        });
    }, [warehouseDoors, currentAssignments, searchTerm]);

    const handleAddDoor = (id: string) => {
        try {
            addWarehouseDoor(id);
            toast({ title: "Door Added", description: `Warehouse door ${id} has been added.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        }
    };
    
    const handleOpenStatusDialog = (event: YardEvent) => {
        setEditingEvent(event);
        setStatusDialogOpen(true);
    };

    const handleSaveStatus = (status: YardEventStatus, notes?: string) => {
        if (editingEvent) {
            updateYardEventStatus(editingEvent.id, status, notes);
            toast({ title: "Status Updated", description: `Trailer ${editingEvent.trailerId} status set to ${status}.`});
        }
    };

    const renderLocation = (locationId: string) => {
        const event = currentAssignments[locationId];

        return (
            <TooltipProvider key={locationId}>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "rounded-md border p-4 h-40 flex flex-col justify-between transition-colors shadow-sm",
                            event ? 'bg-primary/10 border-primary shadow-lg' : 'bg-muted/50'
                        )}>
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-lg">{locationId}</span>
                                {event ? <Truck className="w-6 h-6 text-primary" /> : <Warehouse className="w-6 h-6 text-muted-foreground" />}
                            </div>
                            {event ? (
                                <div className="text-sm">
                                    <p className="font-semibold truncate">{event.trailerId}</p>
                                    <p className="text-muted-foreground truncate">{event.carrier}</p>
                                    {event.status && (
                                        <p className="font-medium text-primary text-xs truncate">{event.status}</p>
                                    )}
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
                             <div className="space-y-1 text-sm p-2">
                                <p><strong>Trailer:</strong> {event.trailerId}</p>
                                <p><strong>Carrier:</strong> {event.carrier}</p>
                                <p><strong>Load/BOL:</strong> {event.loadNumber}</p>
                                <p><strong>Status:</strong> {event.status || 'Checked In'}</p>
                                {event.statusNotes && <p><strong>Notes:</strong> {event.statusNotes}</p>}
                                <p><strong>Arrived:</strong> {formatDistanceToNow(event.timestamp, { addSuffix: true })}</p>
                                <Button size="sm" className="w-full mt-2" onClick={() => handleOpenStatusDialog(event)}>
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Update Status
                                </Button>
                            </div>
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
                        placeholder="Search doors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <AddLocationDialog onAdd={handleAddDoor} />
            </div>
            {filteredDoors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                    {filteredDoors.map(renderLocation)}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center rounded-md border border-dashed h-64 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No matching doors found.</p>
                    <p className="text-sm text-muted-foreground">Try a different search term.</p>
                </div>
            )}
             <EditStatusDialog
                event={editingEvent}
                isOpen={isStatusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                onSave={handleSaveStatus}
            />
        </div>
    );
}
