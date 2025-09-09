
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, CircleDollarSign, ShieldCheck, AlarmClock, PlusCircle, MoreHorizontal, FileDown, Upload, Paperclip } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type RepairOrder = {
    id: string;
    vehicleId: string;
    issue: string;
    status: 'Pending Estimate' | 'Pending Approval' | 'Work in Progress' | 'Completed' | 'Canceled';
    assignedTo: string; // Vendor or Personnel name
    poNumber: string;
    estimate?: number;
    finalCost?: number;
    dateCreated: Date;
    dateCompleted?: Date;
    documentUri?: string | null;
};

type PMSchedule = {
    id: string;
    vehicleId: string;
    serviceType: 'Oil Change' | 'Tire Rotation' | 'Annual Inspection';
    intervalType: 'mileage' | 'hours' | 'date';
    intervalValue: number;
    lastPerformedValue: number;
    lastPerformedDate: Date;
    nextDueValue: number;
};

const initialRepairOrders: RepairOrder[] = [
    { id: 'RO-001', vehicleId: 'TRK-101', issue: 'Engine knocking sound', status: 'Pending Estimate', assignedTo: 'City Auto Repair', poNumber: 'PO-12345', dateCreated: new Date() },
    { id: 'RO-002', vehicleId: 'VAN-03', issue: 'Brake pad replacement', status: 'Pending Approval', assignedTo: 'Internal Maintenance', poNumber: 'PO-12346', estimate: 450.00, dateCreated: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'RO-003', vehicleId: 'TRK-102', issue: 'Replace faulty headlight', status: 'Work in Progress', assignedTo: 'Internal Maintenance', poNumber: 'PO-12347', estimate: 75.00, dateCreated: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'RO-004', vehicleId: 'TRK-101', issue: 'Oil leak reported by driver', status: 'Completed', assignedTo: 'City Auto Repair', poNumber: 'PO-12348', estimate: 300.00, finalCost: 325.50, dateCreated: new Date(new Date().setDate(new Date().getDate() - 5)), dateCompleted: new Date(new Date().setDate(new Date().getDate() - 3)) },
];

const initialPMSchedules: PMSchedule[] = [
    { id: 'PM-1', vehicleId: 'TRK-101', serviceType: 'Oil Change', intervalType: 'mileage', intervalValue: 5000, lastPerformedValue: 48500, lastPerformedDate: new Date('2024-06-15'), nextDueValue: 53500 },
    { id: 'PM-2', vehicleId: 'VAN-03', serviceType: 'Annual Inspection', intervalType: 'date', intervalValue: 365, lastPerformedValue: 0, lastPerformedDate: new Date('2024-01-20'), nextDueValue: 0 },
    { id: 'PM-3', vehicleId: 'TRK-102', serviceType: 'Tire Rotation', intervalType: 'mileage', intervalValue: 10000, lastPerformedValue: 75000, lastPerformedDate: new Date('2024-05-10'), nextDueValue: 85000 },
];

const vendors = ['City Auto Repair', 'National Parts Supply', 'Highway Truck Service'];
const personnel = ['John Doe (Mechanic)', 'Jane Smith (Technician)'];
const vehicles = ['TRK-101', 'TRK-102', 'VAN-03', 'FL-005'];


