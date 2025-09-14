
"use client";

import { Deal, useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DollarSign, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { format } from "date-fns";
import React, { useEffect, useState } from 'react';
import { Skeleton } from "../ui/skeleton";

interface DealCardProps {
    deal: Deal;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
}

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        setFormattedDate(format(date, 'MMM dd, yyyy'));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-24" />;
    }

    return <>Close Date: {formattedDate}</>;
}


export function DealCard({ deal, onDragStart }: DealCardProps) {
    const { employees } = useSchedule();
    const owner = employees.find(e => e.id === deal.ownerId);

    return (
        <Card 
            draggable 
            onDragStart={(e) => onDragStart(e, deal.id)}
            className="cursor-grab active:cursor-grabbing"
        >
            <CardHeader className="p-4 flex-row items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-base">{deal.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{deal.company}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-muted-foreground" />
                     <span className="font-semibold">${deal.value.toLocaleString()}</span>
                </div>
                 {owner && (
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                 <p><ClientFormattedDate date={deal.closeDate} /></p>
            </CardFooter>
        </Card>
    );
}
