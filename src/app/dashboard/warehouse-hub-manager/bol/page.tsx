

"use client";

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Trash2, MoreVertical, Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSchedule, BolTemplate } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-primary col-span-full">{children}</h3>
);

type Commodity = {
    id: number;
    units: string;
    pkgType: string;
    hm: boolean;
    description: string;
    weight: string;
    class: string;
}

export default function BolPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { saveBol, saveBolTemplate } = useSchedule();
    const { toast } = useToast();
    const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [isBolNumberEditable, setIsBolNumberEditable] = useState(true);

    // State for all form fields
    const [shipperName, setShipperName] = useState('');
    const [shipperAddress, setShipperAddress] = useState('');
    const [shipperCity, setShipperCity] = useState('');
    const [shipperState, setShipperState] = useState('');
    const [shipperZip, setShipperZip] = useState('');
    const [shipperPhone, setShipperPhone] = useState('');

    const [consigneeName, setConsigneeName] = useState('');
    const [consigneeAddress, setConsigneeAddress] = useState('');
    const [consigneeCity, setConsigneeCity] = useState('');
    const [consigneeState, setConsigneeState] = useState('');
    const [consigneeZip, setConsigneeZip] = useState('');
    const [consigneePhone, setConsigneePhone] = useState('');
    const [consigneeContact, setConsigneeContact] = useState('');


    const [bolNumber, setBolNumber] = useState('');
    const [carrierName, setCarrierName] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [sealNumber, setSealNumber] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [refNumber, setRefNumber] = useState('');
    const [notes, setNotes] = useState('');

    const [commodities, setCommodities] = useState<Commodity[]>([]);
    
    useEffect(() => {
        const bol = searchParams.get('bolNumber');
        const cName = searchParams.get('consigneeName');
        const cAddress = searchParams.get('consigneeAddress');
        const cCity = searchParams.get('consigneeCity');
        const cState = searchParams.get('consigneeState');
        const cZip = searchParams.get('consigneeZip');
        const cPhone = searchParams.get('consigneePhone');
        const cContact = searchParams.get('consigneeContact');
        const formNotes = searchParams.get('notes');

        const items = searchParams.getAll('items');
        const quantities = searchParams.getAll('quantities');
        
        const existingCommodities = JSON.parse(sessionStorage.getItem('bolCommodities') || '[]');

        if (bol) {
            setBolNumber(bol);
            setIsBolNumberEditable(false);
        }
        if (cName) setConsigneeName(cName);
        if (cAddress) setConsigneeAddress(cAddress);
        if (cCity) setConsigneeCity(cCity);
        if (cState) setConsigneeState(cState);
        if (cZip) setConsigneeZip(cZip);
        if (cPhone) setConsigneePhone(cPhone);
        if (cContact) setConsigneeContact(cContact);
        if (formNotes) setNotes(formNotes);
        

        if (items.length > 0) {
            const initialCommodities = items.map((item, index) => ({
                id: Date.now() + index,
                units: quantities[index] || '1',
                pkgType: 'Pallet',
                hm: false,
                description: item,
                weight: '',
                class: ''
            }));
            setCommodities(initialCommodities);
            sessionStorage.setItem('bolCommodities', JSON.stringify(initialCommodities));
        } else if (existingCommodities.length > 0) {
            setCommodities(existingCommodities);
        } else {
            setCommodities([{ id: Date.now(), units: '', pkgType: '', hm: false, description: '', weight: '', class: '' }]);
        }
        
        const templateId = searchParams.get('templateId');
        if (templateId) {
            const templateData = sessionStorage.getItem(`bolTemplate_${templateId}`);
            if (templateData) {
                const template: BolTemplate = JSON.parse(templateData);
                setShipperName(template.shipper.name);
                setShipperAddress(template.shipper.address);
                setShipperCity(template.shipper.city);
                setShipperState(template.shipper.state);
                setShipperZip(template.shipper.zip);
                setShipperPhone(template.shipper.phone);
                setConsigneeName(template.consignee.name);
                setConsigneeAddress(template.consignee.address);
                setConsigneeCity(template.consignee.city);
                setConsigneeState(template.consignee.state);
                setConsigneeZip(template.consignee.zip);
                setConsigneePhone(template.consignee.phone);
            }
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddCommodity = () => {
        setCommodities(prev => [...prev, { id: Date.now(), units: '', pkgType: '', hm: false, description: '', weight: '', class: '' }]);
    };
    
    const handleRemoveCommodity = (id: number) => {
        setCommodities(prev => prev.filter(c => c.id !== id));
    };

    const handleCommodityChange = (id: number, field: keyof Commodity, value: string | boolean) => {
        setCommodities(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleSaveBol = () => {
        if (!bolNumber || !consigneeName || !carrierName) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out at least BOL Number, Consignee Name, and Carrier Name.'
            });
            return;
        }

        const newBol = {
            bolNumber,
            customer: consigneeName,
            origin: `${shipperCity}, ${shipperState}`,
            destination: `${consigneeCity}, ${consigneeState}`,
            deliveryDate: new Date().toISOString(), // Or a date picker
            carrier: carrierName,
            // In a real app, documentUri would come from an upload
        };

        const savedBol = saveBol(newBol);
        sessionStorage.removeItem('bolCommodities');
        
        toast({
            title: 'BOL Saved',
            description: `Bill of Lading ${savedBol.bolNumber} has been saved to history.`
        });
        
        router.push(`/dashboard/warehouse-hub-manager/bol/${savedBol.id}`);
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a name for the template.' });
            return;
        }

        const templateData: Omit<BolTemplate, 'id'> = {
            name: templateName,
            shipper: { name: shipperName, address: shipperAddress, city: shipperCity, state: shipperState, zip: shipperZip, phone: shipperPhone },
            consignee: { name: consigneeName, address: consigneeAddress, city: consigneeCity, state: consigneeState, zip: consigneeZip, phone: consigneePhone },
        };
        
        saveBolTemplate(templateData);
        toast({ title: 'Template Saved', description: `Template "${templateName}" has been saved.` });
        setIsSaveTemplateOpen(false);
        setTemplateName("");
    }

    const handleUseTemplate = () => {
        // Save current commodities to session storage before navigating
        sessionStorage.setItem('bolCommodities', JSON.stringify(commodities));
        router.push('/dashboard/warehouse-hub-manager/bol/templates');
    }

    const clearForm = () => {
        setShipperName('');
        setShipperAddress('');
        setShipperCity('');
        setShipperState('');
        setShipperZip('');
        setShipperPhone('');
        setConsigneeName('');
        setConsigneeAddress('');
        setConsigneeCity('');
        setConsigneeState('');
        setConsigneeZip('');
        setConsigneePhone('');
        setBolNumber('');
        setCarrierName('');
        setTrailerNumber('');
        setSealNumber('');
        setPoNumber('');
        setRefNumber('');
        setNotes('');
        setCommodities([{ id: Date.now(), units: '', pkgType: '', hm: false, description: '', weight: '', class: '' }]);
        sessionStorage.removeItem('bolCommodities');
        setIsBolNumberEditable(true);
        router.replace('/dashboard/warehouse-hub-manager/bol');
    }


    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Bill of Lading" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Master Bill of Lading</CardTitle>
                        <CardDescription>
                        Create a new Bill of Lading. Fill in the details below and save or print.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4 rounded-md border p-4">
                                <SectionTitle>Shipper / Consignor</SectionTitle>
                                <div className="space-y-2">
                                    <Label htmlFor="shipper-name">Name</Label>
                                    <Input id="shipper-name" placeholder="Enter shipper's name" value={shipperName} onChange={e => setShipperName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shipper-address">Address</Label>
                                    <Input id="shipper-address" placeholder="Enter shipper's address" value={shipperAddress} onChange={e => setShipperAddress(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-city">City</Label>
                                        <Input id="shipper-city" value={shipperCity} onChange={e => setShipperCity(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-state">State</Label>
                                        <Input id="shipper-state" value={shipperState} onChange={e => setShipperState(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-zip">Zip Code</Label>
                                        <Input id="shipper-zip" value={shipperZip} onChange={e => setShipperZip(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-phone">Phone</Label>
                                        <Input id="shipper-phone" type="tel" value={shipperPhone} onChange={e => setShipperPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-md border p-4">
                                <SectionTitle>Consignee</SectionTitle>
                                <div className="space-y-2">
                                    <Label htmlFor="consignee-name">Name</Label>
                                    <Input id="consignee-name" placeholder="Enter consignee's name" value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consignee-address">Address</Label>
                                    <Input id="consignee-address" placeholder="Enter consignee's address" value={consigneeAddress} onChange={e => setConsigneeAddress(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-city">City</Label>
                                        <Input id="consignee-city" value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-state">State</Label>
                                        <Input id="consignee-state" value={consigneeState} onChange={e => setConsigneeState(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-zip">Zip Code</Label>
                                        <Input id="consignee-zip" value={consigneeZip} onChange={e => setConsigneeZip(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-phone">Phone</Label>
                                        <Input id="consignee-phone" type="tel" value={consigneePhone} onChange={e => setConsigneePhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <SectionTitle>Shipment & Carrier Details</SectionTitle>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bol-number">BOL Number</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="bol-number" placeholder="Auto-generated or manual" value={bolNumber} onChange={(e) => setBolNumber(e.target.value)} readOnly={!isBolNumberEditable} />
                                        {!isBolNumberEditable && (
                                            <Button variant="ghost" size="icon" onClick={() => setIsBolNumberEditable(true)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carrier-name">Carrier Name</Label>
                                    <Input id="carrier-name" value={carrierName} onChange={e => setCarrierName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trailer-number">Trailer Number</Label>
                                    <Input id="trailer-number" value={trailerNumber} onChange={e => setTrailerNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seal-number">Seal Number</Label>
                                    <Input id="seal-number" value={sealNumber} onChange={e => setSealNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="po-number">P.O. Number</Label>
                                    <Input id="po-number" value={poNumber} onChange={e => setPoNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ref-number">Reference Number</Label>
                                    <Input id="ref-number" value={refNumber} onChange={e => setRefNumber(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        
                        <Separator />

                        <div className="space-y-4">
                            <SectionTitle>Commodities</SectionTitle>
                             {commodities.map((commodity, index) => (
                                <div key={commodity.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-end">
                                    <div className="col-span-2 sm:col-span-1 space-y-1">
                                        <Label>Units</Label>
                                        <Input type="number" placeholder="1" value={commodity.units} onChange={(e) => handleCommodityChange(commodity.id, 'units', e.target.value)} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-2 space-y-1">
                                        <Label>Pkg. Type</Label>
                                        <Input placeholder="Pallet" value={commodity.pkgType} onChange={(e) => handleCommodityChange(commodity.id, 'pkgType', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 flex items-center space-x-2 pb-2">
                                        <Checkbox id={`hm-${commodity.id}`} checked={commodity.hm} onCheckedChange={(checked) => handleCommodityChange(commodity.id, 'hm', !!checked)} />
                                        <Label htmlFor={`hm-${commodity.id}`} className="text-xs">HM</Label>
                                    </div>
                                    <div className="col-span-4 space-y-1">
                                        <Label>Description of Articles</Label>
                                        <Input placeholder="e.g. Canned Goods" value={commodity.description} onChange={(e) => handleCommodityChange(commodity.id, 'description', e.target.value)} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1">
                                        <Label>Weight</Label>
                                        <Input type="number" value={commodity.weight} onChange={(e) => handleCommodityChange(commodity.id, 'weight', e.target.value)} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1">
                                        <Label>Class</Label>
                                        <Input value={commodity.class} onChange={(e) => handleCommodityChange(commodity.id, 'class', e.target.value)} />
                                    </div>
                                     <div className="col-span-1 flex items-center pb-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveCommodity(commodity.id)}
                                            disabled={commodities.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={handleAddCommodity}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Line
                            </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <SectionTitle>Notes & Special Instructions</SectionTitle>
                            <div className="space-y-2">
                                <Textarea placeholder="Enter any special instructions for the carrier or consignee..." value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div>
                            <Button onClick={handleSaveBol}><Save className="mr-2"/>Save BOL</Button>
                            <Button variant="secondary" className="ml-2">Print BOL</Button>
                            <Button variant="ghost" onClick={clearForm}>Clear Form</Button>
                        </div>
                        <div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Template Task
                                        <MoreVertical className="ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsSaveTemplateOpen(true)}>Save Template</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleUseTemplate}>Use Template</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardFooter>
                </Card>

                <Dialog open={isSaveTemplateOpen} onOpenChange={setIsSaveTemplateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Save BOL Template</DialogTitle>
                            <DialogDescription>
                                Give your new template a name. This will save the current Shipper and Consignee information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="template-name" className="text-right">Template Name</Label>
                                <Input
                                    id="template-name"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g., Acme Inc. to Phoenix"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsSaveTemplateOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveTemplate}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
