
"use client";

import React, { useState, useMemo, useRef } from 'react';
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

type BalanceSheetSection = {
    title: string;
    items: LineItem[];
};

type BalanceSheetData = {
    assets: {
        current: BalanceSheetSection;
        nonCurrent: BalanceSheetSection;
    },
    liabilities: {
        current: BalanceSheetSection;
        nonCurrent: BalanceSheetSection;
    },
    equity: BalanceSheetSection;
}

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

const initialData: BalanceSheetData = {
    assets: {
        current: {
            title: 'Current Assets',
            items: [
                { id: 1, name: 'Cash', amount: 50000 },
                { id: 2, name: 'Accounts Receivable', amount: 25000 },
                { id: 3, name: 'Inventory', amount: 35000 },
            ],
        },
        nonCurrent: {
            title: 'Non-Current Assets',
            items: [
                { id: 1, name: 'Vehicles', amount: 150000 },
                { id: 2, name: 'Equipment', amount: 75000 },
            ],
        },
    },
    liabilities: {
        current: {
            title: 'Current Liabilities',
            items: [
                { id: 1, name: 'Accounts Payable', amount: 20000 },
                { id: 2, name: 'Short-term Loans', amount: 15000 },
            ],
        },
        nonCurrent: {
             title: 'Non-Current Liabilities',
            items: [{ id: 1, name: 'Long-term Debt', amount: 100000 }],
        },
    },
    equity: {
        title: "Owner's Equity",
        items: [
            { id: 1, name: 'Owner\'s Capital', amount: 180000 },
            { id: 2, name: 'Retained Earnings', amount: 20000 },
        ],
    }
};

