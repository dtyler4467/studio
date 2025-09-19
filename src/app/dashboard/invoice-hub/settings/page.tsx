"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TaxRate = {
  id: string;
  name: string;
  rate: number;
};

export default function InvoiceSettingsPage() {
    const { toast } = useToast();
    const [companyName, setCompanyName] = useState('LogiFlow Inc.');
    const [companyAddress, setCompanyAddress] = useState('123 Logistics Lane, Anytown, USA');
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [defaultTerms, setDefaultTerms] = useState('Payment due within 30 days of invoice date.');
    const [defaultNotes, setDefaultNotes] = useState('Thank you for your business!');
    const [taxRates, setTaxRates] = useState<TaxRate[]>([
        { id: 'tax_1', name: 'Sales Tax', rate: 8.25 },
        { id: 'tax_2', name: 'VAT', rate: 20.0 },
    ]);

    const handleAddTaxRate = () => {
        setTaxRates([...taxRates, { id: `tax_${Date.now()}`, name: '', rate: 0 }]);
    };

    const handleTaxRateChange = (id: string, field: 'name' | 'rate', value: string) => {
        setTaxRates(taxRates.map(tax => 
            tax.id === id 
            ? { ...tax, [field]: field === 'rate' ? parseFloat(value) || 0 : value } 
            : tax
        ));
    };
    
    const handleRemoveTaxRate = (id: string) => {
        setTaxRates(taxRates.filter(tax => tax.id !== id));
    };

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your invoice settings have been updated.",
        });
    };

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Invoice Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Company Information</CardTitle>
                    <CardDescription>
                    Set your company's details and logo for all invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-address">Company Address</Label>
                            <Input id="company-address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Company Logo</Label>
                        <DocumentUpload onDocumentChange={setCompanyLogo} currentDocument={companyLogo} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Invoice Defaults</CardTitle>
                    <CardDescription>
                    Set default text for new invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="default-terms">Default Payment Terms</Label>
                        <Textarea id="default-terms" value={defaultTerms} onChange={e => setDefaultTerms(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="default-notes">Default Notes</Label>
                        <Textarea id="default-notes" value={defaultNotes} onChange={e => setDefaultNotes(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Tax Rates</CardTitle>
                    <CardDescription>
                    Manage tax rates that can be applied to invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tax Name</TableHead>
                                    <TableHead className="w-[120px]">Rate (%)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxRates.map((tax) => (
                                    <TableRow key={tax.id}>
                                        <TableCell>
                                            <Input value={tax.name} onChange={e => handleTaxRateChange(tax.id, 'name', e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input type="number" value={tax.rate} onChange={e => handleTaxRateChange(tax.id, 'rate', e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveTaxRate(tax.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleAddTaxRate} className="mt-4">
                        <PlusCircle className="mr-2" />
                        Add Tax Rate
                    </Button>
                </CardContent>
            </Card>
             <div className="flex justify-end">
                <Button size="lg" onClick={handleSaveChanges}>
                    <Save className="mr-2" />
                    Save All Settings
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}