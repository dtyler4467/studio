
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Trash2, HandCoins, User, FileText, Download, Upload } from 'lucide-react';
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
import { useSchedule, Employee } from '@/hooks/use-schedule';
import React, { useState, useMemo } from 'react';

type DeductionType = {
  id: string;
  name: string;
  category: 'Tax' | 'Benefit' | 'Garnishment' | 'Other';
  editable: boolean;
};

type EmployeeDeduction = {
  id: string;
  employeeId: string;
  deductionTypeId: string;
  amount: number;
  amountType: 'fixed' | 'percentage';
};

const initialDeductionTypes: DeductionType[] = [
  { id: 'dt_fed_tax', name: 'Federal Tax', category: 'Tax', editable: false },
  { id: 'dt_state_tax', name: 'State Tax', category: 'Tax', editable: false },
  { id: 'dt_ss', name: 'Social Security', category: 'Tax', editable: false },
  { id: 'dt_medicare', name: 'Medicare', category: 'Tax', editable: false },
  { id: 'dt_health', name: 'Health Insurance', category: 'Benefit', editable: true },
  { id: 'dt_dental', name: 'Dental Insurance', category: 'Benefit', editable: true },
  { id: 'dt_401k', name: '401(k) Contribution', category: 'Benefit', editable: true },
  { id: 'dt_garnishment', name: 'Child Support Garnishment', category: 'Garnishment', editable: true },
];

const initialEmployeeDeductions: EmployeeDeduction[] = [
  { id: 'ed_1', employeeId: 'USR001', deductionTypeId: 'dt_health', amount: 75.00, amountType: 'fixed' },
  { id: 'ed_2', employeeId: 'USR001', deductionTypeId: 'dt_401k', amount: 5, amountType: 'percentage' },
  { id: 'ed_3', employeeId: 'USR002', deductionTypeId: 'dt_health', amount: 85.00, amountType: 'fixed' },
  { id: 'ed_4', employeeId: 'USR003', deductionTypeId: 'dt_garnishment', amount: 200.00, amountType: 'fixed' },
];

