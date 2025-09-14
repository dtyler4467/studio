
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Trash2, Banknote, Landmark } from 'lucide-react';
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
import { useSchedule, Employee, DirectDepositAccount } from '@/hooks/use-schedule';
import React, { useState, useMemo } from 'react';

function ManageDepositDialog({ onSave, onDelete, employee }: { onSave: (employeeId: string, account: Omit<DirectDepositAccount, 'id'>) => void, onDelete: (employeeId: string, accountId: string) => void, employee: Employee | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [accountHolderName, setAccountHolderName] = useState(employee?.name || '');
    const [bankName, setBankName] = useState('');
    const [accountType, setAccountType] = useState<'Checking' | 'Savings'>('Checking');
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { toast } = useToast();

    React.useEffect(() => {
        setAccountHolderName(employee?.name || '');
    }, [employee]);

    const handleSave = () => {
        if (!accountHolderName || !bankName || !routingNumber || !accountNumber) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        if (employee) {
            onSave(employee.id, {
                accountHolderName,
                bankName,
                accountType,
                routingNumber,
                accountNumber,
            });
            // Reset form
            setBankName('');
            setRoutingNumber('');
            setAccountNumber('');
            toast({ title: 'Account Added', description: 'The new bank account has been added.' });
        }
    };

    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage Accounts</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Direct Deposit for {employee.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Current Accounts</h4>
                        {employee.directDeposit && employee.directDeposit.length > 0 ? (
                            <div className="space-y-2">
                                {employee.directDeposit.map(acc => (
                                    <div key={acc.id} className="flex justify-between items-center p-3 border rounded-md">
                                        <div>
                                            <p className="font-semibold">{acc.bankName} (...{acc.accountNumber.slice(-4)})</p>
                                            <p className="text-xs text-muted-foreground">{acc.accountType}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(employee.id, acc.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No direct deposit accounts on file.</p>
                        )}
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm">Add New Account</h4>
                         <div className="space-y-2">
                            <Label>Account Holder Name</Label>
                            <Input value={accountHolderName} onChange={e => setAccountHolderName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Bank Name</Label>
                            <Input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g., Bank of America"/>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2 col-span-1">
                                <Label>Account Type</Label>
                                <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Checking">Checking</SelectItem>
                                        <SelectItem value="Savings">Savings</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2 col-span-2">
                                <Label>Routing Number</Label>
                                <Input value={routingNumber} onChange={e => setRoutingNumber(e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Account Number</Label>
                            <Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                        </div>
                        <Button onClick={handleSave} className="w-full">Add Account</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default function DepositPage() {
    const { employees, addOrUpdateDirectDeposit, deleteDirectDeposit } = useSchedule();
    const { toast } = useToast();

    const handleSaveAccount = (employeeId: string, account: Omit<DirectDepositAccount, 'id'>) => {
        addOrUpdateDirectDeposit(employeeId, account);
    };
    
    const handleDeleteAccount = (employeeId: string, accountId: string) => {
        deleteDirectDeposit(employeeId, accountId);
        toast({ variant: 'destructive', title: 'Account Removed', description: 'The bank account has been deleted.' });
    };

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Direct Deposit Management" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Landmark />
                            Employee Direct Deposit
                        </CardTitle>
                        <CardDescription>
                            Manage banking information for employee payroll. All information is encrypted and secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Accounts on File</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map(emp => (
                                    <TableRow key={emp.id}>
                                        <TableCell className="font-medium">{emp.name}</TableCell>
                                        <TableCell>
                                            {emp.directDeposit && emp.directDeposit.length > 0 ? (
                                                <Badge>Enabled</Badge>
                                            ) : (
                                                <Badge variant="secondary">Not Set Up</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{emp.directDeposit?.length || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <ManageDepositDialog 
                                                employee={emp} 
                                                onSave={handleSaveAccount}
                                                onDelete={handleDeleteAccount}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

