"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Book, PlusCircle, Download, ListFilter, Trash2, Upload } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';

type Account = {
    id: string;
    name: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    balance: number;
};

type JournalLine = {
    accountId: string;
    type: 'debit' | 'credit';
    amount: number;
};

type JournalEntry = {
    id: string;
    date: Date;
    description: string;
    lines: JournalLine[];
};

const initialAccounts: Account[] = [
    { id: '101', name: 'Cash', type: 'Asset', balance: 50000 },
    { id: '120', name: 'Accounts Receivable', type: 'Asset', balance: 25000 },
    { id: '150', name: 'Vehicles', type: 'Asset', balance: 150000 },
    { id: '201', name: 'Accounts Payable', type: 'Liability', balance: 20000 },
    { id: '250', name: 'Long-term Debt', type: 'Liability', balance: 100000 },
    { id: '301', name: 'Owner\'s Capital', type: 'Equity', balance: 180000 },
    { id: '401', name: 'Freight Revenue', type: 'Revenue', balance: 350000 },
    { id: '501', name: 'Fuel Costs', type: 'Expense', balance: 80000 },
    { id: '505', name: 'Maintenance & Repairs', type: 'Expense', balance: 25000 },
];

const initialEntries: JournalEntry[] = [
    { id: 'JE001', date: new Date(new Date().setDate(new Date().getDate() - 5)), description: 'Customer payment received', lines: [{ accountId: '101', type: 'debit', amount: 5000 }, { accountId: '120', type: 'credit', amount: 5000 }] },
    { id: 'JE002', date: new Date(new Date().setDate(new Date().getDate() - 3)), description: 'Paid fuel expense', lines: [{ accountId: '501', type: 'debit', amount: 750 }, { accountId: '101', type: 'credit', amount: 750 }] },
    { id: 'JE003', date: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'Billed client for freight service', lines: [{ accountId: '120', type: 'debit', amount: 12000 }, { accountId: '401', type: 'credit', amount: 12000 }] },
];

