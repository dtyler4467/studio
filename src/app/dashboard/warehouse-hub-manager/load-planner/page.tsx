

"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ClipboardList, PlusCircle, Truck, Package, Weight, Calendar, Save, XCircle, MinusCircle } from 'lucide-react';
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
import { useSchedule, Customer } from '@/hooks/use-schedule';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';


type OrderItem = { name: string; quantity: number };

type Order = {
    id: string;
    customer: string;
    destination: string; // city, state
    address: string;
    city: string;
    state: string;
    zip: string;
    contact: string;
    phone: string;
    notes?: string;
    appointmentTime?: Date;
    weight: number;
    volume: number;
    items: OrderItem[];
    bolNumber: string;
};

const initialOrders: Order[] = [
    { id: 'SO-101', customer: 'Customer A', destination: 'New York, NY', weight: 500, volume: 50, items: [{ name: 'Bolts', quantity: 50 }], bolNumber: 'BOL-1625101', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', contact: 'John Doe', phone: '555-1111' },
    { id: 'SO-102', customer: 'Customer B', destination: 'Chicago, IL', weight: 1200, volume: 150, items: [{ name: 'Washers', quantity: 100 }], bolNumber: 'BOL-1625102', address: '456 Oak Ave', city: 'Chicago', state: 'IL', zip: '60601', contact: 'Jane Smith', phone: '555-2222' },
    { id: 'SO-103', customer: 'Customer C', destination: 'Miami, FL', weight: 800, volume: 100, items: [{ name: 'Screws', quantity: 200 }], bolNumber: 'BOL-1625103', address: '789 Pine Ln', city: 'Miami', state: 'FL', zip: '33101', contact: 'Jim Brown', phone: '555-3333' },
    { id: 'SO-104', customer: 'Customer D', destination: 'New York, NY', weight: 250, volume: 30, items: [{ name: 'Nuts', quantity: 500 }], bolNumber: 'BOL-1625104', address: '101 Maple Rd', city: 'New York', state: 'NY', zip: '10002', contact: 'Sue Green', phone: '555-4444' },
];

const carriers = [
    { id: 'carrier-1', name: 'LogiFlow Transport' },
    { id: 'carrier-2', name: 'National Freight' },
    { id: 'carrier-3', name: 'Speedy Shipping' },
]

function AddOrderDialog({ onAddOrder }: { onAddOrder: (order: Omit<Order, 'id'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { inventoryItems, customers } = useSchedule();
    
    const [formData, setFormData] = useState<Omit<Order, 'id' | 'destination'>>({
        bolNumber: '',
        customer: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contact: '',
        phone: '',
        items: [],
        weight: 0,
        volume: 0,
        notes: '',
        appointmentTime: undefined,
    });
    
    const [customerSearch, setCustomerSearch] = useState("");
    const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false);
    
    const inventoryOptions: MultiSelectOption[] = inventoryItems.map(item => ({
        value: item.description,
        label: `${item.description} (${item.qty} available)`,
    }));

    useEffect(() => {
        if (isOpen) {
            setFormData({
                bolNumber: `BOL-${Date.now()}`,
                customer: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                contact: '',
                phone: '',
                items: [],
                weight: 0,
                volume: 0,
                notes: '',
                appointmentTime: undefined,
            });
            setCustomerSearch('');
        }
    }, [isOpen]);

    const handleSelectCustomer = (customer: Customer | null) => {
        if (customer) {
            const [city, state] = customer.destination?.split(', ') || ['', ''];
            setFormData(prev => ({
                ...prev,
                customer: customer.name,
                phone: customer.phone,
                city: city,
                state: state,
            }));
            setCustomerSearch(customer.name);
        } else {
             setFormData(prev => ({ ...prev, customer: customerSearch, phone: '', city: '', state: '' }));
        }
    };
    
    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleItemSelect = (itemName: string) => {
        if (!formData.items.some(item => item.name === itemName)) {
            handleInputChange('items', [...formData.items, { name: itemName, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (itemName: string, quantity: number) => {
        const newItems = formData.items.map(item => item.name === itemName ? { ...item, quantity } : item);
        handleInputChange('items', newItems);
    };

    const handleRemoveItem = (itemName: string) => {
        handleInputChange('items', formData.items.filter(item => item.name !== itemName));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newOrder = {
            ...formData,
            destination: `${formData.city}, ${formData.state}`,
        };

        if (!newOrder.customer || !newOrder.city || !newOrder.state || !newOrder.weight || !newOrder.volume || newOrder.items.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
            return;
        }

        onAddOrder(newOrder);
        toast({ title: 'Order Added', description: `Order ${newOrder.bolNumber} has been added. Redirecting to create BOL...` });
        
        const query = new URLSearchParams();
        query.set('bolNumber', newOrder.bolNumber);
        query.set('consigneeName', newOrder.customer);
        query.set('consigneeAddress', newOrder.address);
        query.set('consigneeCity', newOrder.city);
        query.set('consigneeState', newOrder.state);
        query.set('consigneeZip', newOrder.zip);
        query.set('consigneePhone', newOrder.phone);
        
        newOrder.items.forEach(item => {
            query.append('items', item.name);
            query.append('quantities', item.quantity.toString());
        });
        
        router.push(`/dashboard/warehouse-hub-manager/bol?${query.toString()}`);
        
        setIsOpen(false);
    };
    
    const handleAppointmentDateSelect = (date: Date | undefined) => {
        if (!date) {
            handleInputChange('appointmentTime', undefined);
            return;
        }
        const existingTime = formData.appointmentTime || new Date();
        const newDate = date;
        newDate.setHours(existingTime.getHours());
        newDate.setMinutes(existingTime.getMinutes());
        handleInputChange('appointmentTime', newDate);
    }
    
    const handleAppointmentTimeChange = (time: string) => {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(formData.appointmentTime || Date.now());
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
        handleInputChange('appointmentTime', newDate);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2"/> Manual Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Order</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new order you want to add to the planner.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-order-form" onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="space-y-2">
                        <Label htmlFor="bolNumber">BOL Number</Label>
                        <Input id="bolNumber" name="bolNumber" value={formData.bolNumber} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customer">Customer</Label>
                         <Popover open={isCustomerPopoverOpen} onOpenChange={setIsCustomerPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isCustomerPopoverOpen}
                                className="w-full justify-between"
                                >
                                {formData.customer || "Select customer..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                <CommandInput placeholder="Search customer..." value={customerSearch} onValueChange={setCustomerSearch} />
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandList>
                                    {customers
                                        .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                                        .map((customer) => (
                                    <CommandItem
                                        key={customer.id}
                                        value={customer.name}
                                        onSelect={() => {
                                            handleSelectCustomer(customer);
                                            setIsCustomerPopoverOpen(false)
                                        }}
                                    >
                                        {customer.name}
                                    </CommandItem>
                                    ))}
                                </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="e.g. 123 Main St" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" placeholder="e.g. Anytown" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" placeholder="e.g. CA" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" name="zip" placeholder="e.g. 12345" value={formData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Name</Label>
                            <Input id="contact" name="contact" placeholder="e.g. John Doe" value={formData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="e.g. 555-123-4567" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Items</Label>
                        <Select onValueChange={handleItemSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an item to add..." />
                            </SelectTrigger>
                            <SelectContent>
                                {inventoryOptions.map(item => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="space-y-2 mt-2">
                            {formData.items.map(item => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <Input value={item.name} readOnly className="flex-1" />
                                    <Input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value, 10) || 0)}
                                        className="w-20"
                                        min="1"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.name)}>
                                        <MinusCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input id="weight" name="weight" type="number" placeholder="e.g. 750" value={formData.weight > 0 ? formData.weight : ''} onChange={(e) => handleInputChange('weight', Number(e.target.value))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="volume">Volume (cu ft)</Label>
                            <Input id="volume" name="volume" type="number" placeholder="e.g. 80" value={formData.volume > 0 ? formData.volume : ''} onChange={(e) => handleInputChange('volume', Number(e.target.value))} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" placeholder="Add any notes for this order..." value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Appointment Time (Optional)</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.appointmentTime ? format(formData.appointmentTime, "PPP p") : <span>Pick a date & time</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    captionLayout="dropdown-buttons"
                                    fromYear={new Date().getFullYear()}
                                    toYear={new Date().getFullYear() + 5}
                                    mode="single"
                                    selected={formData.appointmentTime}
                                    onSelect={handleAppointmentDateSelect}
                                />
                                <div className="p-2 border-t border-border">
                                    <Input
                                        type="time"
                                        value={formData.appointmentTime ? format(formData.appointmentTime, "HH:mm") : ""}
                                        onChange={(e) => handleAppointmentTimeChange(e.target.value)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
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
  const { updateInventory } = useSchedule();
  
  const handleAddOrder = (order: Omit<Order, 'id'>) => {
      const newOrder: Order = { ...order, id: `SO-${Date.now()}` };
      setAvailableOrders(prev => [newOrder, ...prev]);
      // Update inventory
      order.items.forEach(item => {
          updateInventory(item.name, -item.quantity);
      });
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
