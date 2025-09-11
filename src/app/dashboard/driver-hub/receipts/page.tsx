
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
import { format, isSameDay } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { extractReceiptData, ReceiptData } from '@/ai/flows/extract-receipt-data';
import { Skeleton } from '@/components/ui/skeleton';


type Receipt = {
    id: string;
    date: Date;
    time?: string;
    vendor: string;
    amount: number;
    category: 'Fuel' | 'Food' | 'Maintenance' | 'Lodging' | 'Other';
    notes?: string;
    receiptUri: string | null;
    status: 'Pending' | 'Approved' | 'Denied';
    uploadDate: Date;
};

const initialReceipts: Receipt[] = [
    { id: 'REC001', date: new Date(new Date().setDate(new Date().getDate() - 1)), vendor: 'Pilot', amount: 150.75, category: 'Fuel', receiptUri: 'https://picsum.photos/seed/receipt1/400/600', status: 'Approved', uploadDate: new Date() },
    { id: 'REC002', date: new Date(new Date().setDate(new Date().getDate() - 2)), vendor: "Denny's", amount: 25.50, category: 'Food', receiptUri: null, status: 'Pending', uploadDate: new Date() },
    { id: 'REC003', date: new Date(new Date().setDate(new Date().getDate() - 3)), vendor: 'City Auto Repair', amount: 450.00, category: 'Maintenance', receiptUri: 'https://picsum.photos/seed/receipt2/400/600', status: 'Pending', uploadDate: new Date() },
];

const categories: Receipt['category'][] = ['Fuel', 'Food', 'Maintenance', 'Lodging', 'Other'];

