"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TimeOffHistory() {
    // Assuming current user is USR001 for now
    const currentUserId = "USR001";
    const { timeOffRequests } = useSchedule();

    const userRequests = timeOffRequests.filter(req => req.employeeId === currentUserId);

    const getStatusVariant = (status: 'Pending' | 'Approved' | 'Denied') => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Denied': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Dates Requested</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userRequests.length > 0 ? userRequests.map(request => (
                        <TableRow key={request.id}>
                            <TableCell>
                                {format(request.startDate, "MMM d, yyyy")} - {format(request.endDate, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{request.reason}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={getStatusVariant(request.status)} className={cn(request.status === 'Approved' && 'bg-green-600')}>{request.status}</Badge>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                You have not made any time off requests.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
