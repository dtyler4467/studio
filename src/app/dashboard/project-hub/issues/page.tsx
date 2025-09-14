
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter, AlertCircle, Shield, Bug } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useState, useMemo } from 'react';

type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

type Issue = {
    id: string;
    title: string;
    project: string;
    status: IssueStatus;
    priority: IssuePriority;
    assignedTo: string;
    reportedBy: string;
    dateReported: Date;
};

const initialIssues: Issue[] = [
    { id: 'ISSUE-001', title: 'API rate limiting causing data sync failures', project: 'Mobile App Feature Update', status: 'In Progress', priority: 'High', assignedTo: 'Mike Smith', reportedBy: 'John Doe', dateReported: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'ISSUE-002', title: 'Homepage hero image not loading on Safari', project: 'Website V2 Development', status: 'Open', priority: 'Medium', assignedTo: 'Jane Doe', reportedBy: 'Emily Jones', dateReported: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'ISSUE-003', title: 'Third-party font license expiring', project: 'Q3 Marketing Campaign', status: 'Resolved', priority: 'Low', assignedTo: 'Emily Jones', reportedBy: 'Admin User', dateReported: new Date(new Date().setDate(new Date().getDate() - 5)) },
];

const priorityVariant = {
    'Low': 'secondary',
    'Medium': 'default',
    'High': 'outline',
    'Critical': 'destructive'
} as const;

export default function ProjectIssuesPage() {
    const [issues, setIssues] = useState(initialIssues);

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Project Issues" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{issues.filter(i => i.status === 'Open').length}</div>
                            <p className="text-xs text-muted-foreground">Issues requiring immediate attention.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{issues.filter(i => i.status === 'In Progress').length}</div>
                            <p className="text-xs text-muted-foreground">Issues actively being worked on.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
                            <Bug className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length}</div>
                            <p className="text-xs text-muted-foreground">Issues closed in the last 30 days.</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Issue Tracker</CardTitle>
                            <CardDescription>
                                Monitor and manage all project-related issues, risks, and bugs.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline"><ListFilter className="mr-2" /> Filter</Button>
                            <Button><PlusCircle className="mr-2" /> New Issue</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Issue</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Date Reported</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.map(issue => (
                                        <TableRow key={issue.id}>
                                            <TableCell>
                                                <p className="font-medium">{issue.title}</p>
                                                <p className="text-xs text-muted-foreground">{issue.id}</p>
                                            </TableCell>
                                            <TableCell>{issue.project}</TableCell>
                                            <TableCell>
                                                <Badge variant={issue.status === 'Open' || issue.status === 'In Progress' ? 'destructive' : 'default'}>
                                                    {issue.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={priorityVariant[issue.priority]}>
                                                    {issue.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{issue.assignedTo}</TableCell>
                                            <TableCell>{issue.dateReported.toLocaleDateString()}</TableCell>
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
