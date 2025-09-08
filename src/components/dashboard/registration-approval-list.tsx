

"use client";

import { useSchedule, Registration, EmployeeRole } from "@/hooks/use-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const validRoles: EmployeeRole[] = ["Admin", "Dispatcher", "Driver", "Employee", "Forklift", "Laborer", "Manager", "Visitor", "Vendor"];

const EditRegistrationDialog = ({
    registration,
    isOpen,
    onOpenChange,
    onSave
}: {
    registration: Registration | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updatedRegistration: Registration) => void;
}) => {
    const [editedRegistration, setEditedRegistration] = useState<Registration | null>(registration);

    React.useEffect(() => {
        setEditedRegistration(registration);
    }, [registration]);

    const handleSave = () => {
        if (editedRegistration) {
            onSave(editedRegistration);
            onOpenChange(false);
        }
    };

    if (!isOpen || !editedRegistration) return null;
    
    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Registration: {registration?.name}</DialogTitle>
                    <DialogDescription>
                        Make changes to the registration details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={editedRegistration.name} onChange={e => setEditedRegistration({...editedRegistration, name: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={editedRegistration.email} onChange={e => setEditedRegistration({...editedRegistration, email: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input id="phone" value={editedRegistration.phoneNumber} onChange={e => setEditedRegistration({...editedRegistration, phoneNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={editedRegistration.role} onValueChange={(value: EmployeeRole) => setEditedRegistration({...editedRegistration, role: value})}>
                             <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {validRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export function RegistrationApprovalList() {
    const { registrations, approveRegistration, denyRegistration, updateRegistration } = useSchedule();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

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
    
    const handleOpenEditDialog = (registration: Registration) => {
        setSelectedRegistration(registration);
        setIsEditDialogOpen(true);
    };
    
    const handleSaveRegistration = (updatedRegistration: Registration) => {
        updateRegistration(updatedRegistration);
        toast({
            title: "Registration Updated",
            description: `Details for ${updatedRegistration.name} have been updated.`,
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
                                                <Button size="icon" variant="ghost" onClick={() => handleOpenEditDialog(request)}>
                                                    <Pencil className="w-4 h-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
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
             <EditRegistrationDialog
                registration={selectedRegistration}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSaveRegistration}
            />
        </Card>
    );
}
