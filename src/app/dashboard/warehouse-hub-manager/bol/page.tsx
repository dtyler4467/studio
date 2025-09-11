
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
    const [bolNumber, setBolNumber] = useState('');
    const [consigneeName, setConsigneeName] = useState('');
    const [consigneeCity, setConsigneeCity] = useState('');
    const [commodities, setCommodities] = useState<Commodity[]>([]);

    useEffect(() => {
        const bol = searchParams.get('bolNumber');
        const name = searchParams.get('consigneeName');
        const destination = searchParams.get('consigneeDestination');
        const items = searchParams.getAll('items');

        if (bol) setBolNumber(bol);
        if (name) setConsigneeName(name);
        if (destination) setConsigneeCity(destination);

        if (items.length > 0) {
            const initialCommodities = items.map((item, index) => ({
                id: Date.now() + index,
                units: '1',
                pkgType: 'Pallet',
                hm: false,
                description: item.replace(/ \(\d+ available\)/, ''), // Remove inventory count
                weight: '',
                class: ''
            }));
            setCommodities(initialCommodities);
        } else {
            setCommodities([{ id: Date.now(), units: '', pkgType: '', hm: false, description: '', weight: '', class: '' }]);
        }
    }, [searchParams]);
    
    const handleAddCommodity = () => {
        setCommodities(prev => [...prev, { id: Date.now(), units: '', pkgType: '', hm: false, description: '', weight: '', class: '' }]);
    };
    
    const handleRemoveCommodity = (id: number) => {
        setCommodities(prev => prev.filter(c => c.id !== id));
    };

    const handleCommodityChange = (id: number, field: keyof Commodity, value: string | boolean) => {
        setCommodities(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };


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
                                    <Input id="shipper-name" placeholder="Enter shipper's name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shipper-address">Address</Label>
                                    <Input id="shipper-address" placeholder="Enter shipper's address" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-city">City</Label>
                                        <Input id="shipper-city" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-state">State</Label>
                                        <Input id="shipper-state" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-zip">Zip Code</Label>
                                        <Input id="shipper-zip" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipper-phone">Phone</Label>
                                        <Input id="shipper-phone" type="tel" />
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
                                    <Input id="consignee-address" placeholder="Enter consignee's address" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-city">City</Label>
                                        <Input id="consignee-city" value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-state">State</Label>
                                        <Input id="consignee-state" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-zip">Zip Code</Label>
                                        <Input id="consignee-zip" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="consignee-phone">Phone</Label>
                                        <Input id="consignee-phone" type="tel" />
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
                                    <Input id="bol-number" placeholder="Auto-generated or manual" value={bolNumber} onChange={(e) => setBolNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carrier-name">Carrier Name</Label>
                                    <Input id="carrier-name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trailer-number">Trailer Number</Label>
                                    <Input id="trailer-number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seal-number">Seal Number</Label>
                                    <Input id="seal-number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="po-number">P.O. Number</Label>
                                    <Input id="po-number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ref-number">Reference Number</Label>
                                    <Input id="ref-number" />
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
                                <Textarea placeholder="Enter any special instructions for the carrier or consignee..." />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button>Save as Template</Button>
                        <Button variant="secondary">Print BOL</Button>
                        <Button variant="ghost">Clear Form</Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}

    