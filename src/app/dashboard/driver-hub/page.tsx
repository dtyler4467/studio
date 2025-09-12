
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CalendarClock, Receipt, MessageSquare, ClipboardCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSchedule } from '@/hooks/use-schedule';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function DriverHubPage() {
    const { currentUser, receipts } = useSchedule();
    const pendingReceipts = receipts.filter(r => r.employeeId === currentUser?.id && r.status === 'Pending').length;
    
    // Mock data for demonstration
    const unreadMessages = 2;
    const eldConnected = true;
    const nextDvirDueDate = new Date();
    nextDvirDueDate.setDate(nextDvirDueDate.getDate() + 1);

    const renewals = [
        { name: 'Vehicle Registration', expires: new Date(new Date().setMonth(new Date().getMonth() + 2)), status: 'Valid' },
        { name: 'Commercial Insurance', expires: new Date(new Date().setMonth(new Date().getMonth() - 1)), status: 'Expired' },
    ];


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Driver Hub Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ELD Status</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${eldConnected ? 'text-green-600' : 'text-destructive'}`}>
                        {eldConnected ? 'Connected' : 'Disconnected'}
                    </div>
                    <p className="text-xs text-muted-foreground">Motive (KeepTruckin)</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next DVIR Due</CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{format(nextDvirDueDate, 'PPP')}</div>
                    <p className="text-xs text-muted-foreground">Post-trip inspection required</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingReceipts}</div>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">From dispatch and admin</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
             <Card className="lg:col-span-1">
                 <CardHeader>
                    <CardTitle className="font-headline">Quick Actions</CardTitle>
                    <CardDescription>Common tasks for your role.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <Button asChild size="lg">
                        <Link href="/dashboard/driver-hub/dvir">
                            <ClipboardCheck className="mr-2" /> Submit DVIR
                        </Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/dashboard/driver-hub/receipts">
                            <Receipt className="mr-2" /> Log a Receipt
                        </Link>
                    </Button>
                     <Button asChild variant="secondary">
                        <Link href="/dashboard/driver-hub/chat">
                            <MessageSquare className="mr-2" /> Open Chat
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle className="font-headline">Upcoming Renewals</CardTitle>
                    <CardDescription>Important upcoming deadlines for your documents.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-4">
                        {renewals.map((item, index) => (
                             <li key={index} className="flex items-center justify-between p-3 rounded-md border">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Expires: {format(item.expires, 'PPP')}
                                    </p>
                                </div>
                                <Badge variant={item.status === 'Expired' ? 'destructive' : 'default'} className={item.status === 'Valid' ? 'bg-green-600' : ''}>
                                    {item.status === 'Expired' ? <AlertCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    {item.status}
                                </Badge>
                             </li>
                        ))}
                     </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Assigned Training</CardTitle>
                <CardDescription>
                    Your current assigned training modules. Click to view.
                </CardDescription>
            </CardHeader>
             <CardContent className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/resources/MOD001">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Welcome to LogiFlow</p>
                                <p className="text-sm text-muted-foreground">Status: Not Started</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Card>
                </Link>
                <Link href="/dashboard/resources/MOD002">
                    <Card className="hover:bg-muted/50 transition-colors">
                         <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Safety Procedures</p>
                                <p className="text-sm text-muted-foreground">Status: In Progress</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Card>
                </Link>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
