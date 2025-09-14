
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import React, { useState, useMemo, useRef } from 'react';
import { Printer, Mail, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Logo } from '@/components/icons/logo';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

type PayStub = {
    payPeriod: string;
    payDate: string;
    employee: Employee;
    grossPay: number;
    netPay: number;
    earnings: { description: string; rate?: number; hours?: number; amount: number }[];
    deductions: { description: string; amount: number }[];
};

const mockPayStubs: PayStub[] = [
    {
        payPeriod: '2024-07-01 to 2024-07-15',
        payDate: '2024-07-20',
        employee: { id: 'USR001', name: 'John Doe', role: 'Driver', status: 'Active', personnelId: 'JD-001' },
        grossPay: 2040.00,
        netPay: 1650.50,
        earnings: [{ description: 'Regular Hours', rate: 25.50, hours: 80, amount: 2040.00 }],
        deductions: [
            { description: 'Federal Tax', amount: 200.00 },
            { description: 'State Tax', amount: 80.00 },
            { description: 'Social Security', amount: 126.48 },
            { description: 'Medicare', amount: 29.58 },
            { description: 'Health Insurance', amount: 75.00 },
        ],
    },
    {
        payPeriod: '2024-07-01 to 2024-07-15',
        payDate: '2024-07-20',
        employee: { id: 'USR003', name: 'Mike Smith', role: 'Dispatcher', status: 'Active', personnelId: 'MS-001' },
        grossPay: 2500.00,
        netPay: 1950.00,
        earnings: [{ description: 'Salary', amount: 2500.00 }],
        deductions: [
            { description: 'Federal Tax', amount: 300.00 },
            { description: 'State Tax', amount: 120.00 },
            { description: 'Social Security', amount: 155.00 },
            { description: 'Medicare', amount: 36.25 },
            { description: '401k', amount: 100.00 },
            { description: 'Health Insurance', amount: 75.00 },
        ],
    },
];

