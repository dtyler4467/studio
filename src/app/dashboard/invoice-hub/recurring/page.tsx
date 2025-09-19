
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Play, Pause, Repeat, DollarSign, Users, CalendarClock } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSchedule, Customer } from '@/hooks/use-schedule';
import { format, addMonths, addQuarters, addYears } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type Frequency = 'Monthly' | 'Quarterly' | 'Annually';
type RecurringStatus = 'Active' | 'Paused' | 'Ended';
type LineItem = { id: number, description: string, quantity: number, rate: number };

type RecurringInvoice = {
  id: string;
  customerId: string;
  startDate: Date;
  frequency: Frequency;
  status: RecurringStatus;
  lineItems: LineItem[];
};

const initialRecurringInvoices: RecurringInvoice[] = [
  { id: 'REC-001', customerId: 'CUST-001', startDate: new Date('2024-01-15'), frequency: 'Monthly', status: 'Active', lineItems: [{id: 1, description: "Monthly Maintenance Retainer", quantity: 1, rate: 500}] },
  { id: 'REC-002', customerId: 'CUST-002', startDate: new Date('2024-03-01'), frequency: 'Quarterly', status: 'Active', lineItems: [{id: 1, description: "Quarterly Licensing Fee", quantity: 1, rate: 1200}] },
  { id: 'REC-003', customerId: 'CUST-001', startDate: new Date('2023-10-01'), frequency: 'Annually', status: 'Paused', lineItems: [{id: 1, description: "Annual Support Contract", quantity: 1, rate: 2500}] },
];

const NextInvoiceDateCell = ({ startDate, frequency }: { startDate: Date, frequency: Frequency }) => {
    const [nextDate, setNextDate] = useState<Date | null>(null);

    useEffect(() => {
        const getNextInvoiceDate = (start: Date, freq: Frequency): Date => {
            const now = new Date();
            let next = new Date(start);
            
            const addInterval = (date: Date): Date => {
                switch(freq) {
                    case 'Monthly': return addMonths(date, 1);
                    case 'Quarterly': return addQuarters(date, 1);
                    case 'Annually': return addYears(date, 1);
                }
            }

            while (next < now) {
                next = addInterval(next);
            }
            return next;
        };
        setNextDate(getNextInvoiceDate(startDate, frequency));
    }, [startDate, frequency]);

    if (!nextDate) {
        return null; // Or a loading skeleton
    }

    return <>{format(nextDate, 'PPP')}</>;
}


