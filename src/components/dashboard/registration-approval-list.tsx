
"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";

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
                    Review and approve or deny new users who have registered for an account. Approved users get the 'Driver' role by default.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingRegistrations.length > 0 ? (
                    <div className="space-y-4">
                        {pendingRegistrations.map(request => {
                            return (
                                <div key={request.id} className="flex items-center justify-between p-3 rounded-md border">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {request.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{request.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {request.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleDeny(request.id)}>Deny</Button>
                                        <Button size="sm" onClick={() => handleApprove(request.id)}>Approve</Button>
                                    </div>
                                </div>
                            );
                        })}
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
