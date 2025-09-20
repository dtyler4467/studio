"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileDown, MoreHorizontal, Landmark, HandCoins, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from "xlsx";

type LiabilityType = 'Current' | 'Long-Term';
type Liability = {
  id: string;
  name: string;
  type: LiabilityType;
  amount: number;
  dueDate: Date;
  status: 'Outstanding' | 'Paid';
};

const initialLiabilities: Liability[] = [
  { id: 'LIAB-001', name: 'Short-term Bank Loan', type: 'Current', amount: 15000, dueDate: new Date(new Date().setDate(new Date().getDate() + 80)), status: 'Outstanding' },
  { id: 'LIAB-002', name: 'Accounts Payable', type: 'Current', amount: 20000, dueDate: new Date(new Date().setDate(new Date().getDate() + 25)), status: 'Outstanding' },
  { id: 'LIAB-003', name: 'Long-term Debt (Mortgage)', type: 'Long-Term', amount: 100000, dueDate: new Date(new Date().getFullYear() + 5, 0, 1), status: 'Outstanding' },
  { id: 'LIAB-004', name: 'Accrued Payroll', type: 'Current', amount: 12000, dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), status: 'Paid' },
];

function AddLiabilityDialog({ onSave }: { onSave: (liability: Omit<Liability, 'id' | 'status'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<LiabilityType>('Current');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !amount || !dueDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        onSave({ name, type, amount: parseFloat(amount), dueDate });
        setIsOpen(false);
        setName(''); setType('Current'); setAmount(''); setDueDate(undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Liability</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record New Liability</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                         <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                         <Select value={type} onValueChange={(v: LiabilityType) => setType(v)}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Current">Current</SelectItem>
                                <SelectItem value="Long-Term">Long-Term</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Due Date</Label>
                         <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent></Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Liability</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function LiabilitiesPage() {
    const [liabilities, setLiabilities] = useState<Liability[]>(initialLiabilities);
    const { toast } = useToast();

    const stats = useMemo(() => {
        const total = liabilities.reduce((acc, l) => acc + l.amount, 0);
        const current = liabilities.filter(l => l.type === 'Current').reduce((acc, l) => acc + l.amount, 0);
        const longTerm = liabilities.filter(l => l.type === 'Long-Term').reduce((acc, l) => acc + l.amount, 0);
        return { total, current, longTerm };
    }, [liabilities]);

    const handleAddLiability = (liabilityData: Omit<Liability, 'id' | 'status'>) => {
        const newLiability: Liability = {
            ...liabilityData,
            id: `LIAB-${Date.now()}`,
            status: 'Outstanding',
        };
        setLiabilities(prev => [newLiability, ...prev]);
        toast({ title: 'Liability Created', description: `Liability "${newLiability.name}" has been added.` });
    };
    
    const handleExport = () => {
        const dataToExport = liabilities.map(lib => ({
            'ID': lib.id,
            'Name': lib.name,
            'Type': lib.type,
            'Amount': lib.amount,
            'Due Date': format(lib.dueDate, 'yyyy-MM-dd'),
            'Status': lib.status,
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Liabilities");
        XLSX.writeFile(workbook, `Liabilities_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Liabilities" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <p className="text-xs text-muted-foreground">Sum of all liabilities.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Liabilities</CardTitle>
                    <HandCoins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.current.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <p className="text-xs text-muted-foreground">Due within one year.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Long-Term Liabilities</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.longTerm.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <p className="text-xs text-muted-foreground">Due after one year.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex-row justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Liabilities Ledger</CardTitle>
                    <CardDescription>A list of all company obligations.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}><FileDown className="mr-2"/> Export</Button>
                    <AddLiabilityDialog onSave={handleAddLiability} />
                </div>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Liability Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {liabilities.map(liability => (
                                <TableRow key={liability.id}>
                                    <TableCell className="font-medium">{liability.name}</TableCell>
                                    <TableCell><Badge variant="outline">{liability.type}</Badge></TableCell>
                                    <TableCell>{format(liability.dueDate, 'PPP')}</TableCell>
                                    <TableCell>
                                        <Badge variant={liability.status === 'Paid' ? 'default' : 'secondary'} className={cn(liability.status === 'Paid' && 'bg-green-600')}>{liability.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">${liability.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Liability</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
