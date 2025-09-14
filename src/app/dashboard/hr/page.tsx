
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Briefcase, ChevronRight, FolderLock } from 'lucide-react';
import Link from 'next/link';
import { useSchedule } from '@/hooks/use-schedule';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const mockHrCases = [
    { id: 'CASE001', employee: 'John Doe', type: 'Disciplinary Action', status: 'Open', created: '2024-08-01' },
    { id: 'CASE002', employee: 'Jane Doe', type: 'Benefit Inquiry', status: 'Closed', created: '2024-07-28' },
];

export default function HrPage() {
    const { employees } = useSchedule();
    const totalEmployees = employees.length;
    const openCases = mockHrCases.filter(c => c.status === 'Open').length;
    const pendingDocuments = 2; // Mock data

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Human Resources Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalEmployees}</div>
                    <p className="text-xs text-muted-foreground">Active and inactive personnel</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open HR Cases</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{openCases}</div>
                    <p className="text-xs text-muted-foreground">Employee relations cases</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingDocuments}</div>
                    <p className="text-xs text-muted-foreground">Awaiting employee signature</p>
                </CardContent>
            </Card>
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Benefits Enrollment</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">Of eligible employees enrolled</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">HR Quick Actions</CardTitle>
                    <CardDescription>Jump to key HR functions.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <Button asChild size="lg" className="justify-start">
                        <Link href="/dashboard/administration/personnel">
                            <Users className="mr-2" /> Manage Personnel Files
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="justify-start">
                        <Link href="/dashboard/recruitment-hub">
                            <Briefcase className="mr-2" /> Go to Recruitment Hub
                        </Link>
                    </Button>
                     <Button asChild variant="secondary" className="justify-start">
                        <Link href="/dashboard/hr/policies">
                            <FolderLock className="mr-2" /> View Company Policies
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Open HR Cases</CardTitle>
                    <CardDescription>A log of active employee relations cases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Case Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHrCases.map((hrCase) => (
                                <TableRow key={hrCase.id}>
                                    <TableCell className="font-medium">{hrCase.employee}</TableCell>
                                    <TableCell>{hrCase.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={hrCase.status === 'Open' ? 'destructive' : 'default'}>
                                            {hrCase.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
      </main>
    </div>
  );
}
