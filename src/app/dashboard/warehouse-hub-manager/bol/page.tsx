

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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';


type Commodity = {
    id: number;
    handlingQty: string;
    handlingType: string;
    packageQty: string;
    packageType: string;
    hm: boolean;
    description: string;
    weight: string;
    nmfc: string;
    class: string;
}

type CustomerOrder = {
    id: number;
    orderNumber: string;
    packages: string;
    weight: string;
    palletSlip: 'Y' | 'N' | '';
    additionalInfo: string;
}

type BOLPage = {
    id: number;
    customerOrders: CustomerOrder[];
    commodities: Commodity[];
}

const MAX_ITEMS_PER_PAGE = 8;

const generateBolHtml = (formData: any, pages: BOLPage[]) => {
    const totalPages = pages.length;

    return pages.map((page, pageIndex) => {
         const {
            shipperName, shipperAddress, shipperCity, shipperState, shipperZip, shipperSid,
            consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeZip, consigneeCid, location,
            thirdPartyName, thirdPartyAddress, thirdPartyCity, thirdPartyState, thirdPartyZip,
            bolDate, bolNumber, carrierName, trailerNumber, sealNumber, scac, proNumber,
            specialInstructions, freightCharge, masterBol,
            codAmount, feeTerms, customerCheck,
            shipperSignature, shipperDate, trailerLoaded, freightCounted, carrierSignature, carrierDate
        } = formData;

        const commoditiesHtml = page.commodities.map((c: Commodity) => `
            <tr>
                <td>${c.handlingQty || ''}</td>
                <td>${c.handlingType || ''}</td>
                <td>${c.packageQty || ''}</td>
                <td>${c.packageType || ''}</td>
                <td>${c.weight || ''}</td>
                <td class="text-center">${c.hm ? 'X' : ''}</td>
                <td class="commodity-desc">${c.description || ''}</td>
                <td>${c.nmfc || ''}</td>
                <td>${c.class || ''}</td>
            </tr>
        `).join('');

        const customerOrdersHtml = page.customerOrders.map((o: CustomerOrder) => `
            <tr>
                <td>${o.orderNumber || ''}</td>
                <td>${o.packages || ''}</td>
                <td>${o.weight || ''}</td>
                <td class="text-center">${o.palletSlip === 'Y' ? '(Y)' : o.palletSlip === 'N' ? '(N)' : ''}</td>
                <td>${o.additionalInfo || ''}</td>
            </tr>
        `).join('');

        const grandTotalCommodities = `<tr><td colspan="4" class="text-right font-bold pr-2">GRAND TOTAL</td><td>${pages.flat().reduce((acc: number, p) => acc + p.commodities.reduce((subAcc: number, c: Commodity) => subAcc + (parseFloat(c.weight) || 0), 0), 0)}</td><td></td><td></td><td></td><td></td></tr>`
        const grandTotalCustomer = `<tr><td class="text-right font-bold pr-2">GRAND TOTAL</td><td>${pages.flat().reduce((acc: number, p) => acc + p.customerOrders.reduce((subAcc: number, o: CustomerOrder) => subAcc + (parseInt(o.packages) || 0), 0), 0)}</td><td>${pages.flat().reduce((acc: number, p) => acc + p.customerOrders.reduce((subAcc: number, o: CustomerOrder) => subAcc + (parseFloat(o.weight) || 0), 0), 0)}</td><td></td><td></td></tr>`

        const pageStyle = pageIndex < totalPages - 1 ? 'page-break-after: always;' : '';

        return `
            <div class="page" style="${pageStyle}">
                <div class="header">
                    <p>II. The Standard Bill of Lading Form</p>
                    <p>VICS Standard BOL: WWW.VICS.ORG For Complete VICS BOL Guideline Information</p>
                    <div class="flex justify-between items-end" style="margin-top: 8px;">
                         <div style="width: 20%;">Date: <span style="border-bottom: 1px solid black; padding: 0 10px;">${bolDate}</span></div>
                         <h1 style="width: 60%;">BILL OF LADING</h1>
                         <div style="width: 20%;">Page: <span style="border-bottom: 1px solid black; padding: 0 10px;">${pageIndex + 1} of ${totalPages}</span></div>
                    </div>
                </div>

                <div class="grid" style="margin-top: 8px;">
                    <div class="col-span-8">
                        <div class="grid grid-cols-1 gap-2">
                             <div class="section">
                                <div class="section-title">Ship From</div>
                                <div class="field"><label>Name:</label><span>${shipperName || ''}</span></div>
                                <div class="field"><label>Address:</label><span>${shipperAddress || ''}</span></div>
                                <div class="field"><label>City/State/Zip:</label><span>${shipperCity ? `${shipperCity}, ${shipperState} ${shipperZip}` : ''}</span></div>
                                <div class="flex justify-between mt-2"><div class="field"><label>SID#:</label><span>${shipperSid || ''}</span></div><div class="field"><label>FOB:</label><span></span></div></div>
                            </div>
                             <div class="section">
                                <div class="section-title">Ship To</div>
                                <div class="field"><label>Name:</label><span>${consigneeName || ''}</span></div>
                                <div class="field"><label>Address:</label><span>${consigneeAddress || ''}</span></div>
                                <div class="field"><label>City/State/Zip:</label><span>${consigneeCity ? `${consigneeCity}, ${consigneeState} ${consigneeZip}` : ''}</span></div>
                                <div class="flex justify-between mt-2"><div class="field"><label>CID#:</label><span>${consigneeCid || ''}</span></div><div class="field"><label>Location #:</label><span>${location || ''}</span></div><div class="field"><label>FOB:</label><span></span></div></div>
                            </div>
                             <div class="section">
                                <div class="section-title">Third Party Freight Charges Bill To</div>
                                <div class="field"><label>Name:</label><span>${thirdPartyName || ''}</span></div>
                                <div class="field"><label>Address:</label><span>${thirdPartyAddress || ''}</span></div>
                                <div class="field"><label>City/State/Zip:</label><span>${thirdPartyCity ? `${thirdPartyCity}, ${thirdPartyState} ${thirdPartyZip}` : ''}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4">
                         <div class="grid grid-cols-1 gap-2">
                             <div class="section h-full">
                                <div class="field"><label>Bill of Lading Number:</label><span>${bolNumber}</span></div>
                                <div class="text-center" style="height: 60px; border: 1px dashed #ccc; margin-top: 10px;">BAR CODE SPACE</div>
                            </div>
                             <div class="section">
                                <div class="field"><label>Carrier Name:</label><span>${carrierName}</span></div>
                                <div class="field"><label>Trailer Number:</label><span>${trailerNumber}</span></div>
                                <div class="field"><label>Seal Number(s):</label><span>${sealNumber}</span></div>
                                <div class="field"><label>SCAC:</label><span>${scac}</span></div>
                                <div class="field"><label>Pro Number:</label><span>${proNumber}</span></div>
                                <div class="text-center" style="height: 60px; border: 1px dashed #ccc; margin-top: 10px;">BAR CODE SPACE</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 mt-2">
                    <div class="col-span-8 section">
                         <div class="section-title">Special Instructions</div>
                         <div style="height: 90px;">${specialInstructions || ''}</div>
                    </div>
                     <div class="col-span-4 section">
                        <div class="section-title">Freight Charge Terms</div>
                        <div style="padding-top: 4px;">
                            <div class="checkbox-container"><div class="checkbox ${freightCharge === 'Prepaid' ? 'checked' : ''}"></div> Prepaid</div>
                            <div class="checkbox-container"><div class="checkbox ${freightCharge === 'Collect' ? 'checked' : ''}"></div> Collect</div>
                            <div class="checkbox-container"><div class="checkbox ${freightCharge === '3rd Party' ? 'checked' : ''}"></div> 3rd Party</div>
                        </div>
                        <div class="checkbox-container mt-2"><div class="checkbox ${masterBol ? 'checked' : ''}"></div> Master Bill of Lading</div>
                    </div>
                </div>

                <div class="section mt-2">
                    <div class="section-title">Customer Order Information</div>
                    <table><thead><tr><th>Customer Order Number</th><th># Pkgs</th><th>Weight</th><th>Pallet/Slip (Y/N)</th><th>Additional Shipper Info</th></tr></thead><tbody>
                        ${customerOrdersHtml}
                        ${pageIndex === totalPages - 1 && page.customerOrders.length > 0 ? grandTotalCustomer : ''}
                    </tbody></table>
                </div>

                <div class="section mt-2">
                    <div class="section-title">Carrier Information</div>
                     <table><thead><tr><th colspan="2">Handling Unit</th><th colspan="2">Package</th><th rowspan="2">Weight</th><th rowspan="2">H.M.</th><th rowspan="2">Commodity Description</th><th colspan="2">LTL Only</th></tr><tr><th>Qty</th><th>Type</th><th>Qty</th><th>Type</th><th>NMFC #</th><th>Class</th></tr></thead><tbody>
                        ${commoditiesHtml}
                        ${pageIndex === totalPages - 1 && page.commodities.length > 0 ? grandTotalCommodities : ''}
                    </tbody></table>
                </div>
                
                <div style="flex-grow: 1;"></div>
                
                 <div class="grid grid-cols-12 gap-2 mt-auto">
                    <div class="col-span-7 section">
                        <p style="font-size: 7pt; margin: 0;">Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property as follows:</p>
                        <p style="font-size: 7pt; margin: 4px 0;">"The agreed or declared value of the property is specifically stated by the shipper to be not exceeding <span style="border-bottom: 1px solid black; padding: 0 40px;"></span> per <span style="border-bottom: 1px solid black; padding: 0 40px;"></span>"</p>
                        <p style="font-size: 7pt; margin: 0; font-weight: bold;">NOTE: Liability Limitation for loss or damage in this shipment may be applicable. See 49 U.S.C. § 14706(c)(1)(A) and (B).</p>
                    </div>
                    <div class="col-span-5 section">
                        <div class="field"><label>COD Amount: $</label><span>${codAmount || ''}</span></div>
                        <div class="flex justify-between">
                            <span>Fee Terms:</span>
                             <div class="checkbox-container"><div class="checkbox ${feeTerms === 'Collect' ? 'checked' : ''}"></div> Collect</div>
                            <div class="checkbox-container"><div class="checkbox ${feeTerms === 'Prepaid' ? 'checked' : ''}"></div> Prepaid</div>
                        </div>
                        <div class="checkbox-container mt-2"><div class="checkbox ${customerCheck ? 'checked' : ''}"></div> Customer check acceptable</div>
                    </div>
                </div>

                 <div class="section mt-2">
                     <p style="font-size: 6.5pt; margin: 0;">RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper, if applicable, otherwise to the rates, classifications and rules that have been established by the carrier and are available to the shipper, on request; and to all applicable state and federal regulations.</p>
                </div>
                 <div class="grid grid-cols-2 gap-2 mt-2">
                     <div class="section">
                        <div class="section-title">Shipper Signature / Date</div>
                        <div style="font-size: 6.5pt; padding: 2px;">This is to certify that the above named materials are properly classified, described, packaged, marked and labeled, and are in proper condition for transportation according to the applicable regulations of the U.S. DOT.</div>
                        <div class="flex justify-between items-end mt-2">
                            <div class="w-1/3">
                                <p style="margin-top: 10px; border-bottom: 1px solid black;">&nbsp;</p>
                                <label style="font-size: 7pt;">Shipper</label>
                            </div>
                            <div class="w-1/3">
                                <p style="margin-top: 10px; border-bottom: 1px solid black;">&nbsp;</p>
                                <label style="font-size: 7pt;">Date</label>
                            </div>
                        </div>
                    </div>
                     <div class="section">
                        <div class="section-title">Carrier Signature / Pickup Date</div>
                        <div style="font-size: 6.5pt; padding: 2px;">Carrier acknowledges receipt of packages and required placards. Carrier certifies emergency response information was made available and/or carrier has the U.S. DOT emergency response guidebook or equivalent documentation in the vehicle.</div>
                        <div class="flex justify-between items-end mt-2">
                            <div class="w-1/3">
                                <p style="margin-top: 10px; border-bottom: 1px solid black;">&nbsp;</p>
                                <label style="font-size: 7pt;">Carrier</label>
                            </div>
                            <div class="w-1/3">
                                <p style="margin-top: 10px; border-bottom: 1px solid black;">&nbsp;</p>
                                <label style="font-size: 7pt;">Date</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

const generateHtmlShell = (content: string) => {
    return `
       <!DOCTYPE html>
        <html>
        <head>
            <title>Bill of Lading</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 8pt; line-height: 1.2; color: #333; background-color: #fff; margin: 0; }
                .page { width: 8.5in; min-height: 11in; padding: 0.5in; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; }
                .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 4px; }
                .header p { margin: 0; font-size: 7pt; }
                .header h1 { margin: 2px 0; font-size: 16pt; }
                .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 8px; }
                .col-span-8 { grid-column: span 8 / span 8; }
                .col-span-4 { grid-column: span 4 / span 4; }
                .section { border: 1px solid black; padding: 4px; }
                .section-title { font-weight: bold; font-size: 7pt; text-align: center; background-color: #f2f2f2; padding: 2px; border-bottom: 1px solid black; text-transform: uppercase; }
                .field { margin-bottom: 4px; }
                .field label { font-weight: bold; font-size: 6.5pt; display: block; }
                .field span, .field div { border-bottom: 1px dotted #ccc; padding: 1px 2px; min-height: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 4px; }
                th, td { border: 1px solid black; padding: 3px; vertical-align: top; }
                th { font-size: 7pt; background-color: #f2f2f2; text-align: center; }
                td { height: 18px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: bold; }
                .pr-2 { padding-right: 8px; }
                .commodity-desc { min-height: 25px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-end { align-items: flex-end; }
                .w-1/3 { width: 33.33%; }
                .w-full { width: 100%; }
                .mt-2 { margin-top: 8px; }
                .checkbox-container { display: flex; align-items: center; gap: 4px; }
                .checkbox { width: 10px; height: 10px; border: 1px solid black; }
                .checkbox.checked { background-color: black; }
                 @media print {
                    .page {
                        margin: 0;
                        border: none;
                        border-radius: 0;
                        width: auto;
                        min-height: initial;
                        box-shadow: none;
                        background: initial;
                        page-break-after: always;
                    }
                }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
};


export default function BolPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { saveBol, saveBolTemplate } = useSchedule();
    const { toast } = useToast();
    const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    
    // Form State
    const [bolDate, setBolDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [shipperName, setShipperName] = useState('');
    const [shipperAddress, setShipperAddress] = useState('');
    const [shipperCity, setShipperCity] = useState('');
    const [shipperState, setShipperState] = useState('');
    const [shipperZip, setShipperZip] = useState('');
    const [shipperSid, setShipperSid] = useState('');

    const [consigneeName, setConsigneeName] = useState('');
    const [consigneeAddress, setConsigneeAddress] = useState('');
    const [consigneeCity, setConsigneeCity] = useState('');
    const [consigneeState, setConsigneeState] = useState('');
    const [consigneeZip, setConsigneeZip] = useState('');
    const [consigneeCid, setConsigneeCid] = useState('');
    const [location, setLocation] = useState('');

    const [thirdPartyName, setThirdPartyName] = useState('');
    const [thirdPartyAddress, setThirdPartyAddress] = useState('');
    const [thirdPartyCity, setThirdPartyCity] = useState('');
    const [thirdPartyState, setThirdPartyState] = useState('');
    const [thirdPartyZip, setThirdPartyZip] = useState('');
    
    const [bolNumber, setBolNumber] = useState('');
    const [carrierName, setCarrierName] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [sealNumber, setSealNumber] = useState('');
    const [scac, setScac] = useState('');
    const [proNumber, setProNumber] = useState('');

    const [specialInstructions, setSpecialInstructions] = useState('');
    const [freightCharge, setFreightCharge] = useState<'Prepaid' | 'Collect' | '3rd Party' | null>('Prepaid');
    const [masterBol, setMasterBol] = useState(false);
    
    const [pages, setPages] = useState<BOLPage[]>([{ id: Date.now(), customerOrders: [], commodities: [] }]);
    
    const [codAmount, setCodAmount] = useState('');
    const [feeTerms, setFeeTerms] = useState<'Collect' | 'Prepaid' | null>(null);
    const [customerCheck, setCustomerCheck] = useState(false);

    const [shipperSignature, setShipperSignature] = useState('');
    const [shipperDate, setShipperDate] = useState('');
    const [trailerLoaded, setTrailerLoaded] = useState<'shipper' | 'driver' | null>(null);
    const [freightCounted, setFreightCounted] = useState<'shipper' | 'driver_pallets' | 'driver_pieces' | null>(null);
    const [carrierSignature, setCarrierSignature] = useState('');
    const [carrierDate, setCarrierDate] = useState('');
    
    useEffect(() => {
        const cName = searchParams.get('consigneeName');
        if (cName) setConsigneeName(cName);
        
        const items = searchParams.getAll('items');
        const quantities = searchParams.getAll('quantities');
        if (items.length > 0) {
            const initialCommodities = items.map((item, index) => ({
                id: Date.now() + index,
                description: item,
                handlingQty: quantities[index] || '1',
                handlingType: 'Pallet',
                packageQty: '',
                packageType: '',
                hm: false,
                weight: '',
                nmfc: '',
                class: ''
            }));
            setPages([{ id: Date.now(), customerOrders: [], commodities: initialCommodities }]);
        } else {
             setPages([{ id: Date.now(), customerOrders: [{ id: Date.now(), orderNumber: '', packages: '', weight: '', palletSlip: '', additionalInfo: ''}], commodities: [{ id: Date.now(), handlingQty: '', handlingType: '', packageQty: '', packageType: '', hm: false, description: '', weight: '', nmfc: '', class: '' }] }]);
        }
    }, [searchParams]);

    const updatePageState = (pageId: number, itemType: 'commodities' | 'customerOrders', newItems: any[]) => {
        setPages(prevPages => {
            let newPages = prevPages.map(p => 
                p.id === pageId ? { ...p, [itemType]: newItems } : p
            );

            // Check if we need to add a new page
            const lastPage = newPages[newPages.length - 1];
            if (lastPage.commodities.length >= MAX_ITEMS_PER_PAGE || lastPage.customerOrders.length >= MAX_ITEMS_PER_PAGE) {
                newPages = [...newPages, { id: Date.now(), customerOrders: [], commodities: [] }];
            }

            return newPages;
        });
    };

    const handleAddCommodity = (pageId: number) => {
        const pageIndex = pages.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return;

        const targetPageId = pages[pages.length -1].id;

        const newCommodities = [...pages[pages.length - 1].commodities, { id: Date.now(), handlingQty: '', handlingType: '', packageQty: '', packageType: '', hm: false, description: '', weight: '', nmfc: '', class: '' }];
        updatePageState(targetPageId, 'commodities', newCommodities);
    };
    
    const handleRemoveCommodity = (pageId: number, commodityId: number) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        const newCommodities = page.commodities.filter(c => c.id !== commodityId);
        updatePageState(pageId, 'commodities', newCommodities);
    };

    const handleCommodityChange = (pageId: number, commodityId: number, field: keyof Commodity, value: string | boolean) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        const newCommodities = page.commodities.map(c => c.id === commodityId ? { ...c, [field]: value } : c);
        updatePageState(pageId, 'commodities', newCommodities);
    };

    const handleAddCustomerOrder = (pageId: number) => {
        const pageIndex = pages.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return;
        
        const targetPageId = pages[pages.length - 1].id;

        const newOrders = [...pages[pages.length - 1].customerOrders, { id: Date.now(), orderNumber: '', packages: '', weight: '', palletSlip: '', additionalInfo: ''}];
        updatePageState(targetPageId, 'customerOrders', newOrders);
    };
    
    const handleRemoveCustomerOrder = (pageId: number, orderId: number) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        const newOrders = page.customerOrders.filter(o => o.id !== orderId);
        updatePageState(pageId, 'customerOrders', newOrders);
    };

    const handleCustomerOrderChange = (pageId: number, orderId: number, field: keyof Omit<CustomerOrder, 'id'>, value: string) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        const newOrders = page.customerOrders.map(o => o.id === orderId ? { ...o, [field]: value } : o);
        updatePageState(pageId, 'customerOrders', newOrders);
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

        const formData = {
            shipperName, shipperAddress, shipperCity, shipperState, shipperZip, shipperSid,
            consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeZip, consigneeCid, location,
            thirdPartyName, thirdPartyAddress, thirdPartyCity, thirdPartyState, thirdPartyZip,
            bolDate, bolNumber, carrierName, trailerNumber, sealNumber, scac, proNumber,
            specialInstructions, freightCharge, masterBol,
            codAmount, feeTerms, customerCheck,
            shipperSignature, shipperDate, trailerLoaded, freightCounted, carrierSignature, carrierDate
        };
        
        const wb = XLSX.utils.book_new();

        // Create a worksheet
        const ws_data = [
            ["BILL OF LADING"],
            [],
            ["Date:", bolDate, "", "BOL Number:", bolNumber],
            [],
            ["SHIP FROM", "", "", "SHIP TO"],
            ["Name:", shipperName, "", "Name:", consigneeName],
            ["Address:", shipperAddress, "", "Address:", consigneeAddress],
            ["City/State/Zip:", `${shipperCity}, ${shipperState} ${shipperZip}`, "", "City/State/Zip:", `${consigneeCity}, ${consigneeState} ${consigneeZip}`],
            [],
            ["CARRIER & SHIPMENT DETAILS"],
            ["Carrier Name:", carrierName, "", "Trailer #:", trailerNumber],
            ["SCAC:", scac, "", "Seal #:", sealNumber],
            [],
            ["CUSTOMER ORDER INFORMATION"],
            ["Order Number", "# Pkgs", "Weight", "Pallet/Slip", "Additional Info"],
            ...pages.flatMap(p => p.customerOrders).map(o => [o.orderNumber, o.packages, o.weight, o.palletSlip, o.additionalInfo]),
            [],
            ["COMMODITIES"],
            ["Handling Qty", "Handling Type", "Package Qty", "Package Type", "Weight", "HM", "Description", "NMFC", "Class"],
            ...pages.flatMap(p => p.commodities).map(c => [c.handlingQty, c.handlingType, c.packageQty, c.packageType, c.weight, c.hm ? "X" : "", c.description, c.nmfc, c.class]),
            [],
            ["Special Instructions:", specialInstructions]
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Bill of Lading");

        // Generate the file and trigger download
        XLSX.writeFile(wb, `BOL_${bolNumber}.xlsx`);


        const newBolDataForHistory = {
            bolNumber,
            customer: consigneeName,
            origin: `${shipperCity}, ${shipperState}`,
            destination: `${consigneeCity}, ${consigneeState}`,
            deliveryDate: format(new Date(), 'yyyy-MM-dd'),
            carrier: carrierName,
        };

        const savedBol = saveBol(newBolDataForHistory, null); // No HTML document URI needed now
        
        toast({
            title: 'BOL Saved & Downloaded',
            description: `BOL ${bolNumber} has been downloaded as an Excel file and saved to history.`
        });
        
        router.push(`/dashboard/warehouse-hub-manager/bol/history`);
    };

    const handleUseTemplate = () => {
        router.push('/dashboard/warehouse-hub-manager/bol/templates');
    }

    const clearForm = () => {
        router.replace('/dashboard/warehouse-hub-manager/bol');
        window.location.reload();
    }


    return (
        <div className="flex flex-col w-full bg-gray-100">
            <Header pageTitle="Create Bill of Lading" />
            <main className="flex-1 p-4 md:p-8 space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm sticky top-0 z-10">
                    <h2 className="text-xl font-bold">Bill of Lading</h2>
                    <div className="flex gap-2">
                         <Button onClick={handleSaveBol}><Save className="mr-2"/>Save BOL</Button>
                         <Button variant="outline" onClick={clearForm}>Clear Form</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Template
                                    <MoreVertical className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {}}>Save as Template</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleUseTemplate}>Use Template</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {pages.map((page, pageIndex) => (
                    <div key={page.id} className="bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto" id={`bol-form-page-${pageIndex}`}>
                        {/* Header */}
                        <div className="text-center border-b-2 border-black pb-1 mb-2">
                            <p className="text-xs">II. The Standard Bill of Lading Form</p>
                            <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Date:</label>
                                    <Input type="date" value={bolDate} onChange={e => setBolDate(e.target.value)} className="h-7 text-xs"/>
                                </div>
                                <h1 className="text-2xl font-bold font-headline">BILL OF LADING</h1>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Page:</label>
                                    <Input value={`${pageIndex + 1} of ${pages.length}`} readOnly className="w-20 h-7 text-xs text-center" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Main Grid */}
                        <div className="grid grid-cols-12 gap-2">
                            {/* Left Column */}
                            <div className="col-span-8 flex flex-col gap-2">
                                <div className="border border-black p-2 space-y-1">
                                    <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">SHIP FROM</h4>
                                    <Input placeholder="Name" value={shipperName} onChange={e => setShipperName(e.target.value)} />
                                    <Input placeholder="Address" value={shipperAddress} onChange={e => setShipperAddress(e.target.value)} />
                                    <div className="flex gap-2">
                                        <Input placeholder="City" className="flex-1" value={shipperCity} onChange={e => setShipperCity(e.target.value)} />
                                        <Input placeholder="State" className="w-16" value={shipperState} onChange={e => setShipperState(e.target.value)} />
                                        <Input placeholder="Zip" className="w-24" value={shipperZip} onChange={e => setShipperZip(e.target.value)} />
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <Input placeholder="SID#" className="w-1/2" value={shipperSid} onChange={e => setShipperSid(e.target.value)} />
                                        <Input placeholder="FOB" className="w-1/3" />
                                    </div>
                                </div>
                                <div className="border border-black p-2 space-y-1">
                                    <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">SHIP TO</h4>
                                    <Input placeholder="Name" value={consigneeName} onChange={e => setConsigneeName(e.target.value)} />
                                    <Input placeholder="Address" value={consigneeAddress} onChange={e => setConsigneeAddress(e.target.value)} />
                                    <div className="flex gap-2">
                                        <Input placeholder="City" className="flex-1" value={consigneeCity} onChange={e => setConsigneeCity(e.target.value)} />
                                        <Input placeholder="State" className="w-16" value={consigneeState} onChange={e => setConsigneeState(e.target.value)} />
                                        <Input placeholder="Zip" className="w-24" value={consigneeZip} onChange={e => setConsigneeZip(e.target.value)} />
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <Input placeholder="CID#" className="w-1/3" value={consigneeCid} onChange={e => setConsigneeCid(e.target.value)} />
                                        <Input placeholder="Location #" className="w-1/3" value={location} onChange={e => setLocation(e.target.value)} />
                                        <Input placeholder="FOB" className="w-1/4" />
                                    </div>
                                </div>
                                <div className="border border-black p-2 space-y-1">
                                    <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">THIRD PARTY FREIGHT CHARGES BILL TO</h4>
                                    <Input placeholder="Name" value={thirdPartyName} onChange={e => setThirdPartyName(e.target.value)} />
                                    <Input placeholder="Address" value={thirdPartyAddress} onChange={e => setThirdPartyAddress(e.target.value)} />
                                    <div className="flex gap-2">
                                        <Input placeholder="City" className="flex-1" value={thirdPartyCity} onChange={e => setThirdPartyCity(e.target.value)} />
                                        <Input placeholder="State" className="w-16" value={thirdPartyState} onChange={e => setThirdPartyState(e.target.value)} />
                                        <Input placeholder="Zip" className="w-24" value={thirdPartyZip} onChange={e => setThirdPartyZip(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="border border-black p-2 space-y-1 flex-grow">
                                    <Label>Bill of Lading Number</Label>
                                    <Input value={bolNumber} onChange={e => setBolNumber(e.target.value)} />
                                    <div className="h-16 border-dashed border-2 mt-2 flex items-center justify-center text-muted-foreground text-sm">BAR CODE SPACE</div>
                                </div>
                                <div className="border border-black p-2 space-y-1">
                                    <Label>Carrier Name</Label>
                                    <Input value={carrierName} onChange={e => setCarrierName(e.target.value)} />
                                    <div className="flex gap-2 mt-1">
                                        <div className="w-1/2">
                                            <Label>Trailer #</Label>
                                            <Input value={trailerNumber} onChange={e => setTrailerNumber(e.target.value)} />
                                        </div>
                                        <div className="w-1/2">
                                            <Label>Seal(s)</Label>
                                            <Input value={sealNumber} onChange={e => setSealNumber(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <div className="w-1/2">
                                            <Label>SCAC</Label>
                                            <Input value={scac} onChange={e => setScac(e.target.value)} />
                                        </div>
                                        <div className="w-1/2">
                                            <Label>Pro #</Label>
                                            <Input value={proNumber} onChange={e => setProNumber(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="h-16 border-dashed border-2 mt-2 flex items-center justify-center text-muted-foreground text-sm">BAR CODE SPACE</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2 mt-2">
                            <div className="col-span-8 border border-black p-2">
                                <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">SPECIAL INSTRUCTIONS</h4>
                                <Textarea className="h-24" value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} />
                            </div>
                            <div className="col-span-4 border border-black p-2">
                                <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">FREIGHT CHARGE TERMS</h4>
                                <div className="flex flex-col space-y-1 text-sm mt-2">
                                    <div className="flex items-center gap-2"><Checkbox id="prepaid" checked={freightCharge === 'Prepaid'} onCheckedChange={() => setFreightCharge('Prepaid')} /> <Label htmlFor="prepaid">Prepaid</Label></div>
                                    <div className="flex items-center gap-2"><Checkbox id="collect" checked={freightCharge === 'Collect'} onCheckedChange={() => setFreightCharge('Collect')} /> <Label htmlFor="collect">Collect</Label></div>
                                    <div className="flex items-center gap-2"><Checkbox id="thirdparty" checked={freightCharge === '3rd Party'} onCheckedChange={() => setFreightCharge('3rd Party')} /> <Label htmlFor="thirdparty">3rd Party</Label></div>
                                    <div className="flex items-center gap-2 mt-2"><Checkbox id="masterbol" checked={masterBol} onCheckedChange={(c) => setMasterBol(c as boolean)} /> <Label htmlFor="masterbol">Master BOL</Label></div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-black p-2 mt-2">
                            <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">CUSTOMER ORDER INFORMATION</h4>
                            <table className="w-full text-xs mt-1">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border p-1">CUSTOMER ORDER NUMBER</th>
                                        <th className="border p-1"># PKGS</th>
                                        <th className="border p-1">WEIGHT</th>
                                        <th className="border p-1">PALLET/SLIP (Y/N)</th>
                                        <th className="border p-1">ADDITIONAL SHIPPER INFO</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.customerOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="border"><Input className="text-xs h-7" value={order.orderNumber} onChange={e => handleCustomerOrderChange(page.id, order.id, 'orderNumber', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={order.packages} onChange={e => handleCustomerOrderChange(page.id, order.id, 'packages', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={order.weight} onChange={e => handleCustomerOrderChange(page.id, order.id, 'weight', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={order.palletSlip} onChange={e => handleCustomerOrderChange(page.id, order.id, 'palletSlip', e.target.value as any)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={order.additionalInfo} onChange={e => handleCustomerOrderChange(page.id, order.id, 'additionalInfo', e.target.value)} /></td>
                                        <td className="text-center"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCustomerOrder(page.id, order.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {pageIndex === pages.length - 1 && <Button variant="outline" size="sm" className="mt-1" onClick={() => handleAddCustomerOrder(page.id)}><PlusCircle className="h-4 w-4 mr-2" />Add Order</Button>}
                        </div>

                        <div className="border border-black p-2 mt-2">
                            <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">CARRIER INFORMATION</h4>
                            <table className="w-full text-xs mt-1">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th colSpan={2} className="border p-1">HANDLING UNIT</th>
                                        <th colSpan={2} className="border p-1">PACKAGE</th>
                                        <th rowSpan={2} className="border p-1">WEIGHT</th>
                                        <th rowSpan={2} className="border p-1">H.M.</th>
                                        <th rowSpan={2} className="border p-1 w-2/5">COMMODITY DESCRIPTION</th>
                                        <th colSpan={2} className="border p-1">LTL ONLY</th>
                                        <th rowSpan={2} className="w-10"></th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border p-1">QTY</th><th className="border p-1">TYPE</th>
                                        <th className="border p-1">QTY</th><th className="border p-1">TYPE</th>
                                        <th className="border p-1">NMFC#</th><th className="border p-1">CLASS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.commodities.map(item => (
                                    <tr key={item.id}>
                                        <td className="border"><Input className="text-xs h-7" value={item.handlingQty} onChange={e => handleCommodityChange(page.id, item.id, 'handlingQty', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.handlingType} onChange={e => handleCommodityChange(page.id, item.id, 'handlingType', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.packageQty} onChange={e => handleCommodityChange(page.id, item.id, 'packageQty', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.packageType} onChange={e => handleCommodityChange(page.id, item.id, 'packageType', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.weight} onChange={e => handleCommodityChange(page.id, item.id, 'weight', e.target.value)} /></td>
                                        <td className="border text-center"><Checkbox checked={item.hm} onCheckedChange={c => handleCommodityChange(page.id, item.id, 'hm', c as boolean)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.description} onChange={e => handleCommodityChange(page.id, item.id, 'description', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.nmfc} onChange={e => handleCommodityChange(page.id, item.id, 'nmfc', e.target.value)} /></td>
                                        <td className="border"><Input className="text-xs h-7" value={item.class} onChange={e => handleCommodityChange(page.id, item.id, 'class', e.target.value)} /></td>
                                        <td className="text-center"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCommodity(page.id, item.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {pageIndex === pages.length - 1 && <Button variant="outline" size="sm" className="mt-1" onClick={() => handleAddCommodity(page.id)}><PlusCircle className="h-4 w-4 mr-2" />Add Commodity</Button>}
                        </div>

                        {/* Footer Sections */}
                        {pageIndex === pages.length - 1 && (
                            <>
                                <div className="grid grid-cols-12 gap-2 mt-2">
                                    <div className="col-span-7 border border-black p-2 space-y-1 text-xs">
                                        <p>Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property as follows:</p>
                                        <p className="italic">"The agreed or declared value of the property is specifically stated by the shipper to be not exceeding <Input className="inline-block w-20 h-5 text-xs"/> per <Input className="inline-block w-20 h-5 text-xs"/>"</p>
                                        <p className="font-bold">NOTE: Liability Limitation for loss or damage may be applicable.</p>
                                    </div>
                                    <div className="col-span-5 border border-black p-2 space-y-1">
                                        <div className="flex items-center gap-2"><Label>COD Amount: $</Label><Input className="h-7 text-sm" value={codAmount} onChange={e => setCodAmount(e.target.value)}/></div>
                                        <div className="flex items-center gap-4 text-sm"><Label>Fee Terms:</Label>
                                            <div className="flex items-center gap-1"><Checkbox id="fee_collect" checked={feeTerms === 'Collect'} onCheckedChange={() => setFeeTerms('Collect')} /> <Label htmlFor="fee_collect">Collect</Label></div>
                                            <div className="flex items-center gap-1"><Checkbox id="fee_prepaid" checked={feeTerms === 'Prepaid'} onCheckedChange={() => setFeeTerms('Prepaid')}/> <Label htmlFor="fee_prepaid">Prepaid</Label></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm"><Checkbox id="cust_check" checked={customerCheck} onCheckedChange={c => setCustomerCheck(c as boolean)} /> <Label htmlFor="cust_check">Customer check acceptable</Label></div>
                                    </div>
                                </div>
                                <div className="border border-black p-2 mt-2 text-xs">
                                    RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper, if applicable, otherwise to the rates, classifications and rules that have been established by the carrier and are available to the shipper, on request; and to all applicable state and federal regulations.
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="border border-black p-2">
                                        <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">SHIPPER SIGNATURE / DATE</h4>
                                        <div className="flex justify-between mt-2">
                                            <div className="w-1/2">
                                                <Input placeholder="Signature" value={shipperSignature} onChange={e => setShipperSignature(e.target.value)} />
                                                <Label className="text-xs">Shipper</Label>
                                            </div>
                                            <div className="w-1/3">
                                                <Input type="date" value={shipperDate} onChange={e => setShipperDate(e.target.value)} />
                                                <Label className="text-xs">Date</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border border-black p-2">
                                        <h4 className="text-xs font-bold text-center bg-gray-200 -m-2 mb-1 p-1">CARRIER SIGNATURE / PICKUP DATE</h4>
                                        <div className="flex justify-between mt-2">
                                            <div className="w-1/2">
                                                <Input placeholder="Signature" value={carrierSignature} onChange={e => setCarrierSignature(e.target.value)} />
                                                <Label className="text-xs">Carrier</Label>
                                            </div>
                                            <div className="w-1/3">
                                                <Input type="date" value={carrierDate} onChange={e => setCarrierDate(e.target.value)} />
                                                <Label className="text-xs">Date</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