function AddJournalEntryDialog({ onSave, accounts }: { onSave: (entry: Omit<JournalEntry, 'id'>) => void, accounts: Account[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [lines, setLines] = useState<Omit<JournalLine, 'id'>[]>([
        { accountId: '', type: 'debit', amount: 0 },
        { accountId: '', type: 'credit', amount: 0 }
    ]);
    const { toast } = useToast();

    const totalDebits = lines.filter(l => l.type === 'debit').reduce((acc, l) => acc + l.amount, 0);
    const totalCredits = lines.filter(l => l.type === 'credit').reduce((acc, l) => acc + l.amount, 0);
    const isBalanced = totalDebits === totalCredits && totalDebits > 0;

    const handleAddLine = () => setLines([...lines, { accountId: '', type: 'debit', amount: 0 }]);
    const handleRemoveLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

    const handleLineChange = (index: number, field: keyof JournalLine, value: string) => {
        const newLines = [...lines];
        if (field === 'amount') {
            (newLines[index] as any)[field] = parseFloat(value) || 0;
        } else {
            (newLines[index] as any)[field] = value;
        }
        setLines(newLines);
    };

    const handleSave = () => {
        if (!isBalanced) {
            toast({ variant: 'destructive', title: 'Unbalanced Entry', description: 'Debits must equal credits.' });
            return;
        }
        onSave({ date, description, lines: lines.filter(l => l.amount > 0) });
        setIsOpen(false);
        setDescription('');
        setLines([{ accountId: '', type: 'debit', amount: 0 }, { accountId: '', type: 'credit', amount: 0 }]);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2"/> New Journal Entry</Button></DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Journal Entry</DialogTitle>
                    <DialogDescription>Record a new transaction in the general ledger. Debits must equal credits.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                        <Input type="date" value={format(date, 'yyyy-MM-dd')} onChange={e => setDate(new Date(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        {lines.map((line, index) => (
                            <div key={index} className="grid grid-cols-[1fr_8rem_8rem_auto] gap-2 items-center">
                                <Select value={line.accountId} onValueChange={(val) => handleLineChange(index, 'accountId', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Account..." /></SelectTrigger>
                                    <SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.id})</SelectItem>)}</SelectContent>
                                </Select>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input type="number" placeholder="Debit" className="pl-7" disabled={line.type === 'credit'} value={line.type === 'debit' ? line.amount || '' : ''} onChange={e => handleLineChange(index, 'amount', e.target.value)} />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input type="number" placeholder="Credit" className="pl-7" disabled={line.type === 'debit'} value={line.type === 'credit' ? line.amount || '' : ''} onChange={e => handleLineChange(index, 'amount', e.target.value)} />
                                </div>
                                <div className="flex gap-1">
                                    <Select value={line.type} onValueChange={(val) => handleLineChange(index, 'type', val)}>
                                        <SelectTrigger className="w-24"><SelectValue/></SelectTrigger>
                                        <SelectContent><SelectItem value="debit">Debit</SelectItem><SelectItem value="credit">Credit</SelectItem></SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveLine(index)} disabled={lines.length <= 2}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" size="sm" onClick={handleAddLine}><PlusCircle className="mr-2"/> Add Line</Button>
                     <div className="flex justify-between items-center pt-4 border-t font-semibold">
                        <span>Totals</span>
                        <div className="flex gap-4">
                            <span>Debits: ${totalDebits.toFixed(2)}</span>
                            <span>Credits: ${totalCredits.toFixed(2)}</span>
                            <Badge variant={isBalanced ? 'default' : 'destructive'} className={isBalanced ? 'bg-green-600' : ''}>
                                {isBalanced ? 'Balanced' : 'Unbalanced'}
                            </Badge>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!isBalanced}>Post Entry</Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>
    )
}

export default function GeneralLedgerPage() {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialEntries);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [accountFilter, setAccountFilter] = useState<string>('all');
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const flattenedLedger = useMemo(() => {
        let runningBalances: Record<string, number> = {};
        accounts.forEach(acc => runningBalances[acc.id] = 0); // Start balances at 0 for ledger view

        return journalEntries
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .flatMap(entry =>
                entry.lines.map(line => {
                    const account = accounts.find(a => a.id === line.accountId)!;
                    let balanceChange = line.type === 'debit' ? line.amount : -line.amount;
                    if (account.type === 'Liability' || account.type === 'Equity' || account.type === 'Revenue') {
                        balanceChange = -balanceChange; // Inverse balance effect for these accounts
                    }
                    runningBalances[line.accountId] += balanceChange;
                    return {
                        ...entry,
                        line,
                        account,
                        balance: runningBalances[line.accountId],
                    };
                })
            )
            .filter(item => {
                const inDateRange = !dateRange?.from || (item.date >= dateRange.from && item.date <= (dateRange.to || new Date()));
                const inAccount = accountFilter === 'all' || item.account.id === accountFilter;
                return inDateRange && inAccount;
            });
    }, [journalEntries, accounts, dateRange, accountFilter]);

    const handleAddEntry = (entry: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = { ...entry, id: `JE${Date.now()}` };
        setJournalEntries(prev => [...prev, newEntry]);
        toast({ title: 'Entry Posted', description: 'The new journal entry has been added to the ledger.' });
    };
    
    const handleExport = () => {
         const dataToExport = flattenedLedger.map(item => ({
            'Date': format(item.date, 'yyyy-MM-dd'),
            'Account ID': item.account.id,
            'Account Name': item.account.name,
            'Description': item.description,
            'Debit': item.line.type === 'debit' ? item.line.amount : '',
            'Credit': item.line.type === 'credit' ? item.line.amount : '',
            'Balance': item.balance.toFixed(2),
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "General Ledger");
        XLSX.writeFile(workbook, `General_Ledger_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json<any>(worksheet);

                // Group by Description and Date to reconstruct entries
                const entryMap = new Map<string, Omit<JournalEntry, 'id'>>();

                json.forEach(row => {
                    const key = `${row.Date}-${row.Description}`;
                    if (!entryMap.has(key)) {
                        entryMap.set(key, {
                            date: new Date(row.Date),
                            description: row.Description,
                            lines: [],
                        });
                    }
                    const entry = entryMap.get(key)!;
                    if (row.Debit) {
                        entry.lines.push({ accountId: String(row['Account ID']), type: 'debit', amount: Number(row.Debit) });
                    }
                    if (row.Credit) {
                         entry.lines.push({ accountId: String(row['Account ID']), type: 'credit', amount: Number(row.Credit) });
                    }
                });
                
                const newEntries: JournalEntry[] = Array.from(entryMap.values()).map(e => ({ ...e, id: `JE-IMP-${Date.now()}` }));

                setJournalEntries(prev => [...prev, ...newEntries]);
                toast({ title: "Import Successful", description: `${newEntries.length} journal entries were imported.` });

            } catch (error) {
                console.error("Import error:", error);
                toast({ variant: 'destructive', title: "Import Failed", description: "Please check the file format." });
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="General Ledger" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Book />
                            General Ledger
                        </CardTitle>
                        <CardDescription>
                            The complete record of all financial transactions. Filter by date or account to view specific entries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b">
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                            <Select value={accountFilter} onValueChange={setAccountFilter}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Filter by account..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <div className="ml-auto flex gap-2">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImport} accept=".xlsx, .xls" />
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2" />Import</Button>
                                 <AddJournalEntryDialog onSave={handleAddEntry} accounts={accounts} />
                                <Button variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                            </div>
                        </div>
                        <div className="rounded-md border h-[60vh] overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow>
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead>Account</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Debit</TableHead>
                                        <TableHead className="text-right">Credit</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {flattenedLedger.length > 0 ? flattenedLedger.map(item => (
                                        <TableRow key={`${item.id}-${item.line.accountId}`}>
                                            <TableCell>{format(item.date, 'PPP')}</TableCell>
                                            <TableCell>{item.account.name} ({item.account.id})</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell className="text-right font-mono">{item.line.type === 'debit' ? `$${item.line.amount.toFixed(2)}` : ''}</TableCell>
                                            <TableCell className="text-right font-mono">{item.line.type === 'credit' ? `$${item.line.amount.toFixed(2)}` : ''}</TableCell>
                                            <TableCell className="text-right font-mono">{item.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                No transactions found for the selected filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
