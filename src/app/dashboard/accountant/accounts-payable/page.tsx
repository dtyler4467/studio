
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileDown, MoreHorizontal, TrendingDown, Clock, AlertTriangle, HandCoins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type BillStatus = 'Pending' | 'Paid' | 'Overdue';
type Bill = {
  id: string;
  vendorName: string;
  billDate: Date;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  status: BillStatus;
};

const initialBills: Bill[] = [
  { id: 'BILL-001', vendorName: 'Global Fasteners', billDate: new Date(new Date().setDate(new Date().getDate() - 15)), dueDate: new Date(new Date().setDate(new Date().getDate() + 15)), amount: 345.50, amountPaid: 0, status: 'Pending' },
  { id: 'BILL-002', vendorName: 'City Auto Repair', billDate: new Date(new Date().setDate(new Date().getDate() - 40)), dueDate: new Date(new Date().setDate(new Date().getDate() - 10)), amount: 850.00, amountPaid: 0, status: 'Overdue' },
  { id: 'BILL-003', vendorName: 'Office Supply Co.', billDate: new Date(new Date().setDate(new Date().getDate() - 60)), dueDate: new Date(new Date().setDate(new Date().getDate() - 30)), amount: 125.00, amountPaid: 125.00, status: 'Paid' },
];

function AddBillDialog({ onSave }: { onSave: (bill: Omit<Bill, 'id' | 'status' | 'amountPaid'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [vendorName, setVendorName] = useState('');
    const [amount, setAmount] = useState('');
    const [billDate, setBillDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const { toast } = useToast();

    const handleSave = () => {
        if (!vendorName || !amount || !billDate || !dueDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        onSave({ vendorName, amount: parseFloat(amount), billDate, dueDate });
        setIsOpen(false);
        setVendorName(''); setAmount(''); setBillDate(new Date()); setDueDate(undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Bill</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter New Bill</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vendor" className="text-right">Vendor</Label>
                         <Input id="vendor" value={vendorName} onChange={e => setVendorName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Bill Date</Label>
                         <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !billDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{billDate ? format(billDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus /></PopoverContent></Popover>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Due Date</Label>
                         <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent></Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Bill</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function RecordPaymentDialog({ bill, onSave, isOpen, onOpenChange }: { bill: Bill | null, onSave: (id: string, amount: number) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const [paymentAmount, setPaymentAmount] = useState('');
    const { toast } = useToast();

    React.useEffect(() => {
        if (bill) {
            setPaymentAmount((bill.amount - bill.amountPaid).toString());
        }
    }, [bill]);

    const handleSave = () => {
        const amount = parseFloat(paymentAmount);
        if (!bill || isNaN(amount) || amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount' });
            return;
        }
        onSave(bill.id, amount);
        onOpenChange(false);
    }

    if (!bill) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Payment for {bill.id}</DialogTitle>
                    <DialogDescription>
                        Remaining Balance: ${(bill.amount - bill.amountPaid).toFixed(2)}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input id="payment-amount" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Record Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function AccountsPayablePage() {
    const [bills, setBills] = useState<Bill[]>(initialBills);
    const [recordPaymentBill, setRecordPaymentBill] = useState<Bill | null>(null);
    const { toast } = useToast();

    const stats = useMemo(() => {
        const outstanding = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue');
        const totalOutstanding = outstanding.reduce((acc, b) => acc + (b.amount - b.amountPaid), 0);
        const overdue = bills.filter(b => b.status === 'Overdue');
        const paidBills = bills.filter(b => b.status === 'Paid');
        const totalPaymentDays = paidBills.reduce((acc, b) => acc + differenceInDays(b.dueDate, b.billDate), 0);
        const avgPaymentPeriod = paidBills.length > 0 ? totalPaymentDays / paidBills.length : 0;
        
        return {
            totalOutstanding,
            overdueCount: overdue.length,
            avgPaymentPeriod,
        }
    }, [bills]);

    const handleAddBill = (billData: Omit<Bill, 'id' | 'status' | 'amountPaid'>) => {
        const newBill: Bill = {
            ...billData,
            id: `BILL-${Date.now()}`,
            status: 'Pending',
            amountPaid: 0,
        };
        setBills(prev => [newBill, ...prev]);
        toast({ title: 'Bill Created', description: `Bill ${newBill.id} from ${newBill.vendorName} has been added.` });
    };

    const handleRecordPayment = (id: string, amount: number) => {
        setBills(prev => prev.map(b => {
            if (b.id === id) {
                const newAmountPaid = b.amountPaid + amount;
                const newStatus = newAmountPaid >= b.amount ? 'Paid' : b.status;
                return { ...b, amountPaid: newAmountPaid, status: newStatus };
            }
            return b;
        }));
        toast({ title: 'Payment Recorded' });
    };

  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Accounts Payable" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalOutstanding.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <p className="text-xs text-muted-foreground">Total amount owed to vendors.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Payment Period</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgPaymentPeriod.toFixed(1)} Days</div>
                    <p className="text-xs text-muted-foreground">Based on paid bills.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.overdueCount}</div>
                    <p className="text-xs text-muted-foreground">Bills that are past their due date.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex-row justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Accounts Payable Aging</CardTitle>
                    <CardDescription>A list of all outstanding and recently paid bills.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline"><FileDown className="mr-2"/> Export</Button>
                    <AddBillDialog onSave={handleAddBill} />
                </div>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.map(bill => {
                                const days = differenceInDays(new Date(), bill.dueDate);
                                const balance = bill.amount - bill.amountPaid;
                                return (
                                <TableRow key={bill.id}>
                                    <TableCell className="font-medium">{bill.vendorName}</TableCell>
                                    <TableCell>{format(bill.dueDate, 'PPP')}</TableCell>
                                    <TableCell>{days > 0 ? `${days} days` : 'Current'}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.status === 'Paid' ? 'default' : bill.status === 'Overdue' ? 'destructive' : 'secondary'} className={cn(bill.status === 'Paid' && 'bg-green-600')}>{bill.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">${balance.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setRecordPaymentBill(bill)} disabled={bill.status === 'Paid'}>
                                                    <HandCoins className="mr-2"/> Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>View Bill Details</DropdownMenuItem>
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
     <RecordPaymentDialog 
        bill={recordPaymentBill} 
        onSave={handleRecordPayment}
        isOpen={!!recordPaymentBill}
        onOpenChange={(open) => !open && setRecordPaymentBill(null)}
    />
    </>
  );
}
