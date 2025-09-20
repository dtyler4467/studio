"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Download, DollarSign, Percent, CalendarClock, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

type AmortizationEntry = {
    paymentNumber: number;
    paymentDate: string;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
};

export default function AmortizationPage() {
    const { toast } = useToast();
    const [loanAmount, setLoanAmount] = useState(250000);
    const [interestRate, setInterestRate] = useState(5);
    const [loanTermYears, setLoanTermYears] = useState(30);

    const schedule = useMemo(() => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTermYears * 12;
        
        if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
            return [];
        }

        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        let balance = principal;
        const schedule: AmortizationEntry[] = [];
        const startDate = new Date();

        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPaid = balance * monthlyRate;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;
            
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);

            schedule.push({
                paymentNumber: i,
                paymentDate: format(paymentDate, 'MMM yyyy'),
                payment: monthlyPayment,
                principal: principalPaid,
                interest: interestPaid,
                balance: balance > 0 ? balance : 0,
            });
        }
        return schedule;
    }, [loanAmount, interestRate, loanTermYears]);

    const { monthlyPayment, totalInterest, totalCost } = useMemo(() => {
        if (schedule.length === 0) {
            return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
        }
        const monthlyPayment = schedule[0].payment;
        const totalCost = monthlyPayment * schedule.length;
        const totalInterest = totalCost - loanAmount;
        return { monthlyPayment, totalInterest, totalCost };
    }, [schedule, loanAmount]);

    const handleExport = () => {
        if (schedule.length === 0) {
            toast({ variant: 'destructive', title: 'No data to export.' });
            return;
        }

        const headers = ["Payment #", "Payment Date", "Payment", "Principal", "Interest", "Remaining Balance"];
        const data = schedule.map(row => [
            row.paymentNumber,
            row.paymentDate,
            row.payment.toFixed(2),
            row.principal.toFixed(2),
            row.interest.toFixed(2),
            row.balance.toFixed(2)
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...data.map(e => e.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amortization_schedule_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Amortization" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Calculator />
                    Loan Amortization Calculator
                </CardTitle>
                <CardDescription>
                    Calculate your monthly loan payment and see the full amortization schedule.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                        <Input id="loanAmount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <Input id="interestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                        <Input id="loanTerm" type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))} />
                    </div>
                </div>

                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Principal</CardTitle>
                             <Hash className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">${loanAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold text-destructive">${totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Cost of Loan</CardTitle>
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Amortization Schedule</h3>
                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Payment</TableHead>
                                <TableHead className="text-right">Principal</TableHead>
                                <TableHead className="text-right">Interest</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedule.map(row => (
                                <TableRow key={row.paymentNumber}>
                                    <TableCell>{row.paymentNumber}</TableCell>
                                    <TableCell>{row.paymentDate}</TableCell>
                                    <TableCell className="text-right font-mono">${row.payment.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">${row.principal.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-destructive">${row.interest.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono font-semibold">${row.balance.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2" />
                    Export as CSV
                </Button>
            </CardFooter>
        </Card>
      </main>
    </div>
  );
}
