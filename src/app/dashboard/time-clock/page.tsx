
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeClock } from '@/components/dashboard/time-clock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History, Plane, Timer } from 'lucide-react';
import Image from 'next/image';
import { EmployeeTimeClockHistoryTable } from '@/components/dashboard/employee-time-clock-history-table';
import { useSchedule } from '@/hooks/use-schedule';

export default function TimeClockPage() {
  const { currentUser } = useSchedule();

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Clock" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
                 <Card>
                    <TimeClock />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">GPS Location</CardTitle>
                        <CardDescription>Simulated GPS location at clock-in.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="w-full h-48 bg-muted rounded-md relative overflow-hidden">
                            <Image src="https://picsum.photos/seed/gpsmap/800/400" alt="Simulated GPS map" layout="fill" objectFit="cover" data-ai-hint="gps map" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <p className="text-white font-bold bg-black/50 px-4 py-2 rounded-md">Location Verified</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Recent Activity</CardTitle>
                        <CardDescription>
                            Here are your time clock entries for the last 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentUser && <EmployeeTimeClockHistoryTable employeeId={currentUser.id} />}
                    </CardContent>
                     <CardFooter className="flex-wrap gap-2">
                        <Button asChild>
                            <Link href={`/dashboard/administration/time-clock/${currentUser?.id}`}>
                                <History className="mr-2" /> View Full History
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/time-off">
                                <Plane className="mr-2" /> Request Time Off
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

