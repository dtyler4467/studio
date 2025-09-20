
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Download, Upload, MoreHorizontal, TrendingDown, Eye, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from "xlsx";

type DepreciationMethod = 'Straight-Line' | 'Double Declining Balance';
type Asset = {
    id: string;
    name: string;
    category: string;
    cost: number;
    salvageValue: number;
    usefulLife: number; // in years
    purchaseDate: Date;
    method: DepreciationMethod;
};

const initialAssets: Asset[] = [
    { id: 'ASSET-001', name: 'Freightliner Cascadia Truck', category: 'Vehicle', cost: 150000, salvageValue: 25000, usefulLife: 5, purchaseDate: new Date('2023-01-15'), method: 'Straight-Line' },
    { id: 'ASSET-002', name: 'Office Desk Setup (x5)', category: 'Furniture', cost: 7500, salvageValue: 500, usefulLife: 7, purchaseDate: new Date('2022-06-01'), method: 'Straight-Line' },
    { id: 'ASSET-003', name: 'Warehouse Forklift', category: 'Equipment', cost: 25000, salvageValue: 5000, usefulLife: 10, purchaseDate: new Date('2021-03-20'), method: 'Double Declining Balance' },
];

const calculateDepreciation = (asset: Asset) => {
    const depreciableBase = asset.cost - asset.salvageValue;
    const age = new Date().getFullYear() - asset.purchaseDate.getFullYear();

    if (age >= asset.usefulLife) {
        return { annualDepreciation: 0, currentBookValue: asset.salvageValue, accumulatedDepreciation: depreciableBase };
    }
    
    let annualDepreciation = 0;
    let accumulatedDepreciation = 0;
    let currentBookValue = asset.cost;

    if (asset.method === 'Straight-Line') {
        annualDepreciation = depreciableBase / asset.usefulLife;
        accumulatedDepreciation = annualDepreciation * age;
        currentBookValue = asset.cost - accumulatedDepreciation;
    } else if (asset.method === 'Double Declining Balance') {
        const rate = (1 / asset.usefulLife) * 2;
        let bookValue = asset.cost;
        for (let i = 0; i < age; i++) {
            const dep = bookValue * rate;
            bookValue -= dep;
        }
        annualDepreciation = bookValue * rate;
        if (bookValue - annualDepreciation < asset.salvageValue) {
            annualDepreciation = bookValue - asset.salvageValue;
        }
        accumulatedDepreciation = asset.cost - bookValue;
        currentBookValue = bookValue;
    }

    return { annualDepreciation, currentBookValue, accumulatedDepreciation };
};


