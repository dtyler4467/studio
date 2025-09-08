
"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

export function RegistrationApprovalList() {
    const { registrations, approveRegistration, denyRegistration } = useSchedule();
    const { toast } = useToast();

    const pendingRegistrations = registrations.filter(reg => reg.status === 'Pending');

    const handleApprove = (id: string) => {
        approveRegistration(id);
        toast({
            title: "User Approved",
            description: "The new user has been approved and added to personnel.",
        });
    };

    const handleDeny = (id: string) => {
        denyRegistration(id);
        toast({
            variant: "destructive",
            title: "User Denied",
            description: "The registration request has been denied.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Approve New User Registrations</CardTitle>
                <CardDescription>
                    Review and approve or deny new users who have registered for an account. Approved users are added to personnel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingRegistrations.length > 0 ? (
                     <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Requested Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingRegistrations.map(request => (
                                     <TableRow key={request.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {request.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{request.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.email}</TableCell>
                                        <TableCell>{request.phoneNumber}</TableCell>
                                        <TableCell><Badge variant="outline">{request.role}</Badge></TableCell>
                                        <TableCell className="text-right">
                                             <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleDeny(request.id)}>Deny</Button>
                                                <Button size="sm" onClick={() => handleApprove(request.id)}>Approve</Button>
                                            </div>
                                        </TableCell>
                                     </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-md border border-dashed h-64">
                        <p className="text-muted-foreground">No pending registration requests.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
