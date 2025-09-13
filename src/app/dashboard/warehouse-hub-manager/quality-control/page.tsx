
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldAlert, ShieldX, ListChecks, PlusCircle } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useSchedule, QualityHold, InventoryItem } from '@/hooks/use-schedule';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { QualityHoldTable } from '@/components/dashboard/quality-hold-table';

const PlaceOnHoldDialog = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSave: (data: { itemId: string; reason: string; notes?: string }) => void }) => {
    const { inventoryItems } = useSchedule();
    const [itemId, setItemId] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const { toast } = useToast();

    const availableItems = useMemo(() => {
        // In a real app, you might also filter out items already on hold.
        return inventoryItems.filter(item => item.qty > 0);
    }, [inventoryItems]);
    
    const handleSave = () => {
        if (!itemId || !reason) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select an item and provide a reason for the hold.' });
            return;
        }
        onSave({ itemId, reason, notes });
        setItemId('');
        setReason('');
        setNotes('');
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> Place Item on Hold
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Place Item on Quality Hold</DialogTitle>
                    <DialogDescription>
                        Select an item from inventory and specify why it is being placed on hold.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="item">Inventory Item</Label>
                        <Select value={itemId} onValueChange={setItemId}>
                            <SelectTrigger id="item">
                                <SelectValue placeholder="Select an item..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableItems.map(item => (
                                    <SelectItem key={item.sku} value={item.sku}>
                                        {item.sku} - {item.description} (Qty: {item.qty})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Hold</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="reason">
                                <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Damaged Goods">Damaged Goods</SelectItem>
                                <SelectItem value="Supplier Recall">Supplier Recall</SelectItem>
                                <SelectItem value="Failed Inspection">Failed Inspection</SelectItem>
                                <SelectItem value="Incorrect Labeling">Incorrect Labeling</SelectItem>
                                <SelectItem value="Other">Other (specify in notes)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Provide additional details..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Place on Hold</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function QualityControlPage() {
    const { qualityHolds, placeOnHold } = useSchedule();
    const [isHoldDialogOpen, setHoldDialogOpen] = useState(false);
    const { toast } = useToast();

    const activeHolds = qualityHolds.filter(h => h.status === 'On Hold').length;
    
    const handlePlaceOnHold = (data: { itemId: string; reason: string; notes?: string }) => {
        placeOnHold(data.itemId, data.reason, data.notes);
        toast({ title: 'Item Placed on Hold', description: `Item ${data.itemId} is now under quality review.` });
    };

    return (
        <div className="flex flex-col w-full">
        <Header pageTitle="Quality Control Management" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Holds</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{activeHolds}</div>
                        <p className="text-xs text-muted-foreground">Items currently under quality review.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inspections Passed (Today)</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Scrapped (Month)</CardTitle>
                        <ShieldX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Value: $1,250.00</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Supplier Issues (Month)</CardTitle>
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">2 related to damaged goods</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <ShieldCheck />
                            Quality Hold Management
                        </CardTitle>
                        <CardDescription>
                            Review items on hold, release them back to inventory, or mark them as scrapped.
                        </CardDescription>
                    </div>
                     <PlaceOnHoldDialog 
                        isOpen={isHoldDialogOpen}
                        onOpenChange={setHoldDialogOpen}
                        onSave={handlePlaceOnHold}
                    />
                </CardHeader>
                <CardContent>
                    <QualityHoldTable />
                </CardContent>
            </Card>
        </main>
        </div>
    );
}
