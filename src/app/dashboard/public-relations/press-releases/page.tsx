
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

type Release = {
    id: string;
    title: string;
    status: 'Draft' | 'Published' | 'Archived';
    date: Date;
};

const initialReleases: Release[] = [
    { id: 'REL-001', title: 'LogiFlow Announces New Real-Time Tracking Feature', status: 'Published', date: new Date(new Date().setDate(new Date().getDate() - 10)) },
    { id: 'REL-002', title: 'Q3 Financial Results', status: 'Draft', date: new Date() },
    { id: 'REL-003', title: 'Partnership with Global Shipping Co.', status: 'Archived', date: new Date('2023-11-15') },
];

export default function PressReleasesPage() {
    const [releases, setReleases] = useState(initialReleases);

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Press Releases" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Manage Press Releases</CardTitle>
                            <CardDescription>
                                Draft, review, and publish company press releases.
                            </CardDescription>
                        </div>
                        <Button><PlusCircle className="mr-2" /> New Press Release</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {releases.map(release => (
                                        <TableRow key={release.id}>
                                            <TableCell className="font-medium">{release.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={release.status === 'Published' ? 'default' : 'secondary'}>
                                                    {release.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{release.date.toLocaleDateString()}</TableCell>
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
