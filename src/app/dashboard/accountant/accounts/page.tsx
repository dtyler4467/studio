
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Upload, Download, BookUser, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

type Account = {
  id: string;
  name: string;
  type: AccountType;
  description?: string;
};

const initialAccounts: Account[] = [
    { id: '1010', name: 'Cash', type: 'Asset' },
    { id: '1200', name: 'Accounts Receivable', type: 'Asset' },
    { id: '1500', name: 'Equipment', type: 'Asset' },
    { id: '2010', name: 'Accounts Payable', type: 'Liability' },
    { id: '2200', name: 'Loans Payable', type: 'Liability' },
    { id: '3010', name: 'Owner\'s Capital', type: 'Equity' },
    { id: '3900', name: 'Retained Earnings', type: 'Equity' },
    { id: '4010', name: 'Sales Revenue', type: 'Revenue' },
    { id: '4500', name: 'Service Revenue', type: 'Revenue' },
    { id: '5010', name: 'Cost of Goods Sold', type: 'Expense' },
    { id: '6200', name: 'Rent Expense', type: 'Expense' },
    { id: '6300', name: 'Utilities Expense', type: 'Expense' },
];

function AddAccountDialog({ onSave }: { onSave: (account: Omit<Account, 'id'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<AccountType>('Asset');
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const { toast } = useToast();

    const handleSave = () => {
        if (!id || !name || !type) {
            toast({ variant: 'destructive', title: 'Error', description: 'Account ID, Name, and Type are required.' });
            return;
        }
        onSave({ id, name, type, description });
        setIsOpen(false);
        // Reset form
        setId(''); setName(''); setType('Asset'); setDescription('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>Define a new account for your general ledger.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id" className="text-right">Account #</Label>
                        <Input id="id" value={id} onChange={(e) => setId(e.target.value)} className="col-span-3" placeholder="e.g., 1010" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Account Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Cash" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(v: AccountType) => setType(v)}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asset">Asset</SelectItem>
                                <SelectItem value="Liability">Liability</SelectItem>
                                <SelectItem value="Equity">Equity</SelectItem>
                                <SelectItem value="Revenue">Revenue</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Account</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const AccountTable = ({ accounts, title }: { accounts: Account[], title: string }) => (
    <AccordionItem value={title}>
        <AccordionTrigger>
            <h3 className="text-lg font-semibold">{title} ({accounts.length})</h3>
        </AccordionTrigger>
        <AccordionContent>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Account #</TableHead>
                            <TableHead>Account Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map(account => (
                            <TableRow key={account.id}>
                                <TableCell className="font-mono">{account.id}</TableCell>
                                <TableCell className="font-medium">{account.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AccordionContent>
    </AccordionItem>
)

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const { toast } = useToast();

  const handleAddAccount = (accountData: Omit<Account, 'id'> & { id: string }) => {
    if (accounts.some(acc => acc.id === accountData.id)) {
        toast({ variant: 'destructive', title: 'Error', description: 'An account with this ID already exists.'});
        return;
    }
    setAccounts(prev => [...prev, accountData].sort((a,b) => a.id.localeCompare(b.id)));
    toast({ title: 'Account Created', description: `Account "${accountData.name}" has been added.`});
  }

  const groupedAccounts = useMemo(() => {
    return accounts.reduce((acc, account) => {
        if (!acc[account.type]) {
            acc[account.type] = [];
        }
        acc[account.type].push(account);
        return acc;
    }, {} as Record<AccountType, Account[]>);
  }, [accounts]);
  
  const accountTypes: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Chart of Accounts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <BookUser />
                        Chart of Accounts
                    </CardTitle>
                    <CardDescription>
                        A complete list of every account in your general ledger.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline"><Upload className="mr-2"/> Import</Button>
                    <Button variant="outline"><Download className="mr-2"/> Export</Button>
                    <AddAccountDialog onSave={handleAddAccount} />
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={accountTypes} className="w-full">
                    {accountTypes.map(type => (
                        <AccountTable key={type} title={type} accounts={groupedAccounts[type] || []} />
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
