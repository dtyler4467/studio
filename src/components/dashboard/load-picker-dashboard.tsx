
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSchedule, SalesOrder } from '@/hooks/use-schedule';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Truck, Package, Printer, CheckCircle, Clock, QrCode, Barcode } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { PickerProductivity } from './picker-productivity';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Employee } from '@/hooks/use-schedule';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const ClientFormattedDate = ({ date }: { date: Date | null }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        if (date) {
            setFormattedDate(format(date, 'P'));
        }
    }, [date]);

    if (!date) {
        return <Skeleton className="h-4 w-20" />;
    }

    return <div>{formattedDate}</div>;
};

const BarcodePlaceholder = ({ value }: { value: string }) => (
    <div className="flex flex-col items-center">
        <svg width="150" height="40" viewBox="0 0 150 40" className="w-full">
            <rect x="0" y="0" width="150" height="40" fill="white" />
            <g fill="black">
                {[...Array(30)].map((_, i) => (
                    <rect key={i} x={i * 5} y="0" width={Math.random() > 0.5 ? 1 : 2} height="30" />
                ))}
            </g>
        </svg>
        <p className="text-[8px] font-mono tracking-widest">{value}</p>
    </div>
);

const QrCodePlaceholder = () => (
     <svg width="60" height="60" viewBox="0 0 60 60" className="w-full">
        <rect x="0" y="0" width="60" height="60" fill="white" />
        <g fill="black">
            {[...Array(15)].map((_, y) => 
                [...Array(15)].map((_, x) => (
                    Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x*4} y={y*4} width="4" height="4" /> : null
                ))
            )}
        </g>
    </svg>
);


