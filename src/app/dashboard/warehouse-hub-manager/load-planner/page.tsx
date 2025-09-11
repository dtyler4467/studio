
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ClipboardList, PlusCircle, Truck, Package, Weight, Calendar, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { useRouter } from 'next/navigation';

type Order = {
    id: string;
    customer: string;
    destination: string;
    weight: number;
    volume: number;
    items: string[];
    bolNumber: string;
};

const initialOrders: Order[] = [
    { id: 'SO-101', customer: 'Customer A', destination: 'New York, NY', weight: 500, volume: 50, items: ['Bolts'], bolNumber: 'BOL-1625101' },
    { id: 'SO-102', customer: 'Customer B', destination: 'Chicago, IL', weight: 1200, volume: 150, items: ['Washers'], bolNumber: 'BOL-1625102' },
    { id: 'SO-103', customer: 'Customer C', destination: 'Miami, FL', weight: 800, volume: 100, items: ['Screws'], bolNumber: 'BOL-1625103' },
    { id: 'SO-104', customer: 'Customer D', destination: 'New York, NY', weight: 250, volume: 30, items: ['Nuts'], bolNumber: 'BOL-1625104' },
];

const carriers = [
    { id: 'carrier-1', name: 'LogiFlow Transport' },
    { id: 'carrier-2', name: 'National Freight' },
    { id: 'carrier-3', name: 'Speedy Shipping' },
]

const inventoryItems: MultiSelectOption[] = [
    { value: 'Bolts (1250 available)', label: 'Bolts (1250 available)' },
    { value: 'Washers (450 available)', label: 'Washers (450 available)' },
    { value: 'Screws (3000 available)', label: 'Screws (3000 available)' },
    { value: 'Nuts (0 available)', label: 'Nuts (0 available)' },
    { value: 'Pallet of Bricks (Not Tracked)', label: 'Pallet of Bricks (Not Tracked)' },
];

function AddOrderDialog({ onAddOrder }: { onAddOrder: (order: Omit<Order, 'id'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const [bolNumber, setBolNumber] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    useEffect(() => {
        if (isOpen) {
            setBolNumber(`BOL-${Date.now()}`);
            setSelectedItems([]);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newOrder = {
            customer: formData.get('customer') as string,
            destination: formData.get('destination') as string,
            items: selectedItems,
            weight: Number(formData.get('weight')),
            volume: Number(formData.get('volume')),
            bolNumber: bolNumber,
        };

        if (!newOrder.customer || !newOrder.destination || !newOrder.weight || !newOrder.volume || newOrder.items.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }

        onAddOrder(newOrder);
        toast({ title: 'Order Added', description: `Order ${newOrder.bolNumber} has been added. Redirecting to create BOL...` });
        
        const query = new URLSearchParams();
        query.set('bolNumber', newOrder.bolNumber);
        query.set('consigneeName', newOrder.customer);
        query.set('consigneeDestination', newOrder.destination);
        newOrder.items.forEach(item => query.append('items', item));
        
        router.push(`/dashboard/warehouse-hub-manager/bol?${query.toString()}`);
        
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2"/> Manual Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Order</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new order you want to add to the planner.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-order-form" onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="space-y-2">
                        <Label htmlFor="bolNumber">BOL Number</Label>
                        <Input id="bolNumber" name="bolNumber" value={bolNumber} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customer">Customer</Label>
                        <Input id="customer" name="customer" placeholder="e.g. Customer E" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input id="destination" name="destination" placeholder="e.g. San Francisco, CA" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="item">Items</Label>
                        <MultiSelect
                            options={inventoryItems}
                            selected={selectedItems}
                            onChange={setSelectedItems}
                            placeholder="Select or add items..."
                            allowOther
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input id="weight" name="weight" type="number" placeholder="e.g. 750" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="volume">Volume (cu ft)</Label>
                            <Input id="volume" name="volume" type="number" placeholder="e.g. 80" />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" form="add-order-form">Add Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function LoadPlannerPage() {
  const [availableOrders, setAvailableOrders] = useState<Order[]>(initialOrders);
  
  const handleAddOrder = (order: Omit<Order, 'id'>) => {
      const newOrder: Order = { ...order, id: `SO-${Date.now()}` };
      setAvailableOrders(prev => [newOrder, ...prev]);
  };

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Load Planner" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {/* Panel 1: Available Orders */}
            <Card className="lg:col-span-1 xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Package />
                            Available Orders
                        </CardTitle>
                        <CardDescription>
                            Select orders to add to the current load.
                        </CardDescription>
                    </div>
                    <AddOrderDialog onAddOrder={handleAddOrder} />
                </CardHeader>
                <CardContent className="space-y-3 h-[600px] overflow-y-auto">
                    {availableOrders.map(order => (
                        <div key={order.id} className="border p-3 rounded-lg flex justify-between items-center">
                           <div className="text-sm">
                             <p className="font-semibold">{order.id} - {order.destination}</p>
                             <p className="text-muted-foreground">{order.weight} lbs, {order.volume} cu ft</p>
                           </div>
                           <Button size="icon" variant="outline" className="h-8 w-8">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only">Add to load</span>
                           </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Panel 2: Current Load Plan */}
            <Card className="lg:col-span-2 xl:col-span-2">
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Truck />
                        Current Load Plan
                    </CardTitle>
                    <CardDescription>
                       Build your outbound load. Drag and drop or add orders from the left.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <Label>Total Weight (44,000 lbs max)</Label>
                            <Progress value={25} className="mt-2" />
                            <p className="text-sm font-semibold mt-1">11,000 lbs</p>
                        </div>
                         <div>
                            <Label>Total Volume (3,500 cu ft max)</Label>
                            <Progress value={40} className="mt-2" />
                             <p className="text-sm font-semibold mt-1">1,400 cu ft</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="min-h-[400px] bg-muted rounded-lg p-4 space-y-2 border border-dashed">
                        {/* Planned items would go here */}
                         <div className="border p-3 rounded-lg flex justify-between items-center bg-background">
                           <div className="text-sm">
                             <p className="font-semibold">SO-101 - New York, NY</p>
                             <p className="text-muted-foreground">500 lbs, 50 cu ft</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Remove from load</span>
                           </Button>
                        </div>
                         <div className="border p-3 rounded-lg flex justify-between items-center bg-background">
                           <div className="text-sm">
                             <p className="font-semibold">SO-104 - New York, NY</p>
                             <p className="text-muted-foreground">250 lbs, 30 cu ft</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Remove from load</span>
                           </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Panel 3: Load Details & Actions */}
             <Card className="lg:col-span-3 xl:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <ClipboardList />
                        Load Details
                    </CardTitle>
                    <CardDescription>
                        Finalize the details for this load.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="load-id">Load ID</Label>
                        <Input id="load-id" placeholder="e.g. LOAD-2024-001" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier</Label>
                         <Select>
                            <SelectTrigger id="carrier">
                                <SelectValue placeholder="Select a carrier" />
                            </SelectTrigger>
                            <SelectContent>
                                {carriers.map(carrier => (
                                    <SelectItem key={carrier.id} value={carrier.id}>{carrier.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ship-date">Ship Date</Label>
                        <Input id="ship-date" type="date" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <Save className="mr-2" />
                        Finalize & Create Load
                    </Button>
                </CardFooter>
             </Card>
        </div>
      </main>
    </div>
  );
}

    