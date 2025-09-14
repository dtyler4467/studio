
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import React, { useState, useMemo, useRef } from 'react';
import { Printer, Mail, Download, Upload, FileSpreadsheet, Trash2, CheckCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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

type CustomTemplate = {
    id: string;
    name: string;
    file: File;
    imageUrl: string; // For preview
};

const mockPayStubs: PayStub[] = [
    {
        payPeriod: '2024-07-01 to 2024-07-15',
        payDate: '2024-07-20',
        employee: { id: 'USR001', name: 'John Doe', role: 'Driver', status: 'Active', personnelId: 'JD-001', email: 'john.doe@example.com', payRate: 25.50, payType: 'Hourly' },
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
        employee: { id: 'USR003', name: 'Mike Smith', role: 'Dispatcher', status: 'Active', personnelId: 'MS-001', email: 'mike.smith@example.com', payRate: 65000, payType: 'Salary' },
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

const PayStubPreview = ({ stub, template }: { stub: PayStub | null, template: CustomTemplate | 'default' | null }) => {
    if (!stub) {
        return (
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Select an employee and pay period to view the stub.</p>
            </div>
        );
    }
    
    if (template && template !== 'default') {
        return (
            <div className="relative border rounded-lg bg-gray-200">
                <Image src={template.imageUrl} alt={template.name} width={850} height={1100} className="w-full h-auto opacity-50" />
                <div className="absolute top-10 left-10 text-black text-sm">
                    <p><strong>Employee:</strong> {stub.employee.name}</p>
                    <p><strong>Pay Date:</strong> {stub.payDate}</p>
                </div>
                 <div className="absolute bottom-10 right-10 text-black text-lg font-bold">
                    <p>Net Pay: ${stub.netPay.toFixed(2)}</p>
                </div>
            </div>
        )
    }

    return <PayStubTemplate stub={stub} />;
};

const UploadTemplateDialog = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (name: string, file: File, imageUrl: string) => void }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            if (!name) {
                setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleSave = () => {
        if (name && file && previewUrl) {
            onSave(name, file, previewUrl);
            onOpenChange(false);
            setName('');
            setFile(null);
            setPreviewUrl(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <Upload className="mr-2"/> Upload New Template
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New Template</DialogTitle>
                    <DialogDescription>
                        Give your template a name and upload the file.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input id="template-name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="template-file">Template File</Label>
                        <Input id="template-file" type="file" accept=".xlsx, .xls, .png, .jpg, .jpeg" onChange={handleFileChange} />
                    </div>
                    {previewUrl && (
                        <div>
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <Image src={previewUrl} alt="Template Preview" width={400} height={500} className="w-full h-auto border rounded-md" />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!name || !file}>Save Template</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function PaycheckStubPage() {
    const { employees } = useSchedule();
    const { toast } = useToast();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('USR001');
    const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>('2024-07-01 to 2024-07-15');
    
    const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate | 'default' | null>('default');
    const [defaultTemplateId, setDefaultTemplateId] = useState<string | 'default'>('default');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const payPeriods = useMemo(() => {
        return [...new Set(mockPayStubs.map(p => p.payPeriod))];
    }, []);

    const selectedStub = useMemo(() => {
        return mockPayStubs.find(p => p.employee.id === selectedEmployeeId && p.payPeriod === selectedPayPeriod);
    }, [selectedEmployeeId, selectedPayPeriod]);
    
    const handleAddTemplate = (name: string, file: File, imageUrl: string) => {
        const newTemplate: CustomTemplate = { id: `tpl_${Date.now()}`, name, file, imageUrl };
        setCustomTemplates(prev => [...prev, newTemplate]);
        toast({ title: 'Template Saved', description: `Template "${name}" has been added.`});
    };

    const handleDeleteTemplate = (id: string) => {
        setCustomTemplates(prev => prev.filter(t => t.id !== id));
        if (selectedTemplate !== 'default' && selectedTemplate?.id === id) {
            setSelectedTemplate('default');
        }
        if (defaultTemplateId === id) {
            setDefaultTemplateId('default');
        }
        toast({ variant: 'destructive', title: 'Template Deleted' });
    };

    const handleEmail = () => {
        if (!selectedStub || !selectedStub.employee.email) return;
        const subject = `Your Pay Stub for ${selectedStub.payPeriod}`;
        const body = `Hi ${selectedStub.employee.name},\n\nPlease find your pay stub attached.\n\nThank you,\nLogiFlow HR`;
        window.location.href = `mailto:${selectedStub.employee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    const handlePrint = () => {
        toast({ title: 'Printing...', description: 'Your pay stub is being sent to the printer.' });
    }

    const downloadExcel = () => {
        if (!selectedStub) return;
        const ws_data = [
            ["Your Company Name", "", "", "Pay Statement"],
            ["Company Address"],
            [],
            ["Employee:", selectedStub.employee.name, "", "Pay Period:", selectedStub.payPeriod],
            ["Employee ID:", selectedStub.employee.personnelId, "", "Pay Date:", selectedStub.payDate],
            [],
            ["Earnings", "Rate", "Hours", "Amount"],
            ...selectedStub.earnings.map(e => [e.description, e.rate || '', e.hours || '', e.amount]),
            ["", "", "Gross Pay:", selectedStub.grossPay],
            [],
            ["Deductions", "Amount"],
            ...selectedStub.deductions.map(d => [d.description, -d.amount]),
            ["", "Total Deductions:", -selectedStub.deductions.reduce((a,c) => a + c.amount, 0)],
            [],
            ["", "", "Net Pay:", selectedStub.netPay],
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pay Stub");
        XLSX.writeFile(wb, `PayStub_${selectedStub.employee.name.replace(' ','_')}_${selectedStub.payDate}.xlsx`);
        toast({ title: 'Pay Stub Downloaded', description: 'The pay stub has been downloaded as an Excel file.' });
    };

  return (
    <div className="flex flex-col w-full">
    <Header pageTitle="Paycheck Stubs" />
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Custom Templates</CardTitle>
                <CardDescription>
                    Upload and manage your custom pay stub designs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     <Card
                        onClick={() => setSelectedTemplate('default')}
                        className={cn("cursor-pointer", selectedTemplate === 'default' && "ring-2 ring-primary")}
                    >
                         <div className="relative aspect-[4/5] bg-gray-100 flex items-center justify-center">
                            <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
                             {defaultTemplateId === 'default' && <Star className="absolute top-2 right-2 w-5 h-5 fill-yellow-400 text-yellow-500" />}
                        </div>
                        <CardFooter className="p-2">
                             <p className="text-sm font-medium w-full text-center">Default Template</p>
                        </CardFooter>
                     </Card>
                    {customTemplates.map(template => (
                         <Card key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className={cn("cursor-pointer", (selectedTemplate !== 'default' && selectedTemplate?.id === template.id) && "ring-2 ring-primary")}
                        >
                            <div className="relative aspect-[4/5]">
                                <Image src={template.imageUrl} alt={template.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                                {defaultTemplateId === template.id && <Star className="absolute top-2 right-2 w-5 h-5 fill-yellow-400 text-yellow-500" />}
                            </div>
                            <CardContent className="p-2">
                                <p className="text-sm font-medium truncate">{template.name}</p>
                            </CardContent>
                             <CardFooter className="p-2 flex gap-1">
                                 <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); setDefaultTemplateId(template.id); }}>Default</Button>
                                <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}><Trash2 className="w-4 h-4" /></Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <div className="flex items-center justify-center border-dashed border-2 rounded-lg aspect-[4/5]">
                         <UploadTemplateDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} onSave={handleAddTemplate} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Employee Paycheck Stubs</CardTitle>
                <CardDescription>
                    Select an employee and pay period to view their stub.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="employee">Select Employee</Label>
                        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                            <SelectTrigger id="employee"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {employees.filter(emp => mockPayStubs.some(p => p.employee.id === emp.id)).map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                ))}
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
                <PayStubPreview stub={selectedStub || null} template={selectedTemplate} />
            </CardContent>
            <CardFooter className="gap-2">
                <Button onClick={handlePrint} disabled={!selectedStub}><Printer className="mr-2" /> Print Stub</Button>
                <Button variant="secondary" onClick={downloadExcel} disabled={!selectedStub}><Download className="mr-2" /> Download Excel</Button>
                <Button variant="outline" onClick={handleEmail} disabled={!selectedStub || !selectedStub.employee.email}><Mail className="mr-2" /> Email to Employee</Button>
            </CardFooter>
        </Card>
    </main>
    </div>
  );
}
