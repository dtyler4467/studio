
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, CircleDollarSign, ShieldCheck, AlarmClock, PlusCircle, MoreHorizontal, FileDown, Upload, Paperclip, Check, Edit, FilePlus, Truck, PackagePlus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useState, useRef, useMemo } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from "xlsx";
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { useSchedule, Equipment } from '@/hooks/use-schedule';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender, Row } from '@tanstack/react-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


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
    serviceType: string;
    intervalType: 'mileage' | 'hours' | 'date';
    intervalValue: number;
    lastPerformedValue: number;
    lastPerformedDate: Date;
    nextDueValue: number;
    notes?: string;
    documentUri?: string | null;
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

function RepairOrderDialog({ isOpen, onOpenChange, orderToEdit, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, orderToEdit?: RepairOrder | null, onSave: (order: Omit<RepairOrder, 'id' | 'dateCreated'>) => void }) {
    const { toast } = useToast();
    const { equipment } = useSchedule();
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
                                <SelectContent>{equipment.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}</SelectContent>
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

function PMScheduleDialog({ isOpen, onOpenChange, scheduleToEdit, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, scheduleToEdit?: PMSchedule | null, onSave: (schedule: Omit<PMSchedule, 'id'> | PMSchedule) => void }) {
    const { toast } = useToast();
    const { equipment } = useSchedule();
    const [formState, setFormState] = useState<Omit<PMSchedule, 'id'>>({
        vehicleId: '',
        serviceType: 'Oil Change',
        intervalType: 'mileage',
        intervalValue: 5000,
        lastPerformedValue: 0,
        lastPerformedDate: new Date(),
        nextDueValue: 5000,
    });

    React.useEffect(() => {
        if (scheduleToEdit) {
            setFormState(scheduleToEdit);
        } else {
             setFormState({
                vehicleId: '', serviceType: 'Oil Change', intervalType: 'mileage',
                intervalValue: 5000, lastPerformedValue: 0, lastPerformedDate: new Date(), nextDueValue: 5000,
            });
        }
    }, [scheduleToEdit]);

    const handleSave = () => {
        if (!formState.vehicleId || !formState.serviceType) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out Vehicle and Service Type.' });
            return;
        }
        
        const dataToSave = scheduleToEdit ? { ...formState, id: scheduleToEdit.id } : formState;
        onSave(dataToSave);
        onOpenChange(false);
    };

    const handleInputChange = (field: keyof typeof formState, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>{scheduleToEdit ? 'Edit PM Schedule' : 'Create New PM Schedule'}</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to create or update a preventive maintenance schedule.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label>Vehicle ID</Label>
                             <Select value={formState.vehicleId} onValueChange={(v) => handleInputChange('vehicleId', v)}>
                                <SelectTrigger><SelectValue placeholder="Select vehicle..." /></SelectTrigger>
                                <SelectContent>{equipment.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}</SelectContent>
                             </Select>
                         </div>
                         <div className="space-y-2">
                             <Label>Service Type</Label>
                             <Input value={formState.serviceType} onChange={(e) => handleInputChange('serviceType', e.target.value)} placeholder="e.g., Oil Change" />
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label>Interval Type</Label>
                             <Select value={formState.intervalType} onValueChange={(v) => handleInputChange('intervalType', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mileage">Mileage</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                             <Label>Interval Value</Label>
                             <Input type="number" value={formState.intervalValue} onChange={(e) => handleInputChange('intervalValue', Number(e.target.value))} />
                        </div>
                     </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Last Performed ({formState.intervalType})</Label>
                            <Input type="number" value={formState.lastPerformedValue} onChange={(e) => handleInputChange('lastPerformedValue', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Performed Date</Label>
                            <Input type="date" value={format(new Date(formState.lastPerformedDate), 'yyyy-MM-dd')} onChange={(e) => handleInputChange('lastPerformedDate', new Date(e.target.value))} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Schedule</Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>
    )
}

function AddEquipmentDialog({ onSave }: { onSave: (equipment: Omit<Equipment, 'id'>) => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [formState, setFormState] = useState<Omit<Equipment, 'id'>>({
        name: '', type: 'Truck', make: '', model: '', vin: '', fuelType: 'Diesel',
        registrationExpiry: new Date(), inspectionExpiry: new Date(), notes: '', documentUri: null,
    });
    
    const handleSave = () => {
        if(!formState.name || !formState.vin || !formState.make || !formState.model) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.'});
            return;
        }
        onSave(formState);
        setIsOpen(false);
        setFormState({name: '', type: 'Truck', make: '', model: '', vin: '', fuelType: 'Diesel', registrationExpiry: new Date(), inspectionExpiry: new Date(), notes: '', documentUri: null});
    }

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/>Add Equipment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                    <DialogDescription>
                        Fill out the details for the new piece of equipment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Equipment Name/Unit #</Label>
                            <Input value={formState.name} onChange={(e) => setFormState(f => ({...f, name: e.target.value}))} placeholder="e.g. TRK-103"/>
                        </div>
                        <div className="space-y-2">
                            <Label>VIN</Label>
                            <Input value={formState.vin} onChange={(e) => setFormState(f => ({...f, vin: e.target.value}))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Equipment Type</Label>
                            <Select value={formState.type} onValueChange={(v: Equipment['type']) => setFormState(f => ({...f, type: v}))}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Truck">Truck</SelectItem>
                                    <SelectItem value="Trailer">Trailer</SelectItem>
                                    <SelectItem value="Van">Van</SelectItem>
                                    <SelectItem value="Forklift">Forklift</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fuel Type</Label>
                            <Select value={formState.fuelType} onValueChange={(v: Equipment['fuelType']) => setFormState(f => ({...f, fuelType: v}))}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                                    <SelectItem value="Electric">Electric</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Make</Label>
                            <Input value={formState.make} onChange={(e) => setFormState(f => ({...f, make: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Input value={formState.model} onChange={(e) => setFormState(f => ({...f, model: e.target.value}))} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Registration Expiry</Label>
                            <Input type="date" value={format(new Date(formState.registrationExpiry), 'yyyy-MM-dd')} onChange={(e) => setFormState(f => ({...f, registrationExpiry: new Date(e.target.value)}))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Inspection Expiry</Label>
                            <Input type="date" value={format(new Date(formState.inspectionExpiry), 'yyyy-MM-dd')} onChange={(e) => setFormState(f => ({...f, inspectionExpiry: new Date(e.target.value)}))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={formState.notes || ''} onChange={(e) => setFormState(f => ({...f, notes: e.target.value}))} placeholder="Add any relevant notes..." />
                    </div>
                     <div className="space-y-2">
                        <Label>Attach Document (Optional)</Label>
                        <DocumentUpload onDocumentChange={(uri) => setFormState(f => ({...f, documentUri: uri}))} currentDocument={formState.documentUri} />
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Equipment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EquipmentTable() {
    const { equipment, deleteEquipment, currentUser } = useSchedule();
    const { toast } = useToast();
    const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);

    const handleDeleteClick = (equipment: Equipment) => {
        setEquipmentToDelete(equipment);
    }
    
    const confirmDelete = () => {
        if (equipmentToDelete && currentUser) {
            deleteEquipment(equipmentToDelete.id, currentUser.id);
            toast({ variant: 'destructive', title: 'Equipment Deleted', description: `${equipmentToDelete.name} has been moved to the trash.`});
        }
        setEquipmentToDelete(null);
    }
    
    const columns: ColumnDef<Equipment>[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name/Unit #' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'make', header: 'Make' },
        { accessorKey: 'model', header: 'Model' },
        { accessorKey: 'vin', header: 'VIN' },
        { accessorKey: 'registrationExpiry', header: 'Reg. Expiry', cell: ({cell}) => format(new Date(cell.getValue() as string), 'P') },
        { accessorKey: 'inspectionExpiry', header: 'Insp. Expiry', cell: ({cell}) => format(new Date(cell.getValue() as string), 'P') },
        {
            id: 'actions',
            cell: ({ row }: { row: Row<Equipment> }) => {
                const equipmentItem = row.original;
                return (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(equipmentItem)} onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will move the equipment "{equipmentToDelete?.name}" to the trash. You can restore it later.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setEquipmentToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
        }
    ], [currentUser, deleteEquipment, equipmentToDelete]);

    const table = useReactTable({
        data: equipment,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default function RepairShopPage() {
    const { equipment, addEquipment } = useSchedule();
    const [repairOrders, setRepairOrders] = useState(initialRepairOrders);
    const [pmSchedules, setPmSchedules] = useState(initialPMSchedules);
    const [isRODialogOpen, setRODialogOpen] = useState(false);
    const [isPMDialogOpen, setPMDialogOpen] = useState(false);
    const [selectedROs, setSelectedROs] = useState<string[]>([]);
    const [selectedPMs, setSelectedPMs] = useState<string[]>([]);
    const [editingPM, setEditingPM] = useState<PMSchedule | null>(null);
    const [editingDocPM, setEditingDocPM] = useState<PMSchedule | null>(null);

    const { toast } = useToast();
    const roFileInputRef = useRef<HTMLInputElement>(null);
    const pmFileInputRef = useRef<HTMLInputElement>(null);

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

    const handleROSelect = (orderId: string) => {
        setSelectedROs(prev => 
            prev.includes(orderId) 
            ? prev.filter(id => id !== orderId)
            : [...prev, orderId]
        );
    };

    const handlePMSelect = (pmId: string) => {
        setSelectedPMs(prev => 
            prev.includes(pmId) 
            ? prev.filter(id => id !== pmId)
            : [...prev, pmId]
        );
    };
    
    const handleExportROs = () => {
        const dataToExport = repairOrders
            .filter(order => selectedROs.includes(order.id))
            .map(order => ({
                'PO Number': order.poNumber, 'Vehicle ID': order.vehicleId, 'Issue': order.issue, 'Status': order.status, 'Assigned To': order.assignedTo,
                'Estimate': order.estimate ?? "N/A", 'Final Cost': order.finalCost ?? "N/A", 'Date Created': order.dateCreated ? format(order.dateCreated, "yyyy-MM-dd HH:mm:ss") : "N/A",
                'Date Completed': order.dateCompleted ? format(order.dateCompleted, "yyyy-MM-dd HH:mm:ss") : "N/A",
            }));
        if (dataToExport.length === 0) {
             toast({ variant: 'destructive', title: "No Rows Selected", description: "Please select at least one repair order to export." });
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "RepairOrders");
        XLSX.writeFile(workbook, `RepairOrders_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        toast({ title: "Export Successful", description: `${dataToExport.length} repair order(s) have been exported.` });
    };

    const handleImportROs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];
                const newOrders: RepairOrder[] = json.map((row: any) => ({
                    id: `RO-IMP-${Date.now()}-${Math.random()}`, poNumber: String(row["PO Number"]), vehicleId: String(row["Vehicle ID"]), issue: String(row.Issue),
                    status: row.Status || 'Pending Estimate', assignedTo: String(row["Assigned To"]), estimate: row.Estimate ? Number(row.Estimate) : undefined,
                    finalCost: row["Final Cost"] ? Number(row["Final Cost"]) : undefined, dateCreated: row["Date Created"] ? new Date(row["Date Created"]) : new Date(),
                    dateCompleted: row["Date Completed"] && row["Date Completed"] !== "N/A" ? new Date(row["Date Completed"]) : undefined,
                }));
                setRepairOrders(prev => [...prev, ...newOrders]);
                toast({ title: "Import Successful", description: `${newOrders.length} repair order(s) imported.` });
            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "Please check the file format and try again." });
            } finally {
                 if (roFileInputRef.current) roFileInputRef.current.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleSavePMSchedule = (scheduleData: Omit<PMSchedule, 'id'> | PMSchedule) => {
        if ('id' in scheduleData) {
            setPmSchedules(prev => prev.map(s => s.id === scheduleData.id ? scheduleData : s));
            toast({ title: 'PM Schedule Updated', description: `Schedule for ${scheduleData.vehicleId} has been updated.` });
        } else {
            const newSchedule: PMSchedule = { ...scheduleData, id: `PM-${Date.now()}` };
            setPmSchedules(prev => [newSchedule, ...prev]);
            toast({ title: 'PM Schedule Created', description: `New schedule for ${newSchedule.vehicleId} has been created.` });
        }
    };
    
    const handleSavePMDocument = (docUri: string | null) => {
        if (editingDocPM) {
            setPmSchedules(prev => prev.map(s => s.id === editingDocPM.id ? { ...s, documentUri: docUri } : s));
            toast({ title: 'Document Saved', description: `Document for ${editingDocPM.vehicleId} has been updated.`});
            setEditingDocPM(null);
        }
    };

    const handleExportPMs = () => {
         const dataToExport = pmSchedules
            .filter(pm => selectedPMs.includes(pm.id))
            .map(pm => ({
                'Vehicle ID': pm.vehicleId, 'Service Type': pm.serviceType, 'Interval Type': pm.intervalType, 'Interval Value': pm.intervalValue,
                'Last Performed Value': pm.lastPerformedValue, 'Last Performed Date': format(new Date(pm.lastPerformedDate), 'yyyy-MM-dd'), 'Next Due Value': pm.nextDueValue
            }));
        if (dataToExport.length === 0) {
            toast({ variant: 'destructive', title: "No Rows Selected", description: "Please select at least one PM schedule to export." });
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PMSchedules");
        XLSX.writeFile(workbook, `PMSchedules_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        toast({ title: "Export Successful", description: `${dataToExport.length} PM schedule(s) have been exported.` });
    };

    const handleImportPMs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];
                const newSchedules: PMSchedule[] = json.map((row: any) => ({
                    id: `PM-IMP-${Date.now()}-${Math.random()}`,
                    vehicleId: String(row["Vehicle ID"]), serviceType: String(row["Service Type"]), intervalType: row["Interval Type"], intervalValue: Number(row["Interval Value"]),
                    lastPerformedValue: Number(row["Last Performed Value"]), lastPerformedDate: new Date(row["Last Performed Date"]), nextDueValue: Number(row["Next Due Value"]),
                }));
                setPmSchedules(prev => [...prev, ...newSchedules]);
                toast({ title: "Import Successful", description: `${newSchedules.length} PM schedule(s) imported.` });
            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "Please check the file format and try again." });
            } finally {
                 if (pmFileInputRef.current) pmFileInputRef.current.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleAddEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
        addEquipment(equipmentData);
        toast({ title: 'Equipment Added', description: `Successfully added ${equipmentData.name} to the fleet.` });
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Repair Shop" />
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
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
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
                             <Input type="file" ref={roFileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleImportROs} />
                            <Button variant="outline" onClick={() => roFileInputRef.current?.click()}><Upload className="mr-2" />Import</Button>
                            <Button variant="outline" onClick={handleExportROs} disabled={selectedROs.length === 0}><FileDown className="mr-2"/>Export Selected ({selectedROs.length})</Button>
                            <Button onClick={() => setRODialogOpen(true)}><PlusCircle className="mr-2"/>New Repair Order</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"><Checkbox checked={selectedROs.length === repairOrders.length && repairOrders.length > 0} onCheckedChange={(checked) => setSelectedROs(checked ? repairOrders.map(o => o.id) : [])} /></TableHead>
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
                                        <TableCell><Checkbox checked={selectedROs.includes(order.id)} onCheckedChange={() => handleROSelect(order.id)} /></TableCell>
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
                    <CardHeader className="flex-row items-center justify-between">
                         <div>
                            <CardTitle className="font-headline">PM & Inspection Schedule</CardTitle>
                            <CardDescription>View upcoming and overdue preventive maintenance and inspections for all vehicles.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Input type="file" ref={pmFileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleImportPMs} />
                            <Button variant="outline" onClick={() => pmFileInputRef.current?.click()}><Upload className="mr-2" />Import</Button>
                            <Button variant="outline" onClick={handleExportPMs} disabled={selectedPMs.length === 0}><FileDown className="mr-2"/>Export Selected ({selectedPMs.length})</Button>
                            <Button onClick={() => { setEditingPM(null); setPMDialogOpen(true); }}><PlusCircle className="mr-2"/>Create Schedule</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"><Checkbox checked={selectedPMs.length === pmSchedules.length && pmSchedules.length > 0} onCheckedChange={(checked) => setSelectedPMs(checked ? pmSchedules.map(p => p.id) : [])} /></TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Interval</TableHead>
                                    <TableHead>Last Performed</TableHead>
                                    <TableHead>Next Due</TableHead>
                                    <TableHead>Docs</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pmSchedules.map(pm => {
                                    const isDateInterval = pm.intervalType === 'date';
                                    const nextDueDate = isDateInterval ? new Date(new Date(pm.lastPerformedDate).getTime() + pm.intervalValue * 24 * 60 * 60 * 1000) : null;
                                    const isOverdue = nextDueDate ? new Date() > nextDueDate : false;
                                    
                                    return (
                                        <TableRow key={pm.id} className={cn(isOverdue && 'bg-destructive/10')}>
                                            <TableCell><Checkbox checked={selectedPMs.includes(pm.id)} onCheckedChange={() => handlePMSelect(pm.id)}/></TableCell>
                                            <TableCell className="font-medium">{pm.vehicleId}</TableCell>
                                            <TableCell>{pm.serviceType}</TableCell>
                                            <TableCell className="capitalize">{pm.intervalValue.toLocaleString()} {isDateInterval ? 'Days' : pm.intervalType}</TableCell>
                                            <TableCell>{isDateInterval ? format(new Date(pm.lastPerformedDate), 'P') : `${pm.lastPerformedValue.toLocaleString()} ${pm.intervalType}`}</TableCell>
                                            <TableCell className={cn("font-semibold", isOverdue && 'text-destructive')}>
                                                {isDateInterval && nextDueDate ? format(nextDueDate, 'P') : `${pm.nextDueValue.toLocaleString()} ${pm.intervalType}`}
                                            </TableCell>
                                            <TableCell>{pm.documentUri ? <Paperclip className="h-4 w-4 text-muted-foreground"/> : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => { setEditingPM(pm); setPMDialogOpen(true); }}><Edit className="mr-2 h-4 w-4"/>Edit Schedule</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingDocPM(pm)}><FilePlus className="mr-2 h-4 w-4"/>Add/Edit Document</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Log Service</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="equipment">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Equipment & Vehicle Fleet</CardTitle>
                            <CardDescription>
                                Add, view, and manage all your physical assets.
                            </CardDescription>
                        </div>
                        <AddEquipmentDialog onSave={handleAddEquipment} />
                    </CardHeader>
                    <CardContent>
                        <EquipmentTable />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        <RepairOrderDialog isOpen={isRODialogOpen} onOpenChange={setRODialogOpen} onSave={handleSaveOrder} />
        <PMScheduleDialog isOpen={isPMDialogOpen} onOpenChange={setPMDialogOpen} scheduleToEdit={editingPM} onSave={handleSavePMSchedule} />

        <Dialog open={!!editingDocPM} onOpenChange={(open) => !open && setEditingDocPM(null)}>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Attach Document for {editingDocPM?.vehicleId}</DialogTitle>
                    <DialogDescription>Attach an inspection report or photo for the {editingDocPM?.serviceType.toLowerCase()} service.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <DocumentUpload onDocumentChange={handleSavePMDocument} currentDocument={editingDocPM?.documentUri || null} />
                </div>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
