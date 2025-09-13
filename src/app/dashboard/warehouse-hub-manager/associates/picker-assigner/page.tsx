
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Package, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { useSchedule, SalesOrder, Employee } from '@/hooks/use-schedule';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClientFormattedDate } from '@/components/dashboard/load-picker-dashboard';

const OrderCard = ({ order, onDragStart }: { order: SalesOrder, onDragStart: (e: React.DragEvent<HTMLDivElement>, orderId: string) => void }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, order.id)}
        className="p-3 border rounded-lg bg-background cursor-grab active:cursor-grabbing"
    >
        <p className="font-semibold">{order.id}</p>
        <p className="text-sm text-muted-foreground">{order.customer}</p>
        <div className="text-xs text-muted-foreground mt-2 flex justify-between">
            <span><Package className="h-3 w-3 inline-block mr-1"/>{order.items.length} items</span>
            <span><Truck className="h-3 w-3 inline-block mr-1"/>{order.destination}</span>
        </div>
    </div>
);

export default function WarehousePickerAssignerPage() {
    const { salesOrders, employees, assignPickerToOrder } = useSchedule();
    const [draggedOverPicker, setDraggedOverPicker] = useState<string | null>(null);

    const { unassignedOrders, pickers, ordersByPicker } = useMemo(() => {
        const unassigned = salesOrders.filter(o => o.status === 'Pending' && !o.assignedPicker);
        const pickerRoles: Employee['role'][] = ['Forklift', 'Laborer', 'Admin', 'Manager'];
        const pickerList = employees.filter(e => pickerRoles.includes(e.role));

        const assigned: Record<string, SalesOrder[]> = {};
        pickerList.forEach(p => assigned[p.id] = []);
        salesOrders.forEach(o => {
            if (o.assignedPicker && o.status === 'Picking' && assigned[o.assignedPicker]) {
                assigned[o.assignedPicker].push(o);
            }
        });

        return { unassignedOrders: unassigned, pickers: pickerList, ordersByPicker: assigned };
    }, [salesOrders, employees]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, orderId: string) => {
        e.dataTransfer.setData("orderId", orderId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, pickerId: string) => {
        e.preventDefault();
        const orderId = e.dataTransfer.getData("orderId");
        assignPickerToOrder(orderId, pickerId);
        setDraggedOverPicker(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, pickerId: string) => {
        e.preventDefault();
        setDraggedOverPicker(pickerId);
    };

    const handleDragLeave = () => {
        setDraggedOverPicker(null);
    }

  return (
    <div className="flex flex-col w-full">
       <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <h1 className="text-lg font-semibold font-headline md:text-2xl">Picker Assigner</h1>
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Navigate To <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/my-pick">My Active Pick</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/order-queue">Order Queue</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/warehouse-hub-manager/associates/productivity">Productivity</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
       </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline">Unassigned Orders</CardTitle>
                    <CardDescription>Drag an order to a picker to assign it.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-3">
                            {unassignedOrders.map(order => (
                                <OrderCard key={order.id} order={order} onDragStart={handleDragStart} />
                            ))}
                            {unassignedOrders.length === 0 && (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                    No pending orders.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 flex flex-col">
                 <CardHeader>
                    <CardTitle className="font-headline">Pickers</CardTitle>
                    <CardDescription>View picker assignments and drop orders to assign.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ScrollArea className="h-full pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pickers.map(picker => (
                                <div 
                                    key={picker.id}
                                    onDrop={(e) => handleDrop(e, picker.id)}
                                    onDragOver={(e) => handleDragOver(e, picker.id)}
                                    onDragLeave={handleDragLeave}
                                    className={cn(
                                        "p-3 border rounded-lg transition-colors",
                                        draggedOverPicker === picker.id ? 'bg-primary/20 border-primary' : 'bg-muted/50'
                                    )}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar>
                                            <AvatarFallback>{picker.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{picker.name}</p>
                                            <p className="text-xs text-muted-foreground">{picker.role}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 min-h-24">
                                        {ordersByPicker[picker.id]?.map(order => (
                                            <div key={order.id} className="p-2 border rounded-md bg-background text-xs">
                                                <p className="font-semibold truncate">{order.id} - {order.customer}</p>
                                                <p className="text-muted-foreground truncate">{order.destination} | <ClientFormattedDate date={order.shipDate} /></p>
                                            </div>
                                        ))}
                                         {ordersByPicker[picker.id]?.length === 0 && (
                                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-8">
                                                Drop order here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

