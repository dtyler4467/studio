
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Printer, Download, Upload } from 'lucide-react';
import { DocumentUpload } from './document-upload';
import Image from 'next/image';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

type LineItem = {
    id: number;
    description: string;
    quantity: number;
    rate: number;
};

const InvoicePreview = React.forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => {
    const { from, to, logo, invoiceNumber, invoiceDate, dueDate, items, notes, terms } = data;
    const subtotal = items.reduce((acc: number, item: LineItem) => acc + (item.quantity * item.rate), 0);
    const tax = parseFloat(data.tax) || 0;
    const total = subtotal + tax;

    return (
        <div ref={ref} className="p-8 border rounded-lg bg-white text-black text-sm w-full">
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    {logo ? (
                        <Image src={logo} alt="Company Logo" width={120} height={60} />
                    ) : (
                        <h1 className="text-2xl font-bold">{from.name || 'Your Company'}</h1>
                    )}
                    <div className="text-xs text-gray-600 mt-2">
                        <p>{from.address}</p>
                        <p>{from.cityStateZip}</p>
                        <p>{from.country}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-700">INVOICE</h2>
                    <p className="text-gray-500"># {invoiceNumber || 'INV-001'}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 my-6">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Bill To</h3>
                    <p className="font-bold">{to.name || 'Client Name'}</p>
                    <p>{to.address}</p>
                    <p>{to.cityStateZip}</p>
                    <p>{to.country}</p>
                </div>
                <div className="text-right">
                    <p><strong>Invoice Date:</strong> {invoiceDate ? format(new Date(invoiceDate + 'T00:00:00'), 'PPP') : ''}</p>
                    <p><strong>Due Date:</strong> {dueDate ? format(new Date(dueDate + 'T00:00:00'), 'PPP') : ''}</p>
                </div>
            </section>

            <section>
                 <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Description</th>
                            <th className="p-2 text-center w-24">Quantity</th>
                            <th className="p-2 text-right w-32">Rate</th>
                            <th className="p-2 text-right w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: LineItem) => (
                             <tr key={item.id} className="border-b">
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">${item.rate.toFixed(2)}</td>
                                <td className="p-2 text-right">${(item.quantity * item.rate).toFixed(2)}</td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </section>

             <section className="flex justify-end mt-4">
                <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total:</span><span>${total.toFixed(2)}</span></div>
                </div>
            </section>

            <section className="mt-8 text-xs text-gray-600">
                <div className="mb-4">
                    <h4 className="font-bold mb-1">Notes</h4>
                    <p>{notes}</p>
                </div>
                <div>
                    <h4 className="font-bold mb-1">Terms</h4>
                    <p>{terms}</p>
                </div>
            </section>
        </div>
    );
});
InvoicePreview.displayName = 'InvoicePreview';

export function InvoiceCreator() {
    const previewRef = useRef<HTMLDivElement>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [from, setFrom] = useState({ name: 'LogiFlow Inc.', address: '123 Logistics Lane', cityStateZip: 'Anytown, USA 12345', country: 'United States' });
    const [to, setTo] = useState({ name: '', address: '', cityStateZip: '', country: '' });
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), 'yyyy')}-`);
    const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<LineItem[]>([{ id: 1, description: '', quantity: 1, rate: 0 }]);
    const [tax, setTax] = useState('0');
    const [notes, setNotes] = useState('Thank you for your business.');
    const [terms, setTerms] = useState('Net 30. Payment due within 30 days of invoice date.');

    const handlePrint = () => {
        if (previewRef.current) {
            const printWindow = window.open('', '', 'height=1100,width=850');
            printWindow?.document.write('<html><head><title>Invoice</title>');
            const styles = Array.from(document.styleSheets)
                .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : `<style>${Array.from(s.cssRules).map(r => r.cssText).join('')}</style>`)
                .join('\n');
            printWindow?.document.write(`<head>${styles}<style>@media print { @page { size: auto; margin: 0; } body { margin: 1.5cm; } }</style></head>`);
            printWindow?.document.write('<body>');
            printWindow?.document.write(previewRef.current.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => printWindow?.print(), 250);
        }
    };

    const addLineItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0 }]);
    };
    
    const removeLineItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const invoiceData = { from, to, logo, invoiceNumber, invoiceDate, dueDate, items, tax, notes, terms };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Invoice Details</CardTitle>
                    <CardDescription>Fill out the form below. The preview will update live.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold">From</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Your Name/Company" value={from.name} onChange={e => setFrom({...from, name: e.target.value})} />
                            <Input placeholder="Address" value={from.address} onChange={e => setFrom({...from, address: e.target.value})} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="City, State, Zip" value={from.cityStateZip} onChange={e => setFrom({...from, cityStateZip: e.target.value})} />
                            <Input placeholder="Country" value={from.country} onChange={e => setFrom({...from, country: e.target.value})} />
                        </div>
                    </div>
                     <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold">Bill To</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Client Name/Company" value={to.name} onChange={e => setTo({...to, name: e.target.value})} />
                            <Input placeholder="Address" value={to.address} onChange={e => setTo({...to, address: e.target.value})} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="City, State, Zip" value={to.cityStateZip} onChange={e => setTo({...to, cityStateZip: e.target.value})} />
                            <Input placeholder="Country" value={to.country} onChange={e => setTo({...to, country: e.target.value})} />
                        </div>
                    </div>
                     <div className="space-y-4 p-4 border rounded-lg">
                         <h4 className="font-semibold">Invoice Meta</h4>
                         <div className="grid grid-cols-2 gap-4">
                             <Input placeholder="Invoice #" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                             <Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                             <DocumentUpload onDocumentChange={setLogo} currentDocument={logo} />
                         </div>
                     </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Line Items</h4>
                        {items.map(item => (
                            <div key={item.id} className="flex gap-2 items-center">
                                <Input placeholder="Description" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="flex-1" />
                                <Input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-20" />
                                <Input type="number" value={item.rate} onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-24" />
                                <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                         <Button variant="outline" size="sm" onClick={addLineItem}><PlusCircle className="mr-2" /> Add Item</Button>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                         <div className="flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="flex-1 text-right">Tax ($)</Label>
                                    <Input type="number" value={tax} onChange={e => setTax(e.target.value)} className="w-32" />
                                </div>
                            </div>
                         </div>
                         <div className="space-y-2">
                             <Label>Notes</Label>
                             <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
                         </div>
                          <div className="space-y-2">
                             <Label>Terms</Label>
                             <Textarea value={terms} onChange={e => setTerms(e.target.value)} />
                         </div>
                      </div>
                </CardContent>
            </Card>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                        <CardDescription>This is how your invoice will look.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InvoicePreview ref={previewRef} data={invoiceData} />
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button onClick={handlePrint} className="w-full">
                            <Printer className="mr-2" />
                            Print / Save as PDF
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
