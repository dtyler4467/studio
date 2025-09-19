
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileDown, MoreHorizontal, TrendingUp, Clock, AlertTriangle, HandCoins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchedule } from '@/hooks/use-schedule';

type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';
type Invoice = {
  id: string;
  customerName: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  status: InvoiceStatus;
};

const initialInvoices: Invoice[] = [
  { id: 'INV-101', customerName: 'Globex Corp', invoiceDate: new Date(new Date().setDate(new Date().getDate() - 20)), dueDate: new Date(new Date().setDate(new Date().getDate() + 10)), amount: 1500, amountPaid: 0, status: 'Pending' },
  { id: 'INV-102', customerName: 'Stark Industries', invoiceDate: new Date(new Date().setDate(new Date().getDate() - 45)), dueDate: new Date(new Date().setDate(new Date().getDate() - 15)), amount: 3200, amountPaid: 3200, status: 'Paid' },
  { id: 'INV-103', customerName: 'Acme Inc.', invoiceDate: new Date(new Date().setDate(new Date().getDate() - 35)), dueDate: new Date(new Date().setDate(new Date().getDate() - 5)), amount: 800, amountPaid: 0, status: 'Overdue' },
];

function AddInvoiceDialog({ onSave }: { onSave: (invoice: Omit<Invoice, 'id' | 'status' | 'amountPaid'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { customers } = useSchedule();
    const [customerName, setCustomerName] = useState('');
    const [amount, setAmount] = useState('');
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const { toast } = useToast();

    const handleSave = () => {
        if (!customerName || !amount || !invoiceDate || !dueDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        onSave({ customerName, amount: parseFloat(amount), invoiceDate, dueDate });
        setIsOpen(false);
        setCustomerName(''); setAmount(''); setInvoiceDate(new Date()); setDueDate(undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Invoice</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer" className="text-right">Customer</Label>
                         <Input id="customer" value={customerName} onChange={e => setCustomerName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Invoice Date</Label>
                         <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !invoiceDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{invoiceDate ? format(invoiceDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus /></PopoverContent></Popover>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Due Date</Label>
                         <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent></Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Invoice</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function LogPaymentDialog({ invoice, onSave, isOpen, onOpenChange }: { invoice: Invoice | null, onSave: (id: string, amount: number) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const [paymentAmount, setPaymentAmount] = useState('');
    const { toast } = useToast();

    React.useEffect(() => {
        if (invoice) {
            setPaymentAmount((invoice.amount - invoice.amountPaid).toString());
        }
    }, [invoice]);

    const handleSave = () => {
        const amount = parseFloat(paymentAmount);
        if (!invoice || isNaN(amount) || amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount' });
            return;
        }
        onSave(invoice.id, amount);
        onOpenChange(false);
    }

    if (!invoice) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Payment for {invoice.id}</DialogTitle>
                    <DialogDescription>
                        Remaining Balance: ${(invoice.amount - invoice.amountPaid).toFixed(2)}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input id="payment-amount" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Log Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function AccountsReceivablePage() {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [logPaymentInvoice, setLogPaymentInvoice] = useState<Invoice | null>(null);
    const { toast } = useToast();

    const stats = useMemo(() => {
        const outstanding = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
        const totalOutstanding = outstanding.reduce((acc, inv) => acc + (inv.amount - inv.amountPaid), 0);
        const overdue = invoices.filter(inv => inv.status === 'Overdue');
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
        const totalCollectionDays = paidInvoices.reduce((acc, inv) => acc + differenceInDays(inv.dueDate, inv.invoiceDate), 0);
        const avgCollectionPeriod = paidInvoices.length > 0 ? totalCollectionDays / paidInvoices.length : 0;
        
        return {
            totalOutstanding,
            overdueCount: overdue.length,
            avgCollectionPeriod
        }
    }, [invoices]);

    const handleAddInvoice = (invoiceData: Omit<Invoice, 'id' | 'status' | 'amountPaid'>) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `INV-${Date.now()}`,
            status: 'Pending',
            amountPaid: 0,
        };
        setInvoices(prev => [newInvoice, ...prev]);
        toast({ title: 'Invoice Created', description: `Invoice ${newInvoice.id} for ${newInvoice.customerName} has been added.` });
    };

    const handleLogPayment = (id: string, amount: number) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === id) {
                const newAmountPaid = inv.amountPaid + amount;
                const newStatus = newAmountPaid >= inv.amount ? 'Paid' : inv.status;
                return { ...inv, amountPaid: newAmountPaid, status: newStatus };
            }
            return inv;
        }));
        toast({ title: 'Payment Logged' });
    };

  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Accounts Receivable" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalOutstanding.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <p className="text-xs text-muted-foreground">Total receivables pending collection.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Collection Period</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgCollectionPeriod.toFixed(1)} Days</div>
                    <p className="text-xs text-muted-foreground">Based on paid invoices.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.overdueCount}</div>
                    <p className="text-xs text-muted-foreground">Invoices past their due date.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex-row justify-between items-start">
                <div>
                    <CardTitle className="font-headline">A/R Aging Summary</CardTitle>
                    <CardDescription>A list of all outstanding and recently paid invoices.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline"><FileDown className="mr-2"/> Export</Button>
                    <AddInvoiceDialog onSave={handleAddInvoice} />
                </div>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map(invoice => {
                                const days = differenceInDays(new Date(), invoice.dueDate);
                                const balance = invoice.amount - invoice.amountPaid;
                                return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                                    <TableCell>{format(invoice.dueDate, 'PPP')}</TableCell>
                                    <TableCell>{days > 0 ? `${days} days` : 'Current'}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'} className={cn(invoice.status === 'Paid' && 'bg-green-600')}>{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">${balance.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setLogPaymentInvoice(invoice)} disabled={invoice.status === 'Paid'}>
                                                    <HandCoins className="mr-2"/> Log Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
     <LogPaymentDialog 
        invoice={logPaymentInvoice} 
        onSave={handleLogPayment}
        isOpen={!!logPaymentInvoice}
        onOpenChange={(open) => !open && setLogPaymentInvoice(null)}
    />
    </>
  );
}

