
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, Briefcase, User, Play, StopCircle, PlusCircle, Car, Fuel, Upload, Map, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useSchedule } from '@/hooks/use-schedule';


type Trip = {
    id: string;
    date: Date;
    type: 'Business' | 'Personal';
    startLocation: string;
    endLocation: string;
    distance: number; // in miles
    fuelType?: string;
    receiptUri?: string | null;
};

const initialTrips: Trip[] = [
    { id: 'TRIP001', date: new Date(new Date().setDate(new Date().getDate() - 1)), type: 'Business', startLocation: '123 Main St, Anytown', endLocation: '456 Oak Ave, Anytown', distance: 15.2 },
    { id: 'TRIP002', date: new Date(new Date().setDate(new Date().getDate() - 2)), type: 'Personal', startLocation: '456 Oak Ave, Anytown', endLocation: '789 Pine Ln, Anytown', distance: 5.7 },
    { id: 'TRIP003', date: new Date(new Date().setDate(new Date().getDate() - 3)), type: 'Business', startLocation: '789 Pine Ln, Anytown', endLocation: '101 Maple Rd, Anytown', distance: 22.1 },
];


function TripEntryDialog({ onSave, tripToEdit }: { onSave: (trip: Omit<Trip, 'id'>) => void, tripToEdit?: Trip | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'Business' | 'Personal'>('Business');
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [distance, setDistance] = useState('');
    const [receiptUri, setReceiptUri] = useState<string | null>(null);

    useEffect(() => {
        if (tripToEdit) {
            setType(tripToEdit.type);
            setStartLocation(tripToEdit.startLocation);
            setEndLocation(tripToEdit.endLocation);
            setDistance(tripToEdit.distance.toString());
            setReceiptUri(tripToEdit.receiptUri || null);
            setIsOpen(true);
        } else {
             // Reset form when dialog is closed or no trip is being edited
            setType('Business');
            setStartLocation('');
            setEndLocation('');
            setDistance('');
            setReceiptUri(null);
        }
    }, [tripToEdit, isOpen]);


    const handleSave = () => {
        const newTrip = {
            date: new Date(),
            type,
            startLocation,
            endLocation,
            distance: parseFloat(distance),
            receiptUri,
        };
        onSave(newTrip);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> Manual Entry</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{tripToEdit ? 'Edit Trip' : 'Add Manual Trip'}</DialogTitle>
                    <DialogDescription>
                        Enter the details for the trip below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="flex items-center space-x-2">
                        <Label htmlFor="trip-type">Personal</Label>
                        <Switch id="trip-type" checked={type === 'Business'} onCheckedChange={(checked) => setType(checked ? 'Business' : 'Personal')} />
                        <Label htmlFor="trip-type">Business</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Start Location" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
                        <Input placeholder="End Location" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} />
                    </div>
                    <Input placeholder="Distance (miles)" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                    <DocumentUpload onDocumentChange={setReceiptUri} currentDocument={receiptUri} />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Trip</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function MileageTrackerPage() {
    const [trips, setTrips] = useState<Trip[]>(initialTrips);
    const [isTracking, setIsTracking] = useState(false);
    const [currentTripType, setCurrentTripType] = useState<'Business' | 'Personal'>('Business');
    const [time, setTime] = useState(new Date());
    const { toast } = useToast();
    const { currentUser } = useSchedule();
    const tripIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [currentDistance, setCurrentDistance] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isTracking) {
            tripIntervalRef.current = setInterval(() => {
                // Simulate distance increasing
                setCurrentDistance(prev => prev + Math.random() * 0.1); 
            }, 2000);
        } else {
            if (tripIntervalRef.current) {
                clearInterval(tripIntervalRef.current);
            }
        }
        return () => {
            if (tripIntervalRef.current) clearInterval(tripIntervalRef.current)
        };
    }, [isTracking]);

    const handleStartTrip = () => {
        setIsTracking(true);
        setCurrentDistance(0);
        toast({ title: 'Trip Started', description: `Tracking started for a ${currentTripType} trip.` });
    };

    const handleStopTrip = () => {
        setIsTracking(false);
        const newTrip: Trip = {
            id: `TRIP${Date.now()}`,
            date: new Date(),
            type: currentTripType,
            startLocation: 'Current Location (GPS)',
            endLocation: 'End Location (GPS)',
            distance: parseFloat(currentDistance.toFixed(2)),
        };
        setTrips(prev => [newTrip, ...prev]);
        toast({ title: 'Trip Ended', description: `Logged a ${currentTripType} trip of ${newTrip.distance} miles.` });
        setCurrentDistance(0);
    };
    
    const handleAddTrip = (trip: Omit<Trip, 'id'>) => {
        setTrips(prev => [{...trip, id: `TRIP${Date.now()}`}, ...prev]);
        toast({title: 'Trip Added', description: 'The manual trip has been logged.'});
    };
    
    const businessMiles = trips.filter(t => t.type === 'Business').reduce((acc, t) => acc + t.distance, 0);
    const personalMiles = trips.filter(t => t.type === 'Personal').reduce((acc, t) => acc + t.distance, 0);


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Mileage Tracker" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current User</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentUser?.name || 'Guest'}</div>
                    <p className="text-xs text-muted-foreground">{format(time, 'PPP p')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Business Miles (YTD)</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{businessMiles.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total business miles logged</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Personal Miles (YTD)</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{personalMiles.toFixed(2)}</div>
                     <p className="text-xs text-muted-foreground">Total personal miles logged</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{trips.length}</div>
                     <p className="text-xs text-muted-foreground">Total trips logged</p>
                </CardContent>
            </Card>
        </div>


        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Gauge />
                    GPS Trip Tracker
                </CardTitle>
                <CardDescription>
                   Start tracking to automatically record your trip, then classify it as business or personal.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="trip-type" className={currentTripType === 'Personal' ? 'font-bold' : 'text-muted-foreground'}>Personal</Label>
                    <Switch id="trip-type" checked={currentTripType === 'Business'} onCheckedChange={(checked) => setCurrentTripType(checked ? 'Business' : 'Personal')} />
                    <Label htmlFor="trip-type" className={currentTripType === 'Business' ? 'font-bold' : 'text-muted-foreground'}>Business</Label>
                </div>
                 {isTracking ? (
                    <Button size="lg" variant="destructive" onClick={handleStopTrip}>
                        <StopCircle className="mr-2"/> Stop Trip ({currentDistance.toFixed(2)} mi)
                    </Button>
                 ) : (
                    <Button size="lg" onClick={handleStartTrip}>
                        <Play className="mr-2"/> Start Trip
                    </Button>
                 )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="font-headline">Trip History</CardTitle>
                    <CardDescription>
                        A log of all your recorded business and personal trips.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <TripEntryDialog onSave={handleAddTrip} />
                     <Button variant="outline">Export Data</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Receipt</TableHead>
                            <TableHead className="text-right">Distance</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.id}>
                                <TableCell>{format(trip.date, 'PPP')}</TableCell>
                                <TableCell>
                                    <Badge variant={trip.type === 'Business' ? 'default' : 'secondary'}>{trip.type}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <p>{trip.startLocation}</p>
                                    <p className="text-muted-foreground text-xs">to {trip.endLocation}</p>
                                </TableCell>
                                <TableCell>
                                    {trip.receiptUri ? <Badge variant="outline">Yes</Badge> : <Badge variant="destructive">No</Badge>}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {trip.distance.toFixed(2)} mi
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