const PayStubTemplate = ({ stub }: { stub: PayStub }) => {
    return (
        <div className="border rounded-lg p-6 bg-white text-sm text-black">
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">LogiFlow Inc.</h2>
                    <p className="text-xs text-gray-500">123 Logistics Lane, Anytown, USA</p>
                </div>
                <h3 className="text-xl font-semibold">Pay Statement</h3>
            </header>
            <section className="grid grid-cols-2 gap-4 my-4">
                <div>
                    <p className="font-semibold">{stub.employee.name}</p>
                    <p>{stub.employee.personnelId}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-semibold">Pay Period:</span> {stub.payPeriod}</p>
                    <p><span className="font-semibold">Pay Date:</span> {stub.payDate}</p>
                </div>
            </section>
            <section className="grid grid-cols-2 gap-8 my-4">
                <div>
                    <h4 className="font-bold border-b pb-1 mb-2">Earnings</h4>
                    <div className="space-y-1">
                        {stub.earnings.map((e, i) => (
                            <div key={i} className="flex justify-between">
                                <span>{e.description} {e.hours && `(${e.hours} hrs @ $${e.rate?.toFixed(2)})`}</span>
                                <span>${e.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold border-b pb-1 mb-2">Deductions</h4>
                     <div className="space-y-1">
                        {stub.deductions.map((d, i) => (
                            <div key={i} className="flex justify-between">
                                <span>{d.description}</span>
                                <span>-${d.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
             <Separator className="my-4" />
             <section className="grid grid-cols-3 gap-4">
                <div className="p-2 bg-gray-100 rounded">
                    <p className="text-xs text-gray-600">Gross Pay</p>
                    <p className="font-bold text-base">${stub.grossPay.toFixed(2)}</p>
                </div>
                 <div className="p-2 bg-gray-100 rounded">
                    <p className="text-xs text-gray-600">Deductions</p>
                    <p className="font-bold text-base">-${stub.deductions.reduce((acc, d) => acc + d.amount, 0).toFixed(2)}</p>
                </div>
                <div className="p-4 bg-green-100 rounded text-green-800">
                    <p className="text-sm font-semibold">Net Pay</p>
                    <p className="font-bold text-lg">${stub.netPay.toFixed(2)}</p>
                </div>
             </section>
        </div>
    );
};

const PayStubPreview = ({ stub, customTemplateUri }: { stub: PayStub | null, customTemplateUri: string | null }) => {
    if (!stub) {
        return (
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Select an employee and pay period to view the stub.</p>
            </div>
        );
    }
    
    if (customTemplateUri) {
         return (
            <div className="relative border rounded-lg h-[70vh] w-full bg-muted flex items-center justify-center">
                <Image src={customTemplateUri} alt="Custom pay stub template" layout="fill" objectFit="contain" />
                <div className="absolute top-10 left-10 bg-white/80 p-2 rounded text-black text-xs">
                    <p className="font-bold">{stub.employee.name}</p>
                    <p>{stub.payDate}</p>
                </div>
                 <div className="absolute bottom-10 right-10 bg-white/80 p-4 rounded text-black text-center">
                    <p className="text-sm">Gross Pay: ${stub.grossPay.toFixed(2)}</p>
                    <p className="text-lg font-bold">Net Pay: ${stub.netPay.toFixed(2)}</p>
                </div>
            </div>
        );
    }

    return <PayStubTemplate stub={stub} />;
};


export default function PaycheckStubPage() {
    const { employees } = useSchedule();
    const { toast } = useToast();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('USR001');
    const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>('2024-07-01 to 2024-07-15');
    const [customTemplateUri, setCustomTemplateUri] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'default' | 'custom'>('default');
    const fileInputRef = useRef<HTMLInputElement>(null);


    const payPeriods = useMemo(() => {
        return [...new Set(mockPayStubs.map(p => p.payPeriod))];
    }, []);

    const selectedStub = useMemo(() => {
        return mockPayStubs.find(p => p.employee.id === selectedEmployeeId && p.payPeriod === selectedPayPeriod);
    }, [selectedEmployeeId, selectedPayPeriod]);

    const handleEmail = () => {
        if (!selectedStub) return;
        const subject = `Your Pay Stub for ${selectedStub.payPeriod}`;
        const body = `Hi ${selectedStub.employee.name},\n\nPlease find your pay stub attached.\n\nThank you,\nLogiFlow HR`;
        window.location.href = `mailto:${selectedStub.employee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    const handlePrint = () => {
        toast({ title: 'Printing...', description: 'Your pay stub is being sent to the printer.' });
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const uri = e.target?.result as string;
            if (uri) {
                setCustomTemplateUri(uri);
                setViewMode('custom');
                 toast({ title: "Template Uploaded", description: "Your custom template is now active."});
            }
        };
        reader.readAsDataURL(file);

        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Paycheck Stubs" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Employee Paycheck Stubs</CardTitle>
                <CardDescription>
                    View and manage employee paycheck stubs. This data will be auto-populated when payroll is run.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="employee">Select Employee</Label>
                        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                            <SelectTrigger id="employee"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="pay-period">Select Pay Period</Label>
                        <Select value={selectedPayPeriod} onValueChange={setSelectedPayPeriod}>
                            <SelectTrigger id="pay-period"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {payPeriods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-3 rounded-md bg-muted">
                     <div className="flex items-center gap-2">
                        <Label>Template:</Label>
                         <Button variant={viewMode === 'default' ? 'default' : 'outline'} onClick={() => setViewMode('default')}>Default Template</Button>
                        <Button variant={viewMode === 'custom' ? 'default' : 'outline'} onClick={() => setViewMode('custom')} disabled={!customTemplateUri}>Custom Template</Button>
                    </div>
                     <div>
                        <input id="template-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.pdf" />
                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2" />
                            {customTemplateUri ? 'Upload New Custom Template' : 'Upload Custom Template'}
                        </Button>
                    </div>
                </div>
                <PayStubPreview stub={selectedStub || null} customTemplateUri={viewMode === 'custom' ? customTemplateUri : null} />
            </CardContent>
            <CardFooter className="gap-2">
                <Button onClick={handlePrint} disabled={!selectedStub}><Printer className="mr-2" /> Print Stub</Button>
                <Button variant="outline" onClick={handleEmail} disabled={!selectedStub}><Mail className="mr-2" /> Email to Employee</Button>
            </CardFooter>
        </Card>
      </main>
    </div>
  );
}
