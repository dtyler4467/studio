
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Printer, Download, Scale } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from "xlsx";

type LineItem = {
    id: number;
    name: string;
    amount: number;
};

const Section = ({ title, items, onAddItem, onUpdateItem, onRemoveItem }: { title: string; items: LineItem[]; onAddItem: () => void; onUpdateItem: (id: number, name: string, amount: number) => void; onRemoveItem: (id: number) => void; }) => (
    <div className="space-y-2">
        <h4 className="font-semibold text-lg border-b pb-1">{title}</h4>
        {items.map(item => (
            <div key={item.id} className="flex items-center gap-2">
                <Input
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => onUpdateItem(item.id, e.target.value, item.amount)}
                    className="flex-1"
                />
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={item.amount || ''}
                        onChange={(e) => onUpdateItem(item.id, item.name, parseFloat(e.target.value) || 0)}
                        className="w-32 pl-7"
                    />
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        ))}
        <Button variant="outline" size="sm" onClick={onAddItem}>
            <PlusCircle className="mr-2" /> Add Line
        </Button>
    </div>
);

const TotalRow = ({ label, amount }: { label: string; amount: number; }) => (
    <div className="flex justify-between items-center font-semibold pt-2">
        <span>{label}</span>
        <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
);


export default function BalanceSheetPage() {
    const { toast } = useToast();
    const [balanceSheetDate, setBalanceSheetDate] = useState<Date>(new Date());
    
    // Assets
    const [currentAssets, setCurrentAssets] = useState<LineItem[]>([
        { id: 1, name: 'Cash', amount: 50000 },
        { id: 2, name: 'Accounts Receivable', amount: 25000 },
        { id: 3, name: 'Inventory', amount: 35000 },
    ]);
    const [nonCurrentAssets, setNonCurrentAssets] = useState<LineItem[]>([
        { id: 1, name: 'Vehicles', amount: 150000 },
        { id: 2, name: 'Equipment', amount: 75000 },
    ]);

    // Liabilities
    const [currentLiabilities, setCurrentLiabilities] = useState<LineItem[]>([
        { id: 1, name: 'Accounts Payable', amount: 20000 },
        { id: 2, name: 'Short-term Loans', amount: 15000 },
    ]);
    const [nonCurrentLiabilities, setNonCurrentLiabilities] = useState<LineItem[]>([
        { id: 1, name: 'Long-term Debt', amount: 100000 },
    ]);

    // Equity
    const [equity, setEquity] = useState<LineItem[]>([
        { id: 1, name: 'Owner\'s Capital', amount: 180000 },
        { id: 2, name: 'Retained Earnings', amount: 20000 },
    ]);

    const updateFactory = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) => ({
        add: () => setter(prev => [...prev, { id: Date.now(), name: '', amount: 0 }]),
        update: (id: number, name: string, amount: number) => setter(prev => prev.map(item => item.id === id ? { ...item, name, amount } : item)),
        remove: (id: number) => setter(prev => prev.filter(item => item.id !== id)),
    });

    const currentAssetsHandler = updateFactory(setCurrentAssets);
    const nonCurrentAssetsHandler = updateFactory(setNonCurrentAssets);
    const currentLiabilitiesHandler = updateFactory(setCurrentLiabilities);
    const nonCurrentLiabilitiesHandler = updateFactory(setNonCurrentLiabilities);
    const equityHandler = updateFactory(setEquity);

    const totals = useMemo(() => {
        const sum = (items: LineItem[]) => items.reduce((acc, item) => acc + item.amount, 0);
        
        const totalCurrentAssets = sum(currentAssets);
        const totalNonCurrentAssets = sum(nonCurrentAssets);
        const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

        const totalCurrentLiabilities = sum(currentLiabilities);
        const totalNonCurrentLiabilities = sum(nonCurrentLiabilities);
        const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
        
        const totalEquity = sum(equity);
        
        const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

        return {
            totalCurrentAssets, totalNonCurrentAssets, totalAssets,
            totalCurrentLiabilities, totalNonCurrentLiabilities, totalLiabilities,
            totalEquity, totalLiabilitiesAndEquity
        };
    }, [currentAssets, nonCurrentAssets, currentLiabilities, nonCurrentLiabilities, equity]);

    const handleExport = () => {
        const data = [
            ['Assets'],
            ['Current Assets'],
            ...currentAssets.map(item => [item.name, item.amount]),
            ['Total Current Assets', totals.totalCurrentAssets],
            [],
            ['Non-Current Assets'],
            ...nonCurrentAssets.map(item => [item.name, item.amount]),
            ['Total Non-Current Assets', totals.totalNonCurrentAssets],
            ['Total Assets', totals.totalAssets],
            [],
            ['Liabilities'],
             ['Current Liabilities'],
            ...currentLiabilities.map(item => [item.name, item.amount]),
            ['Total Current Liabilities', totals.totalCurrentLiabilities],
            [],
            ['Non-Current Liabilities'],
            ...nonCurrentLiabilities.map(item => [item.name, item.amount]),
            ['Total Non-Current Liabilities', totals.totalNonCurrentLiabilities],
            ['Total Liabilities', totals.totalLiabilities],
            [],
            ['Equity'],
            ...equity.map(item => [item.name, item.amount]),
            ['Total Equity', totals.totalEquity],
            [],
            ['Total Liabilities & Equity', totals.totalLiabilitiesAndEquity]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");
        XLSX.writeFile(workbook, `Balance_Sheet_${format(balanceSheetDate, 'yyyy-MM-dd')}.xlsx`);
    };

    return (
        <div className="flex flex-col w-full">
        <Header pageTitle="Balance Sheet" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                             <CardTitle className="font-headline flex items-center gap-2">
                                <Scale />
                                Balance Sheet
                            </CardTitle>
                            <CardDescription>
                                A financial statement that reports a company's assets, liabilities, and equity at a specific point in time.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {balanceSheetDate ? format(balanceSheetDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={balanceSheetDate} onSelect={(date) => date && setBalanceSheetDate(date)} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <Button variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Assets Column */}
                        <div className="space-y-6 p-4 border rounded-lg">
                             <h3 className="text-xl font-bold text-center">Assets</h3>
                             <Section title="Current Assets" items={currentAssets} onAddItem={currentAssetsHandler.add} onUpdateItem={currentAssetsHandler.update} onRemoveItem={currentAssetsHandler.remove} />
                             <TotalRow label="Total Current Assets" amount={totals.totalCurrentAssets} />
                             <Separator />
                             <Section title="Non-Current Assets" items={nonCurrentAssets} onAddItem={nonCurrentAssetsHandler.add} onUpdateItem={nonCurrentAssetsHandler.update} onRemoveItem={nonCurrentAssetsHandler.remove} />
                             <TotalRow label="Total Non-Current Assets" amount={totals.totalNonCurrentAssets} />
                             <Separator />
                             <TotalRow label="TOTAL ASSETS" amount={totals.totalAssets} />
                        </div>
                        {/* Liabilities & Equity Column */}
                        <div className="space-y-6 p-4 border rounded-lg">
                            <h3 className="text-xl font-bold text-center">Liabilities & Owner's Equity</h3>
                            <Section title="Current Liabilities" items={currentLiabilities} onAddItem={currentLiabilitiesHandler.add} onUpdateItem={currentLiabilitiesHandler.update} onRemoveItem={currentLiabilitiesHandler.remove} />
                             <TotalRow label="Total Current Liabilities" amount={totals.totalCurrentLiabilities} />
                            <Separator />
                             <Section title="Non-Current Liabilities" items={nonCurrentLiabilities} onAddItem={nonCurrentLiabilitiesHandler.add} onUpdateItem={nonCurrentLiabilitiesHandler.update} onRemoveItem={nonCurrentLiabilitiesHandler.remove} />
                             <TotalRow label="Total Non-Current Liabilities" amount={totals.totalNonCurrentLiabilities} />
                             <Separator />
                            <TotalRow label="TOTAL LIABILITIES" amount={totals.totalLiabilities} />
                            <Separator className="my-6 border-dashed" />
                            <Section title="Owner's Equity" items={equity} onAddItem={equityHandler.add} onUpdateItem={equityHandler.update} onRemoveItem={equityHandler.remove} />
                            <TotalRow label="TOTAL EQUITY" amount={totals.totalEquity} />
                             <Separator />
                             <TotalRow label="TOTAL LIABILITIES & EQUITY" amount={totals.totalLiabilitiesAndEquity} />
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="mt-6 border-t pt-6">
                    <Card className={cn(
                        "w-full text-center p-4",
                        totals.totalAssets === totals.totalLiabilitiesAndEquity ? 'bg-green-100 border-green-300' : 'bg-destructive/10 border-destructive'
                        )}>
                        <CardTitle className={cn(
                             totals.totalAssets === totals.totalLiabilitiesAndEquity ? 'text-green-800' : 'text-destructive'
                        )}>
                            {totals.totalAssets === totals.totalLiabilitiesAndEquity ? 'Balanced' : 'Not Balanced'}
                        </CardTitle>
                        <CardDescription>
                           Total Assets: ${totals.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | 
                           Total Liabilities & Equity: ${totals.totalLiabilitiesAndEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </CardDescription>
                    </Card>
                </CardFooter>
            </Card>
        </main>
        </div>
    );
}
