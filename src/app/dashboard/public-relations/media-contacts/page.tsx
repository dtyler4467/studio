
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

type Contact = {
    id: string;
    name: string;
    outlet: string;
    email: string;
    status: 'Active' | 'Inactive';
};

const initialContacts: Contact[] = [
    { id: 'CON-001', name: 'John Doe', outlet: 'Logistics Today', email: 'john.doe@logisticstoday.com', status: 'Active' },
    { id: 'CON-002', name: 'Jane Smith', outlet: 'FreightWaves', email: 'jane.smith@freightwaves.com', status: 'Active' },
    { id: 'CON-003', name: 'Jim Brown', outlet: 'Supply Chain Dive', email: 'jim.brown@scdive.com', status: 'Inactive' },
];

export default function MediaContactsPage() {
    const [contacts, setContacts] = useState(initialContacts);

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Media Contacts" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Manage Media Contacts</CardTitle>
                            <CardDescription>
                                A CRM for journalists, reporters, and media outlets.
                            </CardDescription>
                        </div>
                        <Button><PlusCircle className="mr-2" /> Add Contact</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Outlet</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contacts.map(contact => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.outlet}</TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                                                    {contact.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