function AddEditAssetDialog({ asset, onSave, isOpen, onOpenChange }: { asset?: Asset | null; onSave: (data: Omit<Asset, 'id'>) => void; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
        name: '', category: 'Equipment', cost: 0, salvageValue: 0, usefulLife: 5, purchaseDate: new Date(), method: 'Straight-Line',
    });

    React.useEffect(() => {
        if (asset) setFormData(asset);
        else setFormData({ name: '', category: 'Equipment', cost: 0, salvageValue: 0, usefulLife: 5, purchaseDate: new Date(), method: 'Straight-Line' });
    }, [asset, isOpen]);

    const handleSave = () => {
        onSave(formData);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                </DialogHeader>
                 <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Asset Name</Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Vehicle, Equipment" />
                        </div>
                        <div className="space-y-2">
                            <Label>Purchase Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.purchaseDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{formData.purchaseDate ? format(formData.purchaseDate, "PPP") : <span>Pick a date</span>}</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.purchaseDate} onSelect={(d) => d && setFormData({...formData, purchaseDate: d})} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost</Label>
                            <Input id="cost" type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="salvage">Salvage Value</Label>
                            <Input id="salvage" type="number" value={formData.salvageValue} onChange={e => setFormData({...formData, salvageValue: Number(e.target.value)})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="life">Useful Life (Yrs)</Label>
                            <Input id="life" type="number" value={formData.usefulLife} onChange={e => setFormData({...formData, usefulLife: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Depreciation Method</Label>
                        <Select value={formData.method} onValueChange={(v: DepreciationMethod) => setFormData({...formData, method: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Straight-Line">Straight-Line</SelectItem>
                                <SelectItem value="Double Declining Balance">Double Declining Balance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Asset</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ViewScheduleDialog({ asset, isOpen, onOpenChange }: { asset: Asset | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const schedule = useMemo(() => {
        if (!asset) return [];
        const result = [];
        const depreciableBase = asset.cost - asset.salvageValue;
        
        if (asset.method === 'Straight-Line') {
            const annualDepreciation = depreciableBase / asset.usefulLife;
            for (let year = 1; year <= asset.usefulLife; year++) {
                const beginningValue = asset.cost - (annualDepreciation * (year - 1));
                const endingValue = beginningValue - annualDepreciation;
                result.push({ year, beginningValue, annualDepreciation, endingValue });
            }
        } else if (asset.method === 'Double Declining Balance') {
            const rate = (1 / asset.usefulLife) * 2;
            let bookValue = asset.cost;
            for (let year = 1; year <= asset.usefulLife; year++) {
                const beginningValue = bookValue;
                let annualDepreciation = bookValue * rate;
                if (bookValue - annualDepreciation < asset.salvageValue) {
                    annualDepreciation = bookValue - asset.salvageValue;
                }
                const endingValue = beginningValue - annualDepreciation;
                result.push({ year, beginningValue, annualDepreciation, endingValue });
                bookValue = endingValue;
                if (bookValue <= asset.salvageValue) break;
            }
        }

        return result;
    }, [asset]);

    if (!asset) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Depreciation Schedule for {asset.name}</DialogTitle>
                    <DialogDescription>Method: {asset.method}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead className="text-right">Beginning Value</TableHead>
                                <TableHead className="text-right">Depreciation</TableHead>
                                <TableHead className="text-right">Ending Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedule.map(row => (
                                <TableRow key={row.year}>
                                    <TableCell>{row.year}</TableCell>
                                    <TableCell className="text-right">${row.beginningValue.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-destructive">-${row.annualDepreciation.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-semibold">${row.endingValue.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function DepreciationPage() {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const { toast } = useToast();
    const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

    const handleSaveAsset = (data: Omit<Asset, 'id'>) => {
        if (editingAsset) {
            setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, ...data } : a));
            toast({ title: "Asset Updated" });
        } else {
            const newAsset: Asset = { ...data, id: `ASSET-${Date.now()}` };
            setAssets(prev => [newAsset, ...prev]);
            toast({ title: "Asset Added" });
        }
        setAddEditDialogOpen(false);
        setEditingAsset(null);
    };

    const handleDeleteAsset = (id: string) => {
        setAssets(assets.filter(a => a.id !== id));
        toast({ variant: 'destructive', title: 'Asset Deleted' });
    }
    
    const handleExport = () => {
        const dataToExport = assets.map(asset => ({
            'Asset Name': asset.name,
            'Category': asset.category,
            'Cost': asset.cost,
            'Salvage Value': asset.salvageValue,
            'Useful Life (Yrs)': asset.usefulLife,
            'Purchase Date': format(asset.purchaseDate, 'yyyy-MM-dd'),
            'Method': asset.method,
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DepreciationAssets");
        XLSX.writeFile(workbook, `Depreciation_Assets_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Depreciation" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                 <div>
                    <CardTitle className="font-headline">Depreciation Schedule</CardTitle>
                    <CardDescription>
                        Track and manage the depreciation of your company's tangible assets.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline"><Upload className="mr-2"/> Import</Button>
                    <Button variant="outline" onClick={handleExport}><Download className="mr-2"/> Export</Button>
                    <Button onClick={() => { setEditingAsset(null); setAddEditDialogOpen(true); }}><PlusCircle className="mr-2"/> Add Asset</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Annual Depreciation</TableHead>
                                <TableHead className="text-right">Current Book Value</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map(asset => {
                                const { annualDepreciation, currentBookValue } = calculateDepreciation(asset);
                                return (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                        <p className="font-medium">{asset.name}</p>
                                        <p className="text-xs text-muted-foreground">{asset.category}</p>
                                    </TableCell>
                                    <TableCell><Badge variant="outline">{asset.method}</Badge></TableCell>
                                    <TableCell className="text-right">${annualDepreciation.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-semibold">${currentBookValue.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="ghost" size="icon" onClick={() => setViewingAsset(asset)}><Eye className="h-4 w-4"/></Button>
                                         <Button variant="ghost" size="icon" onClick={() => { setEditingAsset(asset); setAddEditDialogOpen(true);}}><Edit className="h-4 w-4"/></Button>
                                         <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAsset(asset.id)}><Trash2 className="h-4 w-4"/></Button>
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
    <AddEditAssetDialog asset={editingAsset} onSave={handleSaveAsset} isOpen={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen} />
    <ViewScheduleDialog asset={viewingAsset} isOpen={!!viewingAsset} onOpenChange={() => setViewingAsset(null)} />
    </>
  );
}