export default function BalanceSheetPage() {
    const { toast } = useToast();
    const [balanceSheetDate, setBalanceSheetDate] = useState<Date>(new Date());
    const [companyName, setCompanyName] = useState('LogiFlow Inc.');
    const [companySlogan, setCompanySlogan] = useState('Streamlining Your Success');
    const [data, setData] = useState<BalanceSheetData>(initialData);
    const printRef = useRef<HTMLDivElement>(null);

    const updateSectionFactory = (sectionPath: string) => {
        const pathParts = sectionPath.split('.');
        return {
            add: () => setData(prev => {
                const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
                let target = newData;
                pathParts.forEach(part => target = target[part]);
                target.items.push({ id: Date.now(), name: '', amount: 0 });
                return newData;
            }),
            update: (id: number, name: string, amount: number) => setData(prev => {
                const newData = JSON.parse(JSON.stringify(prev));
                let target = newData;
                pathParts.forEach(part => target = target[part]);
                target.items = target.items.map((item: LineItem) => item.id === id ? { ...item, name, amount } : item);
                return newData;
            }),
            remove: (id: number) => setData(prev => {
                const newData = JSON.parse(JSON.stringify(prev));
                let target = newData;
                pathParts.forEach(part => target = target[part]);
                target.items = target.items.filter((item: LineItem) => item.id !== id);
                return newData;
            }),
        };
    };

    const handlers = {
        assets: {
            current: updateSectionFactory('assets.current'),
            nonCurrent: updateSectionFactory('assets.nonCurrent'),
        },
        liabilities: {
            current: updateSectionFactory('liabilities.current'),
            nonCurrent: updateSectionFactory('liabilities.nonCurrent'),
        },
        equity: updateSectionFactory('equity'),
    };

    const totals = useMemo(() => {
        const sum = (items: LineItem[]) => items.reduce((acc, item) => acc + item.amount, 0);
        
        const totalCurrentAssets = sum(data.assets.current.items);
        const totalNonCurrentAssets = sum(data.assets.nonCurrent.items);
        const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

        const totalCurrentLiabilities = sum(data.liabilities.current.items);
        const totalNonCurrentLiabilities = sum(data.liabilities.nonCurrent.items);
        const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
        
        const totalEquity = sum(data.equity.items);
        
        const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

        return {
            totalCurrentAssets, totalNonCurrentAssets, totalAssets,
            totalCurrentLiabilities, totalNonCurrentLiabilities, totalLiabilities,
            totalEquity, totalLiabilitiesAndEquity
        };
    }, [data]);

    const handleExport = () => {
        const exportData = [
            ['Assets'],
            [data.assets.current.title],
            ...data.assets.current.items.map(item => [item.name, item.amount]),
            ['Total Current Assets', totals.totalCurrentAssets],
            [],
            [data.assets.nonCurrent.title],
            ...data.assets.nonCurrent.items.map(item => [item.name, item.amount]),
            ['Total Non-Current Assets', totals.totalNonCurrentAssets],
            ['Total Assets', totals.totalAssets],
            [],
            ['Liabilities'],
            [data.liabilities.current.title],
            ...data.liabilities.current.items.map(item => [item.name, item.amount]),
            ['Total Current Liabilities', totals.totalCurrentLiabilities],
            [],
            [data.liabilities.nonCurrent.title],
            ...data.liabilities.nonCurrent.items.map(item => [item.name, item.amount]),
            ['Total Non-Current Liabilities', totals.totalNonCurrentLiabilities],
            ['Total Liabilities', totals.totalLiabilities],
            [],
            [data.equity.title],
            ...data.equity.items.map(item => [item.name, item.amount]),
            ['Total Equity', totals.totalEquity],
            [],
            ['Total Liabilities & Equity', totals.totalLiabilitiesAndEquity]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");
        XLSX.writeFile(workbook, `Balance_Sheet_${format(balanceSheetDate, 'yyyy-MM-dd')}.xlsx`);
    };

    const handlePrint = () => {
        if (!printRef.current) return;
        const content = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
        <html>
            <head>
                <title>Print Balance Sheet</title>
                <style>
                    body { font-family: sans-serif; }
                    .balance-sheet-print { max-width: 800px; margin: auto; }
                    h1 { text-align: center; margin-bottom: 0.5rem; }
                    .slogan-print { text-align: center; margin-top: 0; margin-bottom: 1rem; color: #555; }
                    h2 { text-align: center; }
                    .grid-print { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                    h3 { font-size: 1.2rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                    .section-print div { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dotted #eee; }
                    .total-row-print { display: flex; justify-content: space-between; font-weight: bold; padding-top: 0.5rem; border-top: 1px solid #333; margin-top: 0.5rem; }
                    .summary-print { border-top: 2px solid #000; margin-top: 2rem; padding-top: 1rem; }
                </style>
            </head>
            <body>${content}</body>
        </html>`);
        printWindow?.document.close();
        printWindow?.print();
    }


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
                            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2"/>Print Preview</Button>
                            <Button variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-lg mb-2">Company Details</h3>
                         <div className="grid md:grid-cols-2 gap-4">
                            <Input placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                            <Input placeholder="Company Slogan / Tagline (Optional)" value={companySlogan} onChange={e => setCompanySlogan(e.target.value)} />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">{companyName}</h2>
                        {companySlogan && <p className="text-muted-foreground">{companySlogan}</p>}
                        <p className="text-sm text-muted-foreground">Balance Sheet as of {format(balanceSheetDate, 'PPP')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Assets Column */}
                        <div className="space-y-6 p-4 border rounded-lg">
                             <h3 className="text-xl font-bold text-center">Assets</h3>
                             <Section title={data.assets.current.title} items={data.assets.current.items} onAddItem={handlers.assets.current.add} onUpdateItem={handlers.assets.current.update} onRemoveItem={handlers.assets.current.remove} />
                             <TotalRow label="Total Current Assets" amount={totals.totalCurrentAssets} />
                             <Separator />
                             <Section title={data.assets.nonCurrent.title} items={data.assets.nonCurrent.items} onAddItem={handlers.assets.nonCurrent.add} onUpdateItem={handlers.assets.nonCurrent.update} onRemoveItem={handlers.assets.nonCurrent.remove} />
                             <TotalRow label="Total Non-Current Assets" amount={totals.totalNonCurrentAssets} />
                             <Separator />
                             <TotalRow label="TOTAL ASSETS" amount={totals.totalAssets} />
                        </div>
                        {/* Liabilities & Equity Column */}
                        <div className="space-y-6 p-4 border rounded-lg">
                            <h3 className="text-xl font-bold text-center">Liabilities & Owner's Equity</h3>
                            <Section title={data.liabilities.current.title} items={data.liabilities.current.items} onAddItem={handlers.liabilities.current.add} onUpdateItem={handlers.liabilities.current.update} onRemoveItem={handlers.liabilities.current.remove} />
                             <TotalRow label="Total Current Liabilities" amount={totals.totalCurrentLiabilities} />
                            <Separator />
                             <Section title={data.liabilities.nonCurrent.title} items={data.liabilities.nonCurrent.items} onAddItem={handlers.liabilities.nonCurrent.add} onUpdateItem={handlers.liabilities.nonCurrent.update} onRemoveItem={handlers.liabilities.nonCurrent.remove} />
                             <TotalRow label="Total Non-Current Liabilities" amount={totals.totalNonCurrentLiabilities} />
                             <Separator />
                            <TotalRow label="TOTAL LIABILITIES" amount={totals.totalLiabilities} />
                            <Separator className="my-6 border-dashed" />
                            <Section title={data.equity.title} items={data.equity.items} onAddItem={handlers.equity.add} onUpdateItem={handlers.equity.update} onRemoveItem={handlers.equity.remove} />
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
        {/* Hidden div for printing */}
        <div className="hidden">
            <div ref={printRef} className="balance-sheet-print">
                <h1>{companyName}</h1>
                {companySlogan && <p className="slogan-print">{companySlogan}</p>}
                <h2>Balance Sheet as of {format(balanceSheetDate, 'PPP')}</h2>
                <div className="grid-print">
                    <div>
                        <h3>Assets</h3>
                        <div className="section-print">
                            <h4>{data.assets.current.title}</h4>
                            {data.assets.current.items.map(i => <div key={i.id}><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                            <div className="total-row-print"><span>Total Current Assets</span><span>${totals.totalCurrentAssets.toLocaleString()}</span></div>
                        </div>
                        <div className="section-print">
                            <h4>{data.assets.nonCurrent.title}</h4>
                            {data.assets.nonCurrent.items.map(i => <div key={i.id}><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                            <div className="total-row-print"><span>Total Non-Current Assets</span><span>${totals.totalNonCurrentAssets.toLocaleString()}</span></div>
                        </div>
                         <div className="total-row-print summary-print"><span>TOTAL ASSETS</span><span>${totals.totalAssets.toLocaleString()}</span></div>
                    </div>
                     <div>
                        <h3>Liabilities & Equity</h3>
                         <div className="section-print">
                            <h4>{data.liabilities.current.title}</h4>
                            {data.liabilities.current.items.map(i => <div key={i.id}><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                            <div className="total-row-print"><span>Total Current Liabilities</span><span>${totals.totalCurrentLiabilities.toLocaleString()}</span></div>
                        </div>
                         <div className="section-print">
                             <h4>{data.liabilities.nonCurrent.title}</h4>
                            {data.liabilities.nonCurrent.items.map(i => <div key={i.id}><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                            <div className="total-row-print"><span>Total Non-Current Liabilities</span><span>${totals.totalNonCurrentLiabilities.toLocaleString()}</span></div>
                        </div>
                        <div className="total-row-print"><span>TOTAL LIABILITIES</span><span>${totals.totalLiabilities.toLocaleString()}</span></div>
                        <div className="section-print" style={{marginTop: '2rem'}}>
                             <h4>{data.equity.title}</h4>
                             {data.equity.items.map(i => <div key={i.id}><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                            <div className="total-row-print"><span>TOTAL EQUITY</span><span>${totals.totalEquity.toLocaleString()}</span></div>
                        </div>
                         <div className="total-row-print summary-print"><span>TOTAL LIABILITIES & EQUITY</span><span>${totals.totalLiabilitiesAndEquity.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