function RepairOrderDialog({ isOpen, onOpenChange, orderToEdit, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, orderToEdit?: RepairOrder | null, onSave: (order: Omit<RepairOrder, 'id' | 'dateCreated'>) => void }) {
    const { toast } = useToast();
    const [vehicleId, setVehicleId] = useState('');
    const [issue, setIssue] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [documentUri, setDocumentUri] = useState<string | null>(null);

    React.useEffect(() => {
        if (orderToEdit) {
            setVehicleId(orderToEdit.vehicleId);
            setIssue(orderToEdit.issue);
            setAssignedTo(orderToEdit.assignedTo);
            setPoNumber(orderToEdit.poNumber);
            setDocumentUri(orderToEdit.documentUri || null);
        } else {
            setPoNumber(`PO-${Math.floor(Date.now() / 1000)}`); // Auto-generate PO
        }
    }, [orderToEdit]);

    const handleSave = () => {
        if (!vehicleId || !issue || !assignedTo || !poNumber) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
            return;
        }
        onSave({
            vehicleId,
            issue,
            assignedTo,
            poNumber,
            documentUri,
            status: 'Pending Estimate',
            // other fields will be set by the main component logic
        });
        onOpenChange(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{orderToEdit ? 'Edit Repair Order' : 'Create New Repair Order'}</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to create or update a repair order.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="vehicleId">Vehicle ID</Label>
                             <Select value={vehicleId} onValueChange={setVehicleId}>
                                <SelectTrigger id="vehicleId"><SelectValue placeholder="Select vehicle..." /></SelectTrigger>
                                <SelectContent>{vehicles.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                             </Select>
                         </div>
                         <div className="space-y-2">
                             <Label htmlFor="poNumber">PO Number</Label>
                             <Input id="poNumber" value={poNumber} onChange={e => setPoNumber(e.target.value)} />
                         </div>
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="issue">Issue Description</Label>
                         <Textarea id="issue" placeholder="Describe the reported issue..." value={issue} onChange={e => setIssue(e.target.value)} />
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="assignedTo">Assign To</Label>
                         <Select value={assignedTo} onValueChange={setAssignedTo}>
                            <SelectTrigger id="assignedTo"><SelectValue placeholder="Select vendor or personnel..." /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup><SelectLabel>Vendors</SelectLabel>{vendors.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectGroup>
                                <SelectGroup><SelectLabel>Personnel</SelectLabel>{personnel.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectGroup>
                            </SelectContent>
                         </Select>
                     </div>
                     <div className="space-y-2">
                         <Label>Attach Document (Optional)</Label>
                         <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Repair Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function FleetManagementPage() {
    const [repairOrders, setRepairOrders] = useState(initialRepairOrders);
    const [pmSchedules, setPmSchedules] = useState(initialPMSchedules);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveOrder = (orderData: Omit<RepairOrder, 'id' | 'dateCreated'>) => {
        const newOrder: RepairOrder = {
            ...orderData,
            id: `RO-${Date.now()}`,
            dateCreated: new Date(),
        };
        setRepairOrders(prev => [newOrder, ...prev]);
        toast({ title: 'Repair Order Created', description: `RO for vehicle ${newOrder.vehicleId} has been created.` });
    };

    const handleApproveEstimate = (orderId: string) => {
        setRepairOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Work in Progress' } : o));
        toast({ title: 'Estimate Approved!', description: `Repair order ${orderId} is now in progress.` });
    };

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Fleet HUB" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vehicles Overdue for PM</CardTitle>
                    <AlarmClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">2</div>
                    <p className="text-xs text-muted-foreground">Annual inspections & oil changes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Repair Orders</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Actively being worked on</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">Awaiting estimate approval</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Costs (YTD)</CardTitle>
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,450.75</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="repair-orders">
             <TabsList>
                <TabsTrigger value="repair-orders">Repair Orders</TabsTrigger>
                <TabsTrigger value="pm-schedule">PM & Inspections</TabsTrigger>
            </TabsList>
             <TabsContent value="repair-orders">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Repair Orders</CardTitle>
                            <CardDescription>
                                Track and manage all active and past vehicle repairs.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline"><FileDown className="mr-2"/>Export</Button>
                            <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2"/>New Repair Order</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>RO #</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Docs</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Estimate</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {repairOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.poNumber}</TableCell>
                                        <TableCell>{order.vehicleId}</TableCell>
                                        <TableCell className="max-w-xs truncate">{order.issue}</TableCell>
                                        <TableCell>{order.assignedTo}</TableCell>
                                        <TableCell>{order.documentUri ? <Paperclip className="h-4 w-4 text-muted-foreground"/> : 'N/A'}</TableCell>
                                        <TableCell><Badge variant={order.status === 'Completed' ? 'default' : (order.status === 'Pending Approval' || order.status === 'Pending Estimate') ? 'secondary' : 'outline'} className={cn(order.status === 'Completed' && 'bg-green-600')}>{order.status}</Badge></TableCell>
                                        <TableCell className="text-right">{order.estimate ? `$${order.estimate.toFixed(2)}` : 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    {order.status === 'Pending Approval' && <DropdownMenuItem onClick={() => handleApproveEstimate(order.id)}>Approve Estimate</DropdownMenuItem>}
                                                    <DropdownMenuItem>Add Note</DropdownMenuItem>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
             </TabsContent>
            <TabsContent value="pm-schedule">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">PM & Inspection Schedule</CardTitle>
                        <CardDescription>
                            View upcoming and overdue preventive maintenance and inspections for all vehicles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Interval</TableHead>
                                    <TableHead>Last Performed</TableHead>
                                    <TableHead>Next Due</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pmSchedules.map(pm => {
                                    const isDateInterval = pm.intervalType === 'date';
                                    const nextDueDate = isDateInterval ? new Date(pm.lastPerformedDate.getTime() + pm.intervalValue * 24 * 60 * 60 * 1000) : null;
                                    const isOverdue = nextDueDate ? new Date() > nextDueDate : false;
                                    
                                    return (
                                        <TableRow key={pm.id} className={cn(isOverdue && 'bg-destructive/10')}>
                                            <TableCell className="font-medium">{pm.vehicleId}</TableCell>
                                            <TableCell>{pm.serviceType}</TableCell>
                                            <TableCell className="capitalize">{pm.intervalValue.toLocaleString()} {isDateInterval ? 'Days' : pm.intervalType}</TableCell>
                                            <TableCell>{isDateInterval ? pm.lastPerformedDate.toLocaleDateString() : pm.lastPerformedValue.toLocaleString()} {isDateInterval ? '' : pm.intervalType}</TableCell>
                                            <TableCell className={cn("font-semibold", isOverdue && 'text-destructive')}>
                                                {isDateInterval && nextDueDate ? nextDueDate.toLocaleDateString() : pm.nextDueValue.toLocaleString()}{' '}
                                                {isDateInterval ? '' : pm.intervalType}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">Create RO</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        <RepairOrderDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveOrder} />

      </main>
    </div>
  );
}

    