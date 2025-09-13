
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSchedule, SalesOrder } from '@/hooks/use-schedule';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle } from 'lucide-react';
import { ClientFormattedDate } from '@/components/dashboard/load-picker-dashboard';

export default function MyActivePickPage() {
    const { salesOrders, assignPickerToOrder, updateOrderItemStatus, completeOrderPicking, currentUser } = useSchedule();
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    // Find the order actively being picked by the current user
    useEffect(() => {
        const activeOrder = salesOrders.find(o => o.assignedPicker === currentUser?.id && o.status === 'Picking');
        if (activeOrder) {
            setActiveOrderId(activeOrder.id);
        } else {
            setActiveOrderId(null);
        }
    }, [salesOrders, currentUser]);


    const activeOrder = useMemo(() => {
        return salesOrders.find(o => o.id === activeOrderId);
    }, [salesOrders, activeOrderId]);

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

    return (
         <div className="flex flex-col w-full">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                 <h1 className="text-lg font-semibold font-headline md:text-2xl">My Active Pick</h1>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
                                <p className="text-muted-foreground">You do not have an active pick. Select an order from the queue to begin.</p>
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
            </main>
        </div>
    );
}
