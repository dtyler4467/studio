
"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Printer, Download, TrendingUp } from 'lucide-react';
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

type IncomeStatementData = {
    revenue: LineItem[];
    cogs: LineItem[];
    expenses: LineItem[];
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

const TotalRow = ({ label, amount, isNetIncome = false }: { label: string; amount: number; isNetIncome?: boolean }) => (
    <div className={cn(
        "flex justify-between items-center font-semibold pt-2",
        isNetIncome ? "text-xl font-bold border-t-2 border-primary mt-4 pt-4 text-primary" : "border-t"
    )}>
        <span>{label}</span>
        <span className={cn(amount < 0 && 'text-destructive')}>
            {amount < 0 ? `-$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </span>
    </div>
);

const initialData: IncomeStatementData = {
    revenue: [
        { id: 1, name: 'Freight Revenue', amount: 350000 },
        { id: 2, name: 'Accessorial Charges', amount: 15000 },
    ],
    cogs: [
        { id: 1, name: 'Driver Pay', amount: 120000 },
        { id: 2, name: 'Fuel Costs', amount: 80000 },
    ],
    expenses: [
        { id: 1, name: 'Maintenance & Repairs', amount: 25000 },
        { id: 2, name: 'Insurance', amount: 18000 },
        { id: 3, name: 'Dispatch & Office Salaries', amount: 55000 },
        { id: 4, name: 'Marketing', amount: 10000 },
    ],
};


export default function IncomeStatementPage() {
    const { toast } = useToast();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });
    const [companyName, setCompanyName] = useState('LogiFlow Inc.');
    const [data, setData] = useState<IncomeStatementData>(initialData);
    const printRef = useRef<HTMLDivElement>(null);

    const updateSectionFactory = (sectionKey: keyof IncomeStatementData) => ({
        add: () => setData(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], { id: Date.now(), name: '', amount: 0 }] })),
        update: (id: number, name: string, amount: number) => setData(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].map((item: LineItem) => item.id === id ? { ...item, name, amount } : item)
        })),
        remove: (id: number) => setData(prev => ({ ...prev, [sectionKey]: prev[sectionKey].filter((item: LineItem) => item.id !== id) })),
    });

    const handlers = {
        revenue: updateSectionFactory('revenue'),
        cogs: updateSectionFactory('cogs'),
        expenses: updateSectionFactory('expenses'),
    };
    
    const totals = useMemo(() => {
        const sum = (items: LineItem[]) => items.reduce((acc, item) => acc + item.amount, 0);
        
        const totalRevenue = sum(data.revenue);
        const totalCogs = sum(data.cogs);
        const grossProfit = totalRevenue - totalCogs;
        const totalExpenses = sum(data.expenses);
        const netIncome = grossProfit - totalExpenses;

        return { totalRevenue, totalCogs, grossProfit, totalExpenses, netIncome };
    }, [data]);

    const handleExport = () => {
         const exportData = [
            ['Revenue'],
            ...data.revenue.map(item => [item.name, item.amount]),
            ['Total Revenue', totals.totalRevenue],
            [],
            ['Cost of Goods Sold'],
             ...data.cogs.map(item => [item.name, item.amount]),
            ['Total COGS', totals.totalCogs],
            ['Gross Profit', totals.grossProfit],
            [],
            ['Operating Expenses'],
            ...data.expenses.map(item => [item.name, item.amount]),
            ['Total Expenses', totals.totalExpenses],
            [],
            ['Net Income', totals.netIncome],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income Statement");
        XLSX.writeFile(workbook, `Income_Statement_${format(dateRange?.from || new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    const handlePrint = () => {
        if (!printRef.current) return;
        const content = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html><head><title>Print Income Statement</title>
             <style>
                body { font-family: sans-serif; } h1,h2,h3 { text-align: center; }
                .statement-print { max-width: 800px; margin: auto; }
                .section-print { margin-bottom: 1.5rem; }
                .line-item-print { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dotted #eee; }
                .total-row-print { display: flex; justify-content: space-between; font-weight: bold; padding-top: 0.5rem; border-top: 1px solid #333; margin-top: 0.5rem; }
                .net-income-print { font-size: 1.2rem; border-top: 2px solid #000; margin-top: 1rem; padding-top: 1rem; }
            </style>
            </head><body>${content}</body></html>`);
        printWindow?.document.close();
        printWindow?.print();
    }
    
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Income Statement" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <TrendingUp />
                            Income Statement
                        </CardTitle>
                        <CardDescription>
                            A financial statement that shows the company's revenues, expenses, and profits over a specific period.
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
                        Income Statement for the period of {dateRange?.from ? format(dateRange.from, 'PPP') : '...'} to {dateRange?.to ? format(dateRange.to, 'PPP') : '...'}
                    </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Revenue Section */}
                    <div>
                        <Section title="Revenue" items={data.revenue} onAddItem={handlers.revenue.add} onUpdateItem={handlers.revenue.update} onRemoveItem={handlers.revenue.remove} />
                        <TotalRow label="Total Revenue" amount={totals.totalRevenue} />
                    </div>
                    <Separator />
                    {/* COGS Section */}
                     <div>
                        <Section title="Cost of Goods Sold (COGS)" items={data.cogs} onAddItem={handlers.cogs.add} onUpdateItem={handlers.cogs.update} onRemoveItem={handlers.cogs.remove} />
                        <TotalRow label="Total COGS" amount={totals.totalCogs} />
                    </div>
                    <TotalRow label="Gross Profit" amount={totals.grossProfit} />
                     <Separator />
                    {/* Expenses Section */}
                     <div>
                        <Section title="Operating Expenses" items={data.expenses} onAddItem={handlers.expenses.add} onUpdateItem={handlers.expenses.update} onRemoveItem={handlers.expenses.remove} />
                        <TotalRow label="Total Operating Expenses" amount={totals.totalExpenses} />
                    </div>
                     {/* Net Income */}
                    <TotalRow label="Net Income" amount={totals.netIncome} isNetIncome />
                </div>
            </CardContent>
        </Card>
        {/* Hidden div for printing */}
         <div className="hidden">
            <div ref={printRef} className="statement-print">
                <h1>{companyName}</h1>
                <h2>Income Statement</h2>
                <h3>For the period of {dateRange?.from ? format(dateRange.from, 'PPP') : '...'} to {dateRange?.to ? format(dateRange.to, 'PPP') : '...'}</h3>
                
                <div className="section-print">
                    <h4>Revenue</h4>
                    {data.revenue.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Total Revenue</span><span>${totals.totalRevenue.toLocaleString()}</span></div>
                </div>

                <div className="section-print">
                    <h4>Cost of Goods Sold</h4>
                    {data.cogs.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Total COGS</span><span>${totals.totalCogs.toLocaleString()}</span></div>
                </div>

                <div className="total-row-print"><span>Gross Profit</span><span>${totals.grossProfit.toLocaleString()}</span></div>
                
                 <div className="section-print" style={{marginTop: '2rem'}}>
                    <h4>Operating Expenses</h4>
                    {data.expenses.map(i => <div key={i.id} className="line-item-print"><span>{i.name}</span><span>${i.amount.toLocaleString()}</span></div>)}
                    <div className="total-row-print"><span>Total Operating Expenses</span><span>${totals.totalExpenses.toLocaleString()}</span></div>
                </div>

                <div className="total-row-print net-income-print"><span>Net Income</span><span>${totals.netIncome.toLocaleString()}</span></div>
            </div>
        </div>
      </main>
    </div>
  );
}