function AddEditRecurringDialog({ onSave, isOpen, onOpenChange, customers, invoiceToEdit }: { onSave: (data: Omit<RecurringInvoice, 'id' | 'status'>) => void; isOpen: boolean; onOpenChange: (open: boolean) => void; customers: Customer[]; invoiceToEdit?: RecurringInvoice | null }) {
    const [formData, setFormData] = React.useState<Omit<RecurringInvoice, 'id' | 'status'>>({
        customerId: '',
        startDate: new Date(),
        frequency: 'Monthly',
        lineItems: [{id: 1, description: '', quantity: 1, rate: 0}],
    });
    
    React.useEffect(() => {
        if(invoiceToEdit) {
            setFormData({
                customerId: invoiceToEdit.customerId,
                startDate: invoiceToEdit.startDate,
                frequency: invoiceToEdit.frequency,
                lineItems: invoiceToEdit.lineItems,
            });
        } else {
             setFormData({ customerId: '', startDate: new Date(), frequency: 'Monthly', lineItems: [{id: 1, description: '', quantity: 1, rate: 0}] });
        }
    }, [invoiceToEdit, isOpen]);

    const handleSave = () => {
        onSave(formData);
    }

    const addLineItem = () => {
        setFormData(prev => ({...prev, lineItems: [...prev.lineItems, {id: Date.now(), description: '', quantity: 1, rate: 0}]}));
    }

    const removeLineItem = (id: number) => {
        setFormData(prev => ({...prev, lineItems: prev.lineItems.filter(item => item.id !== id)}));
    }
    
    const handleItemChange = (id: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        setFormData(prev => ({...prev, lineItems: prev.lineItems.map(item => item.id === id ? {...item, [field]: value} : item)}));
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{invoiceToEdit ? 'Edit' : 'Create'} Recurring Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Customer</Label>
                        <Select value={formData.customerId} onValueChange={(val) => setFormData({...formData, customerId: val})}>
                            <SelectTrigger><SelectValue placeholder="Select a customer..."/></SelectTrigger>
                            <SelectContent>
                                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.startDate} onSelect={(d) => d && setFormData({...formData, startDate: d})} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Frequency</Label>
                             <Select value={formData.frequency} onValueChange={(val: Frequency) => setFormData({...formData, frequency: val})}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="Annually">Annually</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Line Items</Label>
                        {formData.lineItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2">
                                <Input placeholder="Description" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                                <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-20" />
                                <Input type="number" placeholder="Rate" value={item.rate} onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-24" />
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeLineItem(item.id)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        ))}
                         <Button variant="outline" size="sm" onClick={addLineItem}><PlusCircle className="mr-2"/> Add Item</Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Profile</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function RecurringInvoicesPage() {
    const { customers } = useSchedule();
    const [recurringInvoices, setRecurringInvoices] = useState(initialRecurringInvoices);
    const { toast } = useToast();
    const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<RecurringInvoice | null>(null);

    const handleSave = (data: Omit<RecurringInvoice, 'id' | 'status'>) => {
        if (editingInvoice) {
            // Update logic
            setRecurringInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? { ...editingInvoice, ...data } : inv));
            toast({ title: "Profile Updated" });
        } else {
            // Add logic
            const newInvoice: RecurringInvoice = { ...data, id: `REC-${Date.now()}`, status: 'Active' };
            setRecurringInvoices(prev => [newInvoice, ...prev]);
            toast({ title: "Recurring Profile Created" });
        }
        setAddEditDialogOpen(false);
        setEditingInvoice(null);
    };

    const handleStatusChange = (id: string, status: RecurringStatus) => {
        setRecurringInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    };
    
    const handleDelete = (id: string) => {
        setRecurringInvoices(prev => prev.filter(inv => inv.id !== id));
        toast({ variant: 'destructive', title: "Profile Deleted" });
    }
    
    const activeSubscriptions = recurringInvoices.filter(inv => inv.status === 'Active').length;
    const monthlyRevenue = recurringInvoices.filter(inv => inv.status === 'Active').reduce((acc, inv) => {
        const amount = inv.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        if (inv.frequency === 'Monthly') return acc + amount;
        if (inv.frequency === 'Quarterly') return acc + (amount / 3);
        if (inv.frequency === 'Annually') return acc + (amount / 12);
        return acc;
    }, 0);

  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Recurring Invoices" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <p className="text-xs text-muted-foreground">Estimated monthly revenue from active profiles</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Total number of active recurring profiles</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">Recurring Invoice Profiles</CardTitle>
                <CardDescription>
                Manage automated and recurring billing cycles for your customers.
                </CardDescription>
            </div>
            <Button onClick={() => { setEditingInvoice(null); setAddEditDialogOpen(true); }}><PlusCircle className="mr-2"/> New Profile</Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Next Invoice Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recurringInvoices.map(invoice => {
                            const customer = customers.find(c => c.id === invoice.customerId);
                            const amount = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
                            return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{customer?.name || 'Unknown Customer'}</TableCell>
                                    <TableCell>${amount.toFixed(2)}</TableCell>
                                    <TableCell>{invoice.frequency}</TableCell>
                                    <TableCell>
                                        <NextInvoiceDateCell startDate={invoice.startDate} frequency={invoice.frequency} />
                                    </TableCell>
                                    <TableCell><Badge variant={invoice.status === 'Active' ? 'default' : 'secondary'}>{invoice.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => { setEditingInvoice(invoice); setAddEditDialogOpen(true); }}><Edit className="mr-2"/>Edit</DropdownMenuItem>
                                                {invoice.status === 'Active' ? (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Paused')}><Pause className="mr-2"/>Pause</DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Active')}><Play className="mr-2"/>Resume</DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(invoice.id)}><Trash2 className="mr-2"/>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    <AddEditRecurringDialog isOpen={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen} onSave={handleSave} customers={customers} invoiceToEdit={editingInvoice} />
    </>
  );
}
