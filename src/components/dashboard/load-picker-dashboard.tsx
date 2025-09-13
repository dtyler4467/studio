
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSchedule, SalesOrder } from '@/hooks/use-schedule';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Truck, Package, Printer, CheckCircle, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { PickerProductivity } from './picker-productivity';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Employee } from '@/hooks/use-schedule';

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        setFormattedDate(format(date, 'P'));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-20" />;
    }

    return <>{formattedDate}</>;
};

export function LoadPickerDashboard() {
    const { salesOrders, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, currentUser, inventoryItems, employees } = useSchedule();
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

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
                                        <div className="text-xs text-muted-foreground"><ClientFormattedDate date={order.shipDate} /></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 text-xs">
                                        <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.items.length} items</span>
                                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {order.destination}</span>
                                    </div>
                                    <Button size="sm" className="w-full mt-4" onClick={() => handleStartPicking(order.id)}>
                                        Start Picking
                                    </Button>
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
                                    <Button size="sm" variant="outline" className="w-full mt-4" asChild>
                                        <Link href={`/dashboard/warehouse-hub-manager/bol?${getBOLQueryString(order)}`}>
                                            <Printer className="mr-2 h-4 w-4" /> Print BOL
                                        </Link>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
