
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Upload, MoreHorizontal, Check, AlertCircle, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

type TransactionStatus = 'Uncategorized' | 'Reviewed' | 'Posted';
type TransactionCategory = 'Revenue' | 'Expense' | 'Transfer' | 'Other';

type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  status: TransactionStatus;
  category?: TransactionCategory;
};

// Mock data that would be extracted from an uploaded statement
const generateMockTransactions = (): Transaction[] => [
  { id: 'TXN001', date: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'ACH Pymt - Globex Corp', amount: 1500.00, status: 'Uncategorized' },
  { id: 'TXN002', date: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Shell Oil #5421', amount: -125.50, status: 'Uncategorized' },
  { id: 'TXN003', date: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Online Transfer from Savings', amount: 5000.00, status: 'Reviewed', category: 'Transfer' },
  { id: 'TXN004', date: new Date(new Date().setDate(new Date().getDate() - 3)), description: 'ADP Payroll', amount: -12500.00, status: 'Posted', category: 'Expense' },
];

function UploadStatementDialog() {
    const [documentUri, setDocumentUri] = useState<string | null>(null);

    const handleUpload = () => {
        // In a real app, this would trigger parsing and AI extraction
    };
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><Upload className="mr-2"/> Upload Statement</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Bank Statement</DialogTitle>
                    <DialogDescription>Upload a PDF or CSV file of your bank statement to begin reconciliation.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => {}}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={!documentUri}>Process Statement</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function BankStatementsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setTransactions(generateMockTransactions());
    }, []);

    const handleCategoryChange = (id: string, category: TransactionCategory) => {
        setTransactions(prev => prev.map(t => t.id === id ? {...t, category, status: 'Reviewed'} : t));
    };
    
    const handlePost = (id: string) => {
        setTransactions(prev => prev.map(t => t.id === id ? {...t, status: 'Posted'} : t));
        toast({ title: "Transaction Posted", description: "The transaction has been posted to the general ledger." });
    };

    const stats = useMemo(() => {
        const total = transactions.length;
        const uncategorized = transactions.filter(t => t.status === 'Uncategorized').length;
        const posted = transactions.filter(t => t.status === 'Posted').length;
        return { total, uncategorized, posted };
    }, [transactions]);

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Bank Statements" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">From the latest statement</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uncategorized</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.uncategorized}</div>
                    <p className="text-xs text-muted-foreground">Transactions needing review</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Posted to Ledger</CardTitle>
                    <Check className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.posted}</div>
                    <p className="text-xs text-muted-foreground">Successfully reconciled</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        Bank Statement Reconciliation
                    </CardTitle>
                    <CardDescription>
                        Upload a statement to begin. Then, categorize each transaction and post it to your books.
                    </CardDescription>
                </div>
                 <UploadStatementDialog />
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{format(tx.date, 'P')}</TableCell>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={tx.category}
                                            onValueChange={(value: TransactionCategory) => handleCategoryChange(tx.id, value)}
                                            disabled={tx.status === 'Posted'}
                                        >
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Categorize..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Revenue">Revenue</SelectItem>
                                                <SelectItem value="Expense">Expense</SelectItem>
                                                <SelectItem value="Transfer">Transfer</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={tx.status === 'Posted' ? 'default' : tx.status === 'Reviewed' ? 'secondary' : 'outline'} className={tx.status === 'Posted' ? 'bg-green-600': ''}>
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                        {tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <Button 
                                            size="sm" 
                                            onClick={() => handlePost(tx.id)} 
                                            disabled={tx.status !== 'Reviewed'}
                                        >
                                            Post to Ledger
                                        </Button>
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
