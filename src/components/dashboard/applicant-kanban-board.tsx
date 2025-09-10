
"use client";

import { useSchedule, Applicant, ApplicantStatus } from "@/hooks/use-schedule";
import React, { useMemo } from 'react';
import { ApplicantCard } from "./applicant-card";

const statusColumns: ApplicantStatus[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export function ApplicantKanbanBoard() {
    const { applicants, updateApplicantStatus } = useSchedule();

    const columns = useMemo(() => {
        const cols: Record<ApplicantStatus, Applicant[]> = {
            Applied: [], Screening: [], Interview: [], Offer: [], Hired: [], Rejected: []
        };
        applicants.forEach(app => {
            if (cols[app.status]) {
                cols[app.status].push(app);
            }
        });
        return cols;
    }, [applicants]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, applicantId: string) => {
        e.dataTransfer.setData("applicantId", applicantId);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: ApplicantStatus) => {
        const applicantId = e.dataTransfer.getData("applicantId");
        updateApplicantStatus(applicantId, newStatus);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {statusColumns.map(status => (
                <div 
                    key={status} 
                    className="w-72 flex-shrink-0"
                    onDrop={(e) => handleDrop(e, status)}
                    onDragOver={handleDragOver}
                >
                    <div className="bg-muted p-2 rounded-t-lg">
                        <h3 className="font-semibold text-center">{status} ({columns[status].length})</h3>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-b-lg space-y-3 min-h-[300px]">
                        {columns[status].map(applicant => (
                            <ApplicantCard key={applicant.id} applicant={applicant} onDragStart={handleDragStart} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
