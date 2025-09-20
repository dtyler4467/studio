
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Download, PlusCircle, MoreHorizontal, Pencil, Trash2, Banknote, Percent, CalendarClock, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type Loan = {
    id: string;
    name: string;
    amount: number;
    rate: number;
    termYears: number;
    customColumns: string[];
};

type AmortizationEntry = {
    paymentNumber: number;
    paymentDate: string;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    customFields: Record<string, string>;
};

const initialLoans: Loan[] = [
    { id: 'loan1', name: 'Primary Mortgage', amount: 250000, rate: 5, termYears: 30, customColumns: ['Extra Payment'] },
    { id: 'loan2', name: 'Company Vehicle Loan', amount: 45000, rate: 7.2, termYears: 5, customColumns: ['Confirmation #'] },
];

const generateSchedule = (loan: Loan): AmortizationEntry[] => {
    const principal = loan.amount;
    const monthlyRate = loan.rate / 100 / 12;
    const numberOfPayments = loan.termYears * 12;
    
    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) return [];

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    let balance = principal;
    const schedule: AmortizationEntry[] = [];
    const startDate = new Date();

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPaid = balance * monthlyRate;
        const principalPaid = monthlyPayment - interestPaid;
        balance -= principalPaid;
        
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);

        schedule.push({
            paymentNumber: i,
            paymentDate: format(paymentDate, 'MMM yyyy'),
            payment: monthlyPayment,
            principal: principalPaid,
            interest: interestPaid,
            balance: balance > 0 ? balance : 0,
            customFields: loan.customColumns.reduce((acc, col) => ({...acc, [col]: ''}), {}),
        });
    }
    return schedule;
}

function AddEditLoanDialog({ isOpen, onOpenChange, onSave, loan }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (loan: Omit<Loan, 'id'>) => void, loan?: Loan | null }) {
    const [formData, setFormData] = useState<Omit<Loan, 'id'>>({ name: '', amount: 0, rate: 0, termYears: 0, customColumns: [] });
    const [newColumn, setNewColumn] = useState('');

    React.useEffect(() => {
        if (loan) setFormData(loan);
        else setFormData({ name: '', amount: 0, rate: 0, termYears: 0, customColumns: [] });
    }, [loan]);

    const handleAddColumn = () => {
        if (newColumn.trim() && !formData.customColumns.includes(newColumn.trim())) {
            setFormData(prev => ({...prev, customColumns: [...prev.customColumns, newColumn.trim()] }));
            setNewColumn('');
        }
    };
    
    const handleRemoveColumn = (colName: string) => {
        setFormData(prev => ({...prev, customColumns: prev.customColumns.filter(c => c !== colName)}));
    }

    const handleSave = () => {
        onSave(formData);
        onOpenChange(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{loan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="loanName">Loan/Asset Name</Label>
                        <Input id="loanName" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Office Building Mortgage" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="loanAmount">Amount ($)</Label>
                            <Input id="loanAmount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interestRate">Rate (%)</Label>
                            <Input id="interestRate" type="number" value={formData.rate} onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="loanTerm">Term (Years)</Label>
                            <Input id="loanTerm" type="number" value={formData.termYears} onChange={(e) => setFormData({...formData, termYears: Number(e.target.value)})} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Custom Columns</Label>
                        <div className="flex gap-2">
                            <Input value={newColumn} onChange={(e) => setNewColumn(e.target.value)} placeholder="e.g., Notes, Confirmation #" />
                            <Button variant="outline" onClick={handleAddColumn}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.customColumns.map(col => (
                                <div key={col} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                    {col}
                                    <button onClick={() => handleRemoveColumn(col)}><Trash2 className="h-3 w-3 text-destructive"/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Loan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AmortizationPage() {
    const { toast } = useToast();
    const [loans, setLoans] = useState(initialLoans);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [schedule, setSchedule] = useState<AmortizationEntry[]>([]);
    const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

    React.useEffect(() => {
        if (selectedLoan) {
            setSchedule(generateSchedule(selectedLoan));
        } else {
            setSchedule([]);
        }
    }, [selectedLoan]);
    
    const handleSaveLoan = (loanData: Omit<Loan, 'id'>) => {
        if (editingLoan) {
            setLoans(prev => prev.map(l => l.id === editingLoan.id ? { ...l, ...loanData } : l));
            toast({ title: 'Loan Updated' });
        } else {
            const newLoan: Loan = { ...loanData, id: `loan-${Date.now()}` };
            setLoans(prev => [newLoan, ...prev]);
            toast({ title: 'Loan Added' });
        }
        setEditingLoan(null);
    };
    
    const handleDeleteLoan = (loanId: string) => {
        setLoans(prev => prev.filter(l => l.id !== loanId));
        if (selectedLoan?.id === loanId) setSelectedLoan(null);
        toast({ variant: 'destructive', title: 'Loan Deleted'});
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Amortization" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2"><Calculator />Amortization Schedules</CardTitle>
                    <CardDescription>Manage and view amortization schedules for multiple loans or assets.</CardDescription>
                </div>
                <Button onClick={() => { setEditingLoan(null); setAddEditDialogOpen(true); }}><PlusCircle className="mr-2" />Add Loan</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="text-right">Term</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.map(loan => (
                                <TableRow key={loan.id} onClick={() => setSelectedLoan(loan)} className="cursor-pointer">
                                    <TableCell className="font-medium">{loan.name}</TableCell>
                                    <TableCell className="text-right">${loan.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{loan.rate.toFixed(2)}%</TableCell>
                                    <TableCell className="text-right">{loan.termYears} yrs</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent onClick={e => e.stopPropagation()}>
                                                <DropdownMenuItem onClick={() => { setEditingLoan(loan); setAddEditDialogOpen(true); }}><Pencil className="mr-2"/> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteLoan(loan.id)}><Trash2 className="mr-2"/> Delete</DropdownMenuItem>
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
        
        {selectedLoan && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Amortization Schedule: {selectedLoan.name}</CardTitle>
                    <CardDescription>Detailed payment breakdown for the selected loan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] rounded-md border">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Payment</TableHead>
                                    <TableHead className="text-right">Principal</TableHead>
                                    <TableHead className="text-right">Interest</TableHead>
                                    {selectedLoan.customColumns.map(col => <TableHead key={col}>{col}</TableHead>)}
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.map(row => (
                                    <TableRow key={row.paymentNumber}>
                                        <TableCell>{row.paymentNumber}</TableCell>
                                        <TableCell>{row.paymentDate}</TableCell>
                                        <TableCell className="text-right font-mono">${row.payment.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-mono text-green-600">${row.principal.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-mono text-destructive">${row.interest.toFixed(2)}</TableCell>
                                         {selectedLoan.customColumns.map(col => (
                                            <TableCell key={col}>
                                                <Input className="text-xs h-7" />
                                            </TableCell>
                                         ))}
                                        <TableCell className="text-right font-mono font-semibold">${row.balance.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
             </Card>
        )}
        
        <AddEditLoanDialog isOpen={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen} onSave={handleSaveLoan} loan={editingLoan} />
      </main>
    </div>
  );
}