const PrintLabelDialog = ({ order, isOpen, onOpenChange }: { order: SalesOrder | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const labelRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (labelRef.current) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head><title>Print Label</title>');
            printWindow?.document.write('<style>@media print { @page { size: 4in 6in; margin: 0; } body { margin: 0; } }</style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write(labelRef.current.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => {
                printWindow?.print();
            }, 250);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Print Label for {order.id}</DialogTitle>
                    <DialogDescription>
                        Review the label below. It is formatted for a 4x6 shipping label.
                    </DialogDescription>
                </DialogHeader>
                <div ref={labelRef} className="p-4 border rounded-md" style={{ width: '4in', height: '6in' }}>
                    <div className="flex flex-col h-full text-xs">
                        <div className="flex justify-between items-start border-b pb-2">
                            <div>
                                <p className="font-bold text-base">{order.id}</p>
                                <p>To: {order.customer}</p>
                                <p>{order.destination}</p>
                            </div>
                            <QrCodePlaceholder />
                        </div>
                        <div className="flex-grow my-2">
                             <p className="font-bold mb-1">Items:</p>
                             <ul className="list-disc pl-4 space-y-1 text-[10px]">
                                {order.items.map(item => (
                                    <li key={item.sku}>{item.description} (Qty: {item.quantity})</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t pt-2 flex flex-col items-center">
                           <BarcodePlaceholder value={order.id} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/> Print</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function LoadPickerDashboard() {
    const { salesOrders, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, currentUser, inventoryItems, employees } = useSchedule();
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
    const [orderToPrint, setOrderToPrint] = useState<SalesOrder | null>(null);


    const activeOrder = useMemo(() => {
        return salesOrders.find(o => o.id === activeOrderId);
    }, [salesOrders, activeOrderId]);

    const pendingOrders = useMemo(() => {
        return salesOrders
            .filter(o => o.status === 'Pending')
            .sort((a, b) => new Date(a.shipDate).getTime() - new Date(b.shipDate).getTime());
    }, [salesOrders]);

    const handleStartPicking = (orderId: string) => {
        if (!currentUser) return;
        assignPickerToOrder(orderId, currentUser.id);
        setActiveOrderId(orderId);
    };

    const handleItemPicked = (sku: string, picked: boolean) => {
        if (activeOrderId) {
            updateOrderItemStatus(activeOrderId, sku, picked);
        }
    };
    
    const handleCompletePicking = () => {
        if (activeOrderId) {
            completeOrderPicking(activeOrderId);
            setActiveOrderId(null);
        }
    };
    
    const handlePrintLabel = (order: SalesOrder) => {
        setOrderToPrint(order);
        setPrintDialogOpen(true);
    };
    
    const allItemsPicked = activeOrder?.items.every(item => item.picked);

    const getBOLQueryString = (order: SalesOrder) => {
        const params = new URLSearchParams();
        params.set('consigneeName', order.customer);
        // Assuming destination is in "City, ST" format
        const [city, state] = order.destination.split(', ');
        params.set('consigneeCity', city || '');
        params.set('consigneeState', state || '');
        
        if (order.bolNumber) {
            params.set('bolNumber', order.bolNumber);
        }
        order.items.forEach(item => {
            params.append('items', item.description);
            params.append('quantities', item.quantity.toString());
        });
        return params.toString();
    };
    
    const getPickerName = (pickerId?: string) => {
        if (!pickerId) return 'N/A';
        return employees.find((e: Employee) => e.id === pickerId)?.name || 'Unknown';
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">My Active Pick</CardTitle>
                        <CardDescription>The order you are currently picking items for.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeOrder ? (
                            <div>
                                <div className="flex justify-between items-start mb-4 p-4 bg-muted rounded-lg">
                                    <div>
                                        <p className="font-bold text-lg">{activeOrder.id}</p>
                                        <p className="text-sm text-muted-foreground">{activeOrder.customer} - {activeOrder.destination}</p>
                                        <div className="text-xs text-muted-foreground">Ship Date: <ClientFormattedDate date={activeOrder.shipDate} /></div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{activeOrder.items.filter(i => i.picked).length} / {activeOrder.items.length}</p>
                                        <p className="text-xs text-muted-foreground">Items Picked</p>
                                    </div>
                                </div>
                                <ScrollArea className="h-64 pr-4">
                                     <div className="space-y-3">
                                        {activeOrder.items.map(item => (
                                            <div key={item.sku} className="flex items-center gap-4 p-3 border rounded-md">
                                                <Checkbox
                                                    id={`item-${item.sku}`}
                                                    checked={item.picked}
                                                    onCheckedChange={(checked) => handleItemPicked(item.sku, !!checked)}
                                                />
                                                <label htmlFor={`item-${item.sku}`} className="flex-1 grid grid-cols-4 gap-2 text-sm">
                                                    <span className="font-medium col-span-2">{item.description} ({item.sku})</span>
                                                    <span>Qty: {item.quantity}</span>
                                                    <span className="text-muted-foreground">Loc: {item.location}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        ) : (
                            <div className="h-96 flex items-center justify-center border-dashed border-2 rounded-lg">
                                <p className="text-muted-foreground">Select an order from the queue to begin picking.</p>
                            </div>
                        )}
                    </CardContent>
                    {activeOrder && (
                        <CardFooter>
                           <Button onClick={handleCompletePicking} disabled={!allItemsPicked} className="w-full">
                                <CheckCircle className="mr-2" /> Mark as Picked & Staged
                           </Button>
                        </CardFooter>
                    )}
                </Card>

                <PickerProductivity />
            </div>

            <Card className="lg:col-span-1">
                 <CardHeader>
                    <CardTitle className="font-headline">Order Queue</CardTitle>
                    <CardDescription>Orders ready to be picked.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            {pendingOrders.map(order => (
                                <Card key={order.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{order.id}</p>
                                            <p className="text-sm text-muted-foreground">{order.customer}</p>
                                        </div>
                                        <div><ClientFormattedDate date={order.shipDate} /></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 text-xs">
                                        <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.items.length} items</span>
                                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {order.destination}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <Button size="sm" variant="outline" onClick={() => handlePrintLabel(order)}>
                                            <Printer className="mr-2 h-4 w-4" /> Print Label
                                        </Button>
                                        <Button size="sm" onClick={() => handleStartPicking(order.id)}>
                                            Start Picking
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                             {salesOrders.filter(o => o.status === 'Staged').map(order => (
                                <Card key={order.id} className="p-4 bg-green-50 border-green-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{order.id}</p>
                                            <p className="text-sm text-green-700">{order.customer}</p>
                                        </div>
                                        <Badge variant="default" className="bg-green-600">Staged</Badge>
                                    </div>
                                     <div className="text-xs text-green-600 mt-1">
                                        Picked by {getPickerName(order.assignedPicker)} {order.pickEndTime ? `in ${formatDistanceToNow(order.pickEndTime, { addSuffix: false, includeSeconds: true })}` : ''}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <Button size="sm" variant="secondary" onClick={() => handlePrintLabel(order)}>
                                            <Printer className="mr-2 h-4 w-4" /> Print Label
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full" asChild>
                                            <Link href={`/dashboard/warehouse-hub-manager/bol?${getBOLQueryString(order)}`}>
                                                View BOL
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <PrintLabelDialog order={orderToPrint} isOpen={isPrintDialogOpen} onOpenChange={setPrintDialogOpen} />
        </div>
    );
}
