
"use client";

import { Applicant, useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { FileText, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ApplicantCardProps {
    applicant: Applicant;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, applicantId: string) => void;
}

export function ApplicantCard({ applicant, onDragStart }: ApplicantCardProps) {
    const { jobPostings } = useSchedule();
    const job = jobPostings.find(j => j.id === applicant.applyingFor);

    return (
        <Card 
            draggable 
            onDragStart={(e) => onDragStart(e, applicant.id)}
            className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
            <CardHeader className="p-4 flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{applicant.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{job?.title || 'Unknown Job'}</p>
                    </div>
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
            <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                </Button>
            </CardFooter>
        </Card>
    );
}
