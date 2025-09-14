
"use client";

import { useSchedule, Deal, DealStage } from "@/hooks/use-schedule";
import React, { useMemo } from 'react';
import { DealCard } from "./deal-card";
import { ScrollArea } from "../ui/scroll-area";

const stageColumns: DealStage[] = ['New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export function DealKanbanBoard() {
    const { deals, updateDealStage } = useSchedule();

    const columns = useMemo(() => {
        const cols: Record<DealStage, Deal[]> = {
            'New': [], 'Qualification': [], 'Proposal': [], 'Negotiation': [], 'Won': [], 'Lost': []
        };
        deals.forEach(deal => {
            if (cols[deal.stage]) {
                cols[deal.stage].push(deal);
            }
        });
        return cols;
    }, [deals]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
        e.dataTransfer.setData("dealId", dealId);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: DealStage) => {
        const dealId = e.dataTransfer.getData("dealId");
        updateDealStage(dealId, newStage);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <ScrollArea>
        <div className="flex gap-4 pb-4">
            {stageColumns.map(stage => (
                <div 
                    key={stage} 
                    className="w-80 flex-shrink-0"
                    onDrop={(e) => handleDrop(e, stage)}
                    onDragOver={handleDragOver}
                >
                    <div className="bg-muted p-2 rounded-t-lg sticky top-0 z-10">
                        <h3 className="font-semibold text-center">{stage} ({columns[stage].length})</h3>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-b-lg space-y-3 min-h-[60vh]">
                        {columns[stage].map(deal => (
                            <DealCard key={deal.id} deal={deal} onDragStart={handleDragStart} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </ScrollArea>
    );
}
