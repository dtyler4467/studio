
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

export const ClientFormattedDate = ({ date }: { date: Date | null }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        if (date) {
            setFormattedDate(format(date, 'P'));
        } else {
            setFormattedDate('N/A');
        }
    }, [date]);

    if (formattedDate === null) {
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


export const PrintLabelDialog = ({ order, isOpen, onOpenChange }: { order: SalesOrder | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
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
