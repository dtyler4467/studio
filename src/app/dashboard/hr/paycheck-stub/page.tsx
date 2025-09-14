
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import React, { useState, useMemo, useRef } from 'react';
import { Printer, Mail, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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

const PayStubPreview = ({ stub }: { stub: PayStub | null }) => {
    if (!stub) {
        return (
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Select an employee and pay period to view the stub.</p>
            </div>
        );
    }
    
    return <PayStubTemplate stub={stub} />;
};


const EditAndDownloadDialog = ({
    isOpen,
    onOpenChange,
    stubData,
    templateFile,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    stubData: PayStub | null;
    templateFile: File | null;
}) => {
    const { toast } = useToast();
    const [editableStub, setEditableStub] = useState<PayStub | null>(stubData);

    React.useEffect(() => {
        setEditableStub(stubData);
    }, [stubData]);

    const handleEarningChange = (index: number, field: 'description' | 'amount', value: string) => {
        if (!editableStub) return;

        const updatedEarnings = [...editableStub.earnings];
        const target = { ...updatedEarnings[index] };

        if (field === 'description') {
            target.description = value;
        } else if (field === 'amount') {
            target.amount = parseFloat(value) || 0;
        }

        updatedEarnings[index] = target;
        setEditableStub({ ...editableStub, earnings: updatedEarnings });
    };

    const handleDeductionChange = (index: number, field: 'description' | 'amount', value: string) => {
        if (!editableStub) return;
        
        const updatedDeductions = [...editableStub.deductions];
        const target = { ...updatedDeductions[index] };

        if (field === 'description') {
            target.description = value;
        } else if (field === 'amount') {
            target.amount = parseFloat(value) || 0;
        }
        
        updatedDeductions[index] = target;
        setEditableStub({ ...editableStub, deductions: updatedDeductions });
    };

    const handleDownload = () => {
        if (!editableStub || !templateFile) {
            toast({ variant: 'destructive', title: 'Error', description: 'No data to download.'});
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                
                // Simplified merge logic
                for (const cellAddress in worksheet) {
                    if (Object.prototype.hasOwnProperty.call(worksheet, cellAddress)) {
                        const cell = worksheet[cellAddress];
                        if (typeof cell.v === 'string') {
                            cell.v = cell.v
                                .replace(/\[EMPLOYEE_NAME\]/g, editableStub.employee.name)
                                .replace(/\[PAY_PERIOD\]/g, editableStub.payPeriod)
                                .replace(/\[PAY_DATE\]/g, editableStub.payDate)
                                .replace(/\[GROSS_PAY\]/g, editableStub.grossPay.toFixed(2))
                                .replace(/\[NET_PAY\]/g, editableStub.netPay.toFixed(2))
                                .replace(/\[TOTAL_DEDUCTIONS\]/g, editableStub.deductions.reduce((a,c) => a + c.amount, 0).toFixed(2))
                        }
                    }
                }
                
                // Add earning and deduction rows
                let earningRowIndex = 8; // Adjust based on your template
                editableStub.earnings.forEach((earning, index) => {
                    XLSX.utils.sheet_add_aoa(worksheet, [[earning.description, earning.rate || '', earning.hours || '', earning.amount]], { origin: `A${earningRowIndex + index}` });
                });
                let deductionRowIndex = 13; // Adjust based on your template
                editableStub.deductions.forEach((deduction, index) => {
                    XLSX.utils.sheet_add_aoa(worksheet, [[deduction.description, deduction.amount]], { origin: `F${deductionRowIndex + index}` });
                });

                const newWorkbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Populated Pay Stub");

                XLSX.writeFile(newWorkbook, `PayStub_${editableStub.employee.name.replace(' ','_')}_${editableStub.payDate}.xlsx`);
                toast({ title: 'Pay Stub Generated', description: 'Your custom template has been populated and downloaded.'});
                onOpenChange(false);
            } catch (error) {
                console.error("Failed to process template:", error);
                toast({ variant: 'destructive', title: 'Processing Failed', description: 'Could not populate the selected template.'});
            }
        };
        reader.readAsArrayBuffer(templateFile);
    };

    if (!editableStub) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit & Download Pay Stub</DialogTitle>
                    <DialogDescription>
                        Review and make final adjustments before downloading the Excel file.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 border rounded-md">
                     <h4 className="font-semibold text-lg">Pay Stub for {editableStub.employee.name}</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label>Gross Pay</Label>
                             <Input type="number" value={editableStub.grossPay} onChange={e => setEditableStub(s => s ? {...s, grossPay: parseFloat(e.target.value)}: null)} />
                        </div>
                         <div className="space-y-2">
                             <Label>Net Pay</Label>
                             <Input type="number" value={editableStub.netPay} onChange={e => setEditableStub(s => s ? {...s, netPay: parseFloat(e.target.value)}: null)} />
                        </div>
                     </div>
                     <div>
                        <h5 className="font-medium mt-4 mb-2">Earnings</h5>
                         {editableStub.earnings.map((earning, index) => (
                             <div key={index} className="flex items-center gap-2 mb-2">
                                <Input value={earning.description} onChange={e => handleEarningChange(index, 'description', e.target.value)} className="flex-1" />
                                <Input type="number" value={earning.amount} onChange={e => handleEarningChange(index, 'amount', e.target.value)} className="w-28" />
                            </div>
                         ))}
                     </div>
                     <div>
                        <h5 className="font-medium mt-4 mb-2">Deductions</h5>
                          {editableStub.deductions.map((deduction, index) => (
                             <div key={index} className="flex items-center gap-2 mb-2">
                                <Input value={deduction.description} onChange={e => handleDeductionChange(index, 'description', e.target.value)} className="flex-1" />
                                <Input type="number" value={deduction.amount} onChange={e => handleDeductionChange(index, 'amount', e.target.value)} className="w-28" />
                            </div>
                         ))}
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleDownload}>
                        <Download className="mr-2" /> Download Excel
                    </Button>
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
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const payPeriods = useMemo(() => {
        return [...new Set(mockPayStubs.map(p => p.payPeriod))];
    }, []);

    const selectedStub = useMemo(() => {
        return mockPayStubs.find(p => p.employee.id === selectedEmployeeId && p.payPeriod === selectedPayPeriod);
    }, [selectedEmployeeId, selectedPayPeriod]);

    const handleEmail = () => {
        if (!selectedStub || !selectedStub.employee.email) return;
        const subject = `Your Pay Stub for ${selectedStub.payPeriod}`;
        const body = `Hi ${selectedStub.employee.name},\n\nPlease find your pay stub attached.\n\nThank you,\nLogiFlow HR`;
        window.location.href = `mailto:${selectedStub.employee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    const handlePrint = () => {
        toast({ title: 'Printing...', description: 'Your pay stub is being sent to the printer.' });
    }

    const downloadBlankTemplate = () => {
        const ws_data = [
            ["Your Company Name", "", "", "Pay Statement"],
            ["Company Address"],
            [],
            ["Employee:", "[EMPLOYEE_NAME]", "", "Pay Period:", "[PAY_PERIOD]"],
            ["Employee ID:", "[EMPLOYEE_ID]", "", "Pay Date:", "[PAY_DATE]"],
            [],
            ["Earnings"],
            ["Description", "Rate", "Hours", "Amount"],
            ["[EARNING_DESC_1]", "[EARNING_RATE_1]", "[EARNING_HOURS_1]", "[EARNING_AMOUNT_1]"],
            ["", "", "Gross Pay:", "[GROSS_PAY]"],
            [],
            ["Deductions"],
            ["Description", "Amount"],
            ["[DEDUCTION_DESC_1]", "[DEDUCTION_AMOUNT_1]"],
            ["", "", "Total Deductions:", "[TOTAL_DEDUCTIONS]"],
            [],
            ["", "", "Net Pay:", "[NET_PAY]"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pay Stub Template");
        XLSX.writeFile(wb, `PayStub_Blank_Template.xlsx`);
        toast({ title: 'Template Downloaded', description: 'Blank Excel template has been downloaded.' });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast({ variant: 'destructive', title: 'Error', description: 'No file selected.'});
            return;
        }
        if (!selectedStub) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a pay stub first.'});
            if (fileUploadRef.current) fileUploadRef.current.value = "";
            return;
        }
        setUploadedFile(file);
        setIsEditOpen(true);
        if (fileUploadRef.current) fileUploadRef.current.value = "";
    };

  return (
    <>
        <div className="flex flex-col w-full">
        <Header pageTitle="Paycheck Stubs" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Employee Paycheck Stubs</CardTitle>
                    <CardDescription>
                        Select an employee and pay period to view their stub. You can also download a blank template, customize it, and upload it to generate a populated pay stub.
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
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={downloadBlankTemplate} variant="secondary">
                            <FileSpreadsheet className="mr-2" /> Download Blank Template
                        </Button>
                        <Button onClick={() => fileUploadRef.current?.click()} variant="secondary" disabled={!selectedStub}>
                        <Upload className="mr-2" /> Upload & Populate Template
                        </Button>
                        <input type="file" ref={fileUploadRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    </div>
                    <PayStubPreview stub={selectedStub || null} />
                </CardContent>
                <CardFooter className="gap-2">
                    <Button onClick={handlePrint} disabled={!selectedStub}><Printer className="mr-2" /> Print Stub</Button>
                    <Button variant="outline" onClick={handleEmail} disabled={!selectedStub || !selectedStub.employee.email}><Mail className="mr-2" /> Email to Employee</Button>
                </CardFooter>
            </Card>
        </main>
        </div>
        <EditAndDownloadDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            stubData={selectedStub || null}
            templateFile={uploadedFile}
        />
    </>
  );
}