function ConfirmationDialog({
    receiptData,
    onSave,
    isOpen,
    onOpenChange,
}: {
    receiptData: ReceiptData & { receiptUri: string | null };
    onSave: (receipt: Omit<Receipt, 'id' | 'status' | 'uploadDate'>) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [formState, setFormState] = useState(receiptData);
    const { toast } = useToast();

    useEffect(() => {
        setFormState(receiptData);
    }, [receiptData]);

    const handleSave = () => {
        if (!formState.vendor || !formState.amount || !formState.category || !formState.receiptUri) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields and ensure a receipt is attached.' });
            return;
        }

        const newReceipt = {
            date: new Date(formState.date || Date.now()),
            time: formState.time,
            vendor: formState.vendor,
            amount: parseFloat(formState.amount),
            category: formState.category as Receipt['category'],
            notes: formState.notes,
            receiptUri: formState.receiptUri,
        };

        onSave(newReceipt);
        onOpenChange(false);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Confirm Receipt Details</DialogTitle>
                    <DialogDescription>
                        AI has extracted the following data. Please review and confirm before saving.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-4 py-4">
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
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={formState.date ? format(new Date(formState.date), 'yyyy-MM-dd') : ''} onChange={(e) => setFormState(s => ({...s, date: e.target.value}))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time (Optional)</Label>
                                <Input id="time" type="time" value={formState.time ?? ""} onChange={(e) => setFormState(s => ({...s, time: e.target.value}))} />
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
                            <Input id="notes" value={formState.notes ?? ""} onChange={(e) => setFormState(s => ({...s, notes: e.target.value}))} />
                        </div>
                    </div>
                     <div className="p-4 border rounded-md bg-muted h-full flex items-center justify-center">
                        {formState.receiptUri ? (
                            <Image src={formState.receiptUri} alt={`Receipt for ${formState.vendor}`} width={600} height={800} className="max-h-full max-w-full object-contain" />
                        ) : (
                            <p>No image available for this receipt.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Receipt</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddReceiptDialog({ onScan }: { onScan: (uri: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleDocumentChange = (uri: string | null) => {
        if (uri) {
            setIsOpen(false);
            onScan(uri);
        }
    }

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> Log Receipt</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload or Capture Receipt</DialogTitle>
                    <DialogDescription>
                        Use your camera to take a photo of the receipt, or upload a file from your device.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                   <DocumentUpload onDocumentChange={handleDocumentChange} currentDocument={null} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
    const [receiptToView, setReceiptToView] = useState<Receipt | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState< (ReceiptData & { receiptUri: string | null }) | null>(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Initialize state on client to prevent hydration mismatch
        setReceipts(initialReceipts);
    }, []);

    const handleReceiptScan = async (receiptUri: string) => {
        toast({ title: "Enhancements Coming Soon!", description: "AI-powered image editing will be available in a future update." });
        setIsProcessing(true);
        try {
            const data = await extractReceiptData({ photoDataUri: receiptUri });
            setExtractedData({ ...data, receiptUri: receiptUri });
            setConfirmOpen(true);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Extraction Failed', description: 'Could not extract data from the receipt. Please enter it manually.' });
             // Fallback to manual entry
            setExtractedData({
                vendor: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                amount: '',
                category: 'Other',
                notes: 'AI extraction failed',
                receiptUri: receiptUri,
            });
            setConfirmOpen(true);
        } finally {
            setIsProcessing(false);
        }
    };


    const handleSave = (receiptData: Omit<Receipt, 'id' | 'status' | 'uploadDate'>) => {
        const isDuplicate = receipts.some(
            r => r.vendor === receiptData.vendor &&
                 isSameDay(r.date, receiptData.date) &&
                 r.amount === receiptData.amount
        );

        if (isDuplicate) {
            toast({
                variant: 'destructive',
                title: 'Duplicate Receipt Detected',
                description: 'A receipt with the same vendor, date, and amount already exists.',
            });
            return;
        }
        
        const newReceipt: Receipt = {
            ...receiptData,
            id: `REC${Date.now()}`,
            status: 'Pending',
            uploadDate: new Date(),
        };
        setReceipts(prev => [newReceipt, ...prev]);
        toast({ title: 'Receipt Logged', description: `Receipt from ${newReceipt.vendor} has been submitted for approval.` });
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
        const currentYear = new Date().getFullYear();
        return receipts
            .filter(r => {
                const receiptDate = new Date(r.date);
                return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
            })
            .reduce((acc, r) => acc + r.amount, 0);
    }, [receipts]);
    
    const lastSubmissionDate = useMemo(() => {
        if (receipts.length === 0) return 'N/A';
        const sortedReceipts = [...receipts].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        return format(new Date(sortedReceipts[0].uploadDate), 'MMM d, p');
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
                    <div className="text-2xl font-bold">{lastSubmissionDate}</div>
                     <p className="text-xs text-muted-foreground">Date of the most recent upload</p>
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
                <AddReceiptDialog onScan={handleReceiptScan} />
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
                                    <TableCell>
                                        <p className="font-medium">{format(receipt.date, 'PPP')}{receipt.time ? ` @ ${receipt.time}` : ''}</p>
                                        <p className="text-xs text-muted-foreground">Uploaded: {format(receipt.uploadDate, 'P p')}</p>
                                    </TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 {(isProcessing) && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <p className="font-semibold">AI is analyzing your receipt...</p>
                            <Skeleton className="h-4 w-48 mx-auto" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Dialogs */}
        {receiptToView && (
            <Dialog open={!!receiptToView} onOpenChange={() => setReceiptToView(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Receipt from {receiptToView.vendor}</DialogTitle>
                        <DialogDescription>
                            Date: {format(receiptToView.date, 'PPP')} | Amount: ${receiptToView.amount.toFixed(2)} | Status: {receiptToView.status}
                        </DialogDescription>
                    </DialogHeader>
                     <div className="p-4 border rounded-md bg-muted h-[70vh] flex items-center justify-center">
                        {receiptToView.receiptUri ? (
                            <Image src={receiptToView.receiptUri} alt={`Receipt for ${receiptToView.vendor}`} width={600} height={800} className="max-h-full max-w-full object-contain" />
                        ) : (
                            <p>No image available for this receipt.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        )}
        
        {extractedData && <ConfirmationDialog receiptData={extractedData} onSave={handleSave} isOpen={isConfirmOpen} onOpenChange={setConfirmOpen} />}
        
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

    
