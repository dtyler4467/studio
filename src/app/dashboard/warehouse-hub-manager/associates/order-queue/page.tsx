
"use client";

import React, { useState, useMemo } from 'react';
import { useSchedule, SalesOrder, Employee } from '@/hooks/use-schedule';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Truck, Package, Printer, ChevronDown } from 'lucide-react';
import { ClientFormattedDate, PrintLabelDialog } from '@/components/dashboard/load-picker-dashboard';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function OrderQueuePage() {
    const { salesOrders, assignPickerToOrder, currentUser, employees } = useSchedule();
    const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
    const [orderToPrint, setOrderToPrint] = useState<SalesOrder | null>(null);

    const pendingOrders = useMemo(() => {
        return salesOrders
            .filter(o => o.status === 'Pending')
            .sort((a, b) => new Date(a.shipDate).getTime() - new Date(b.shipDate).getTime());
    }, [salesOrders]);

    const handleStartPicking = (orderId: string) => {
        if (!currentUser) return;
        assignPickerToOrder(orderId, currentUser.id);
    };

    const handlePrintLabel = (order: SalesOrder) => {
        setOrderToPrint(order);
        setPrintDialogOpen(true);
    };

    const getBOLQueryString = (order: SalesOrder) => {
        const params = new URLSearchParams();
        params.set('consigneeName', order.customer);
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
    };

    return (
        <div className="flex flex-col w-full">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                 <h1 className="text-lg font-semibold font-headline md:text-2xl">Order Queue</h1>
                 <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Navigate To <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/my-pick">My Active Pick</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/picker-assigner">Picker Assigner</Link></DropdownMenuItem>
                             <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/productivity">Productivity</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Order Queue</CardTitle>
                        <CardDescription>Orders ready to be picked.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-14rem)]">
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
            </main>
            <PrintLabelDialog order={orderToPrint} isOpen={isPrintDialogOpen} onOpenChange={setPrintDialogOpen} />
        </div>
    );
}
