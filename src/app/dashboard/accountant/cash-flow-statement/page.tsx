"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Printer, Download, Landmark, HandCoins } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from "xlsx";
import { DateRange } from 'react-day-picker';

type LineItem = {
    id: number;
    name: string;
    amount: number;
};

type CashFlowData = {
    operating: LineItem[];
    investing: LineItem[];
    financing: LineItem[];
    beginningCash: number;
}

const Section = ({ title, items, onAddItem, onUpdateItem, onRemoveItem }: { title: string; items: LineItem[]; onAddItem: () => void; onUpdateItem: (id: number, name: string, amount: number) => void; onRemoveItem: (id: number) => void; }) => (
    <div className="space-y-2">
        <h4 className="font-semibold text-lg pb-1">{title}</h4>
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

const TotalRow = ({ label, amount, isNet = false }: { label: string; amount: number; isNet?: boolean }) => (
    <div className={cn(
        "flex justify-between items-center font-semibold pt-2",
        isNet ? "text-xl font-bold border-t-2 border-primary mt-4 pt-4 text-primary" : "border-t"
    )}>
        <span>{label}</span>
        <span className={cn(amount < 0 && 'text-destructive')}>
             {amount < 0 ? `-$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </span>
    </div>
);

const initialData: CashFlowData = {
    operating: [
        { id: 1, name: 'Net Income', amount: 150000 },
        { id: 2, name: 'Depreciation & Amortization', amount: 25000 },
        { id: 3, name: 'Increase in Accounts Receivable', amount: -20000 },
        { id: 4, name: 'Increase in Accounts Payable', amount: 15000 },
    ],
    investing: [
        { id: 1, name: 'Purchase of Equipment', amount: -50000 },
        { id: 2, name: 'Sale of Assets', amount: 10000 },
    ],
    financing: [
        { id: 1, name: 'Issuance of Debt', amount: 30000 },
        { id: 2, name: 'Repayment of Debt', amount: -10000 },
        { id: 3, name: 'Owner Contribution', amount: 5000 },
    ],
    beginningCash: 100000,
};

export default function CashFlowStatementPage() {
    const { toast } = useToast();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });
    const [companyName, setCompanyName] = useState('LogiFlow Inc.');
    const [data, setData] = useState<CashFlowData>(initialData);
    const printRef = useRef<HTMLDivElement>(null);

    const updateSectionFactory = (sectionKey: keyof Omit<CashFlowData, 'beginningCash'>) => ({
        add: () => setData(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], { id: Date.now(), name: '', amount: 0 }] })),
        update: (id: number, name: string, amount: number) => setData(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].map((item: LineItem) => item.id === id ? { ...item, name, amount } : item)
        })),
        remove: (id: number) => setData(prev => ({ ...prev, [sectionKey]: prev[sectionKey].filter((item: LineItem) => item.id !== id) })),
    });

    const handlers = {
        operating: updateSectionFactory('operating'),
        investing: updateSectionFactory('investing'),
        financing: updateSectionFactory('financing'),
    };
    
    const totals = useMemo(() => {
        const sum = (items: LineItem[]) => items.reduce((acc, item) => acc + item.amount, 0);
        
        const netOperating = sum(data.operating);
        const netInvesting = sum(data.investing);
        const netFinancing = sum(data.financing);
        
        const netChangeInCash = netOperating + netInvesting + netFinancing;
        const endingCash = data.beginningCash + netChangeInCash;

        return { netOperating, netInvesting, netFinancing, netChangeInCash, endingCash };
    }, [data]);
    
    const handleExport = () => {
        toast({ title: "Export Clicked", description: "Export functionality would be implemented here." });
    };

    const handlePrint = () => {
        if (!printRef.current) return;
        const content = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html><head><title>Print Cash Flow Statement</title>
             <style>
                body { font-family: sans-serif; } h1,h2,h3 { text-align: center; }
                .statement-print { max-w: 800px; margin: auto; }
                .section-print { margin-bottom: 1.5rem; }
                .line-item-print { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dotted #eee; }
                .total-row-print { display: flex; justify-content: space-between; font-weight: bold; padding-top: 0.5rem; border-top: 1px solid #333; margin-top: 0.5rem; }
                .final-total-print { font-size: 1.2rem; border-top: 2px solid #000; margin-top: 1rem; padding-top: 1rem; }
            </style>
            </head><body>${content}</body></html>`);
        printWindow?.document.close();
        printWindow?.print();
    }
    
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Cash Flow Statement" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <HandCoins />
                            Cash Flow Statement
                        </CardTitle>
                        <CardDescription>
                            A financial statement that provides data about the cash inflows and outflows of a company during a specific period.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                       <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? ( dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date range</span>)}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2}/>
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" onClick={handlePrint}><Printer className="mr-2"/>Print</Button>
                        <Button variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-lg p-4 mb-6">
                    <Input placeholder="Your Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} className="text-center text-2xl font-bold border-none shadow-none focus-visible:ring-0" />
                    <p className="text-center text-muted-foreground">
                        Cash Flow Statement for the period of {dateRange?.from ? format(dateRange.from, 'PPP') : '...'} to {dateRange?.to ? format(dateRange.to, 'PPP') : '...'}
                    </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Operating Activities */}
                    <div className="space-y-4">
                        <Section title="Cash Flow from Operating Activities" items={data.operating} onAddItem={handlers.operating.add} onUpdateItem={handlers.operating.update} onRemoveItem={handlers.operating.remove} />
                        <TotalRow label="Net Cash from Operating Activities" amount={totals.netOperating} />
                    </div>
                    <Separator />
                    {/* Investing Activities */}
                    <div className="space-y-4">
                        <Section title="Cash Flow from Investing Activities" items={data.investing} onAddItem={handlers.investing.add} onUpdateItem={handlers.investing.update} onRemoveItem={handlers.investing.remove} />
                        <TotalRow label="Net Cash from Investing Activities" amount={totals.netInvesting} />
                    </div>
                    <Separator />
                    {/* Financing Activities */}
                    <div className="space-y-4">
                        <Section title="Cash Flow from Financing Activities" items={data.financing} onAddItem={handlers.financing.add} onUpdateItem={handlers.financing.update} onRemoveItem={handlers.financing.remove} />
                        <TotalRow label="Net Cash from Financing Activities" amount={totals.netFinancing} />
                    </div>
                     <Separator className="my-6 border-dashed" />
                     {/* Summary Section */}
                     <div className="space-y-2">
                        <TotalRow label="Net Increase/Decrease in Cash" amount={totals.netChangeInCash} />
                        <div className="flex justify-between items-center pt-2">
                            <span>Beginning Cash Balance</span>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input 
                                    type="number" 
                                    className="w-40 pl-7" 
                                    value={data.beginningCash || ''} 
                                    onChange={e => setData(prev => ({...prev, beginningCash: parseFloat(e.target.value) || 0}))} />
                            </div>
                        </div>
                        <TotalRow label="Ending Cash Balance" amount={totals.endingCash} isNet />
                     </div>
                </div>
            </CardContent>
        </Card>
         <div className="hidden">
            <div ref={printRef} className="statement-print">
                 {/* Simplified structure for printing */}
                 <h1>{companyName}</h1>
                <h2>Cash Flow Statement</h2>
                 <h3>For the period of {dateRange?.from ? format(dateRange.from, 'PPP') : '...'} to {dateRange?.to ? format(dateRange.to, 'PPP') : '...'}</h3>
                
                <div className="section-print">
                    <h4>Operating Activities</h4>
                    {data.operating.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Net from Operating</span><span>${totals.netOperating.toLocaleString()}</span></div>
                </div>
                 <div className="section-print">
                    <h4>Investing Activities</h4>
                    {data.investing.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Net from Investing</span><span>${totals.netInvesting.toLocaleString()}</span></div>
                </div>
                 <div className="section-print">
                    <h4>Financing Activities</h4>
                    {data.financing.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Net from Financing</span><span>${totals.netFinancing.toLocaleString()}</span></div>
                </div>
                <div className="total-row-print" style={{marginTop: '2rem'}}><span>Net Change in Cash</span><span>${totals.netChangeInCash.toLocaleString()}</span></div>
                <div className="total-row-print"><span>Beginning Cash</span><span>${data.beginningCash.toLocaleString()}</span></div>
                <div className="total-row-print final-total-print"><span>Ending Cash Balance</span><span>${totals.endingCash.toLocaleString()}</span></div>
            </div>
        </div>
      </main>
    </div>
  );
}
