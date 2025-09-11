
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, DollarSign, List, CalendarDays, Edit, Trash2, Camera, FileUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type Receipt = {
    id: string;
    date: Date;
    vendor: string;
    amount: number;
    category: 'Fuel' | 'Food' | 'Maintenance' | 'Lodging' | 'Other';
    notes?: string;
    receiptUri: string | null;
    status: 'Pending' | 'Approved' | 'Denied';
};

const initialReceipts: Receipt[] = [
    { id: 'REC001', date: new Date(new Date().setDate(new Date().getDate() - 1)), vendor: 'Pilot', amount: 150.75, category: 'Fuel', receiptUri: 'https://picsum.photos/seed/receipt1/400/600', status: 'Approved' },
    { id: 'REC002', date: new Date(new Date().setDate(new Date().getDate() - 2)), vendor: "Denny's", amount: 25.50, category: 'Food', receiptUri: null, status: 'Pending' },
    { id: 'REC003', date: new Date(new Date().setDate(new Date().getDate() - 3)), vendor: 'City Auto Repair', amount: 450.00, category: 'Maintenance', receiptUri: 'https://picsum.photos/seed/receipt2/400/600', status: 'Pending' },
];

const categories: Receipt['category'][] = ['Fuel', 'Food', 'Maintenance', 'Lodging', 'Other'];

function ReceiptDialog({ onSave, receiptToEdit }: { onSave: (receipt: Omit<Receipt, 'id' | 'status'> | Receipt) => void, receiptToEdit?: Receipt | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formState, setFormState] = useState({
        vendor: '',
        amount: '',
        category: 'Fuel' as Receipt['category'],
        notes: '',
        receiptUri: null as string | null,
    });
    const { toast } = useToast();

    useEffect(() => {
        if (receiptToEdit) {
            setFormState({
                vendor: receiptToEdit.vendor,
                amount: receiptToEdit.amount.toString(),
                category: receiptToEdit.category,
                notes: receiptToEdit.notes || '',
                receiptUri: receiptToEdit.receiptUri,
            });
            setIsOpen(true);
        } else {
            // Reset form for new entry
            setFormState({ vendor: '', amount: '', category: 'Fuel', notes: '', receiptUri: null });
        }
    }, [receiptToEdit, isOpen]);

    const handleSave = () => {
        if (!formState.vendor || !formState.amount || !formState.category || !formState.receiptUri) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields and attach a receipt image.' });
            return;
        }

        const receiptData = {
            date: new Date(),
            vendor: formState.vendor,
            amount: parseFloat(formState.amount),
            category: formState.category,
            notes: formState.notes,
            receiptUri: formState.receiptUri,
        };
        
        onSave(receiptToEdit ? { ...receiptData, id: receiptToEdit.id, status: receiptToEdit.status } : receiptData);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> Log Receipt</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{receiptToEdit ? 'Edit Receipt' : 'Log New Receipt'}</DialogTitle>
                    <DialogDescription>
                        Enter the details for the expense and upload a photo of the receipt.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="vendor">Vendor/Store Name</Label>
                            <Input id="vendor" value={formState.vendor} onChange={(e) => setFormState(s => ({...s, vendor: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" value={formState.amount} onChange={(e) => setFormState(s => ({...s, amount: e.target.value}))} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formState.category} onValueChange={(value: Receipt['category']) => setFormState(s => ({...s, category: value}))}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input id="notes" value={formState.notes} onChange={(e) => setFormState(s => ({...s, notes: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Receipt Image</Label>
                        <DocumentUpload onDocumentChange={(uri) => setFormState(s => ({...s, receiptUri: uri}))} currentDocument={formState.receiptUri} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Receipt</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ViewReceiptDialog({ receipt, isOpen, onOpenChange }: { receipt: Receipt | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    if (!receipt) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Receipt from {receipt.vendor}</DialogTitle>
                    <DialogDescription>
                        Date: {format(receipt.date, 'PPP')} | Amount: ${receipt.amount.toFixed(2)} | Status: {receipt.status}
                    </DialogDescription>
                </DialogHeader>
                 <div className="p-4 border rounded-md bg-muted h-[70vh] flex items-center justify-center">
                    {receipt.receiptUri ? (
                        <Image src={receipt.receiptUri} alt={`Receipt for ${receipt.vendor}`} width={600} height={800} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <p>No image available for this receipt.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
    const [receiptToEdit, setReceiptToEdit] = useState<Receipt | null>(null);
    const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
    const [receiptToView, setReceiptToView] = useState<Receipt | null>(null);
    const { toast } = useToast();

    const handleSave = (receiptData: Omit<Receipt, 'id' | 'status'> | Receipt) => {
        if ('id' in receiptData) {
            // Editing existing receipt
            setReceipts(prev => prev.map(r => r.id === receiptData.id ? receiptData : r));
            toast({ title: 'Receipt Updated', description: `Receipt from ${receiptData.vendor} has been updated.` });
        } else {
            // Adding new receipt
            const newReceipt: Receipt = {
                ...receiptData,
                id: `REC${Date.now()}`,
                status: 'Pending',
            };
            setReceipts(prev => [newReceipt, ...prev]);
            toast({ title: 'Receipt Logged', description: `Receipt from ${newReceipt.vendor} has been submitted for approval.` });
        }
    };
    
    const handleDelete = () => {
        if (receiptToDelete) {
            setReceipts(prev => prev.filter(r => r.id !== receiptToDelete.id));
            toast({ variant: 'destructive', title: 'Receipt Deleted', description: `Receipt from ${receiptToDelete.vendor} has been deleted.` });
            setReceiptToDelete(null);
        }
    };

    const monthlyTotal = useMemo(() => {
        const currentMonth = new Date().getMonth();
        return receipts
            .filter(r => new Date(r.date).getMonth() === currentMonth)
            .reduce((acc, r) => acc + r.amount, 0);
    }, [receipts]);

    const pendingCount = receipts.filter(r => r.status === 'Pending').length;

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Receipt Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Spending (This Month)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">Total of all submitted receipts</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <p className="text-xs text-muted-foreground">Receipts awaiting review</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{receipts.length}</div>
                     <p className="text-xs text-muted-foreground">All-time submitted receipts</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Submission</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{receipts.length > 0 ? format(receipts[0].date, 'MMM d') : 'N/A'}</div>
                     <p className="text-xs text-muted-foreground">Date of the most recent receipt</p>
                </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Receipt History</CardTitle>
                    <CardDescription>
                        A log of all your submitted receipts for expense reporting.
                    </CardDescription>
                </div>
                <ReceiptDialog onSave={handleSave} receiptToEdit={receiptToEdit} />
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receipts.map((receipt) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>{format(receipt.date, 'PPP')}</TableCell>
                                    <TableCell className="font-medium">{receipt.vendor}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{receipt.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={receipt.status === 'Approved' ? 'default' : receipt.status === 'Denied' ? 'destructive' : 'secondary'} className={receipt.status === 'Approved' ? 'bg-green-600' : ''}>{receipt.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${receipt.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setReceiptToView(receipt)} disabled={!receipt.receiptUri}>View</Button>
                                        <Button variant="ghost" size="icon" onClick={() => setReceiptToEdit(receipt)}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setReceiptToDelete(receipt)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        {/* Dialogs */}
        <ViewReceiptDialog receipt={receiptToView} isOpen={!!receiptToView} onOpenChange={(open) => !open && setReceiptToView(null)} />
        <AlertDialog open={!!receiptToDelete} onOpenChange={(open) => !open && setReceiptToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the receipt from {receiptToDelete?.vendor}. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setReceiptToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  );
}