function AddDeductionTypeDialog({ onSave }: { onSave: (deduction: Omit<DeductionType, 'id' | 'editable'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<DeductionType['category']>('Other');
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !category) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        onSave({ name, category });
        setIsOpen(false);
        setName('');
        setCategory('Other');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2"/> New Deduction Type</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Custom Deduction Type</DialogTitle>
                    <DialogDescription>Define a new type of deduction that can be assigned to employees.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g., Vision Insurance" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Benefit">Benefit</SelectItem>
                                <SelectItem value="Garnishment">Garnishment</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Deduction Type</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ManageEmployeeDeductionDialog({ onSave, employee, deductionTypes, allEmployeeDeductions }: { onSave: (deduction: Omit<EmployeeDeduction, 'id'>) => void, employee: Employee | null, deductionTypes: DeductionType[], allEmployeeDeductions: EmployeeDeduction[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [deductionTypeId, setDeductionTypeId] = useState('');
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState<EmployeeDeduction['amountType']>('fixed');
    const { toast } = useToast();

    const employeeDeductions = useMemo(() => {
        return allEmployeeDeductions.filter(d => d.employeeId === employee?.id);
    }, [allEmployeeDeductions, employee]);
    
    const handleSave = () => {
        if (!deductionTypeId || !amount) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a deduction and enter an amount.' });
            return;
        }
        if (employee) {
            onSave({
                employeeId: employee.id,
                deductionTypeId,
                amount: parseFloat(amount),
                amountType,
            });
            setDeductionTypeId('');
            setAmount('');
            setAmountType('fixed');
        }
    };
    
    const availableDeductions = useMemo(() => {
        const assignedTypeIds = employeeDeductions.map(d => d.deductionTypeId);
        return deductionTypes.filter(dt => dt.editable && !assignedTypeIds.includes(dt.id));
    }, [deductionTypes, employeeDeductions]);


    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Deductions for {employee.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Current Deductions</h4>
                         {employeeDeductions.length > 0 ? (
                            <div className="space-y-2">
                            {employeeDeductions.map(d => {
                                const type = deductionTypes.find(dt => dt.id === d.deductionTypeId);
                                return (
                                    <div key={d.id} className="flex justify-between items-center p-2 border rounded-md">
                                        <span>{type?.name}</span>
                                        <span className="font-semibold">
                                            {d.amountType === 'fixed' ? `$${d.amount.toFixed(2)}` : `${d.amount}%`}
                                        </span>
                                    </div>
                                )
                            })}
                            </div>
                        ) : <p className="text-sm text-muted-foreground">No custom deductions assigned.</p>}
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm">Add New Deduction</h4>
                        <div className="space-y-2">
                            <Label>Deduction Type</Label>
                            <Select value={deductionTypeId} onValueChange={setDeductionTypeId}>
                                <SelectTrigger><SelectValue placeholder="Select a deduction..." /></SelectTrigger>
                                <SelectContent>
                                    {availableDeductions.length > 0 ? availableDeductions.map(dt => (
                                        <SelectItem key={dt.id} value={dt.id}>{dt.name}</SelectItem>
                                    )) : <SelectItem value="none" disabled>No more deductions to add</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             <div className="space-y-2 col-span-2">
                                <Label>Amount</Label>
                                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                             </div>
                             <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={amountType} onValueChange={(v:any) => setAmountType(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed ($)</SelectItem>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                        </div>
                         <Button onClick={handleSave}>Add Deduction</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function DeductionsPage() {
    const { employees } = useSchedule();
    const [deductionTypes, setDeductionTypes] = useState<DeductionType[]>(initialDeductionTypes);
    const [employeeDeductions, setEmployeeDeductions] = useState<EmployeeDeduction[]>(initialEmployeeDeductions);
    const { toast } = useToast();

    const handleAddDeductionType = (deduction: Omit<DeductionType, 'id' | 'editable'>) => {
        const newType: DeductionType = {
            ...deduction,
            id: `dt_custom_${Date.now()}`,
            editable: true,
        };
        setDeductionTypes(prev => [...prev, newType]);
        toast({ title: 'Deduction Type Added', description: `${newType.name} can now be assigned.`});
    };
    
    const handleAddEmployeeDeduction = (deduction: Omit<EmployeeDeduction, 'id'>) => {
        const newDeduction: EmployeeDeduction = {
            ...deduction,
            id: `ed_${Date.now()}`,
        };
        setEmployeeDeductions(prev => [...prev, newDeduction]);
        const type = deductionTypes.find(dt => dt.id === deduction.deductionTypeId);
        const employee = employees.find(e => e.id === deduction.employeeId);
        toast({ title: 'Deduction Assigned', description: `${type?.name} has been assigned to ${employee?.name}.`});
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Manage Deductions" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deductions (Pay Period)</CardTitle>
                    <HandCoins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,234.56</div>
                    <p className="text-xs text-muted-foreground">Total for current pay run</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Garnishments</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">Totaling $200.00 per period</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Benefit Contributions</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$5,678.90</div>
                    <p className="text-xs text-muted-foreground">Month-to-date employee contributions</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex-row justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Deduction Types</CardTitle>
                        <CardDescription>Manage the types of deductions available.</CardDescription>
                    </div>
                    <AddDeductionTypeDialog onSave={handleAddDeductionType} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {deductionTypes.map(type => (
                                <TableRow key={type.id}>
                                    <TableCell className="font-medium">{type.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{type.category}</Badge></TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild disabled={!type.editable}>
                                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Employee Deductions</CardTitle>
                    <CardDescription>Assign and manage deductions for each employee.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map(emp => {
                                const empDeductions = employeeDeductions.filter(d => d.employeeId === emp.id);
                                return (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.name}</TableCell>
                                    <TableCell>
                                        {empDeductions.length > 0 ? `${empDeductions.length} custom deduction(s)`: <span className="text-muted-foreground">None</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ManageEmployeeDeductionDialog employee={emp} onSave={handleAddEmployeeDeduction} deductionTypes={deductionTypes} allEmployeeDeductions={employeeDeductions} />
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

