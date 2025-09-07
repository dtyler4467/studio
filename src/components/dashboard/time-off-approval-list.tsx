"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function TimeOffApprovalList() {
    const { timeOffRequests, employees, approveTimeOffRequest, denyTimeOffRequest } = useSchedule();

    const pendingRequests = timeOffRequests.filter(req => req.status === 'Pending');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Approve Time Off Requests</CardTitle>
                <CardDescription>
                    Review and approve or deny paid time off requests from employees.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                        {pendingRequests.map(request => {
                            const employee = employees.find(e => e.id === request.employeeId);
                            return (
                                <div key={request.id} className="flex items-center justify-between p-3 rounded-md border">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {employee?.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{employee?.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(request.startDate, "MMM d, yyyy")} - {format(request.endDate, "MMM d, yyyy")}
                                            </p>
                                            <p className="text-sm">{request.reason}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => denyTimeOffRequest(request.id)}>Deny</Button>
                                        <Button size="sm" onClick={() => approveTimeOffRequest(request.id)}>Approve</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-md border border-dashed h-64">
                        <p className="text-muted-foreground">No pending time off requests.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
