
"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, PlusCircle, Trash2, Printer, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import * as XLSX from 'xlsx';
import { Label } from '@/components/ui/label';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import Image from 'next/image';

type EquityTransaction = {
    id: number;
    date: string;
    description: string;
    amount: number;
};

export default function EquityPage() {
    const { toast } = useToast();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });
    
    const [companyName, setCompanyName] = useState('LogiFlow Inc.');
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);

    const [beginningEquity, setBeginningEquity] = useState(180000);
    const [netIncome, setNetIncome] = useState(25000);
    const [contributions, setContributions] = useState<EquityTransaction[]>([
        { id: 1, date: '2024-07-10', description: 'Owner Investment', amount: 5000 }
    ]);
    const [draws, setDraws] = useState<EquityTransaction[]>([
         { id: 1, date: '2024-07-20', description: 'Personal Withdrawal', amount: 2000 }
    ]);

    const printRef = useRef<HTMLDivElement>(null);

    const totals = useMemo(() => {
        const totalContributions = contributions.reduce((acc, item) => acc + item.amount, 0);
        const totalDraws = draws.reduce((acc, item) => acc + item.amount, 0);
        const endingEquity = beginningEquity + netIncome + totalContributions - totalDraws;
        return { totalContributions, totalDraws, endingEquity };
    }, [beginningEquity, netIncome, contributions, draws]);

    const addTransaction = (type: 'contribution' | 'draw') => {
        const newItem = { id: Date.now(), date: format(new Date(), 'yyyy-MM-dd'), description: '', amount: 0 };
        if (type === 'contribution') {
            setContributions(prev => [...prev, newItem]);
        } else {
            setDraws(prev => [...prev, newItem]);
        }
    };
    
    const updateTransaction = (type: 'contribution' | 'draw', id: number, field: keyof Omit<EquityTransaction, 'id'>, value: string | number) => {
        const setter = type === 'contribution' ? setContributions : setDraws;
        setter(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeTransaction = (type: 'contribution' | 'draw', id: number) => {
        const setter = type === 'contribution' ? setContributions : setDraws;
        setter(prev => prev.filter(item => item.id !== id));
    };

    const handlePrint = () => {
        if (printRef.current) {
            const content = printRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`<html><head><title>Print Statement of Equity</title><style>body{font-family:sans-serif}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}h1,h2,h3{text-align:center}.summary{margin-top:20px;padding-top:10px;border-top:2px solid #333}.summary-item{display:flex;justify-content:space-between;padding:4px 0}img{max-width:100px; max-height: 50px; margin: 0 auto 10px; display: block;}</style></head><body>${content}</body></html>`);
            printWindow?.document.close();
            printWindow?.print();
        }
    };

    const handleExport = () => {
        const data = [
            ['Statement of Owner\'s Equity'],
            [`For the Period of ${dateRange?.from ? format(dateRange.from, 'PPP') : ''} to ${dateRange?.to ? format(dateRange.to, 'PPP') : ''}`],
            [],
            ['Description', 'Amount'],
            ['Beginning Equity', beginningEquity],
            ['Net Income', netIncome],
            ['Total Contributions', totals.totalContributions],
            ['Total Draws', -totals.totalDraws],
            ['Ending Equity', totals.endingEquity],
            [],
            ['Contributions'],
            ['Date', 'Description', 'Amount'],
            ...contributions.map(c => [c.date, c.description, c.amount]),
            [],
            ['Draws'],
            ['Date', 'Description', 'Amount'],
            ...draws.map(d => [d.date, d.description, d.amount]),
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Statement of Equity");
        XLSX.writeFile(wb, `Statement_of_Equity_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Statement of Owner's Equity" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Home />
                            Statement of Owner's Equity
                        </CardTitle>
                        <CardDescription>
                            A summary of the changes in the owner's equity over a specific period.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <Button variant="outline" onClick={handlePrint}><Printer className="mr-2"/>Print</Button>
                        <Button variant="outline" onClick={handleExport}><Download className="mr-2"/>Export</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div ref={printRef}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="p-4 border rounded-lg mb-6 space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Logo</Label>
                            <DocumentUpload onDocumentChange={setCompanyLogo} currentDocument={companyLogo} />
                        </div>
                    </div>
                    {companyLogo && <Image src={companyLogo} alt="Company Logo" width="120" height="50" className="mx-auto mb-2" />}
                     <h2 className="text-center text-2xl font-bold">{companyName}</h2>
                     <h3 className="text-center text-lg text-muted-foreground">Statement of Owner's Equity</h3>
                     <p className="text-center text-sm text-muted-foreground">For the Period Ended {dateRange?.to ? format(dateRange.to, 'PPP') : '...'}</p>
                    
                    <div className="space-y-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center py-2">
                            <Label htmlFor="beginning-equity" className="text-base">Beginning Equity Balance</Label>
                            <Input id="beginning-equity" type="number" value={beginningEquity} onChange={(e) => setBeginningEquity(parseFloat(e.target.value) || 0)} className="w-40 text-right" />
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <Label htmlFor="net-income" className="text-base">Net Income</Label>
                            <Input id="net-income" type="number" value={netIncome} onChange={(e) => setNetIncome(parseFloat(e.target.value) || 0)} className="w-40 text-right" />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center py-2 font-semibold">
                            <span>Total Contributions</span>
                            <span>${totals.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                         <div className="flex justify-between items-center py-2 font-semibold text-destructive">
                            <span>Total Draws</span>
                            <span>(${totals.totalDraws.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center py-2 text-xl font-bold text-primary">
                            <span>Ending Equity Balance</span>
                            <span>${totals.endingEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>
                </div>
                
                 <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Owner Contributions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contributions.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell><Input type="date" value={item.date} onChange={e => updateTransaction('contribution', item.id, 'date', e.target.value)} /></TableCell>
                                            <TableCell><Input value={item.description} onChange={e => updateTransaction('contribution', item.id, 'description', e.target.value)} /></TableCell>
                                            <TableCell><Input type="number" value={item.amount || ''} onChange={e => updateTransaction('contribution', item.id, 'amount', parseFloat(e.target.value) || 0)} className="text-right" /></TableCell>
                                            <TableCell><Button variant="ghost" size="icon" onClick={() => removeTransaction('contribution', item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => addTransaction('contribution')}><PlusCircle className="mr-2"/> Add Contribution</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Owner Draws</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {draws.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell><Input type="date" value={item.date} onChange={e => updateTransaction('draw', item.id, 'date', e.target.value)} /></TableCell>
                                            <TableCell><Input value={item.description} onChange={e => updateTransaction('draw', item.id, 'description', e.target.value)} /></TableCell>
                                            <TableCell><Input type="number" value={item.amount || ''} onChange={e => updateTransaction('draw', item.id, 'amount', parseFloat(e.target.value) || 0)} className="text-right" /></TableCell>
                                            <TableCell><Button variant="ghost" size="icon" onClick={() => removeTransaction('draw', item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button variant="outline" size="sm" className="mt-2" onClick={() => addTransaction('draw')}><PlusCircle className="mr-2"/> Add Draw</Button>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
