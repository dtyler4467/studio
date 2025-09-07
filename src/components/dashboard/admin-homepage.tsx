
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarCheck, CalendarCog, Printer, UserPlus } from "lucide-react";
import { useSchedule } from "@/hooks/use-schedule";
import Link from "next/link";

export function AdminHomepage() {
    const { timeOffRequests, registrations } = useSchedule();
    const pendingRequests = timeOffRequests.filter(req => req.status === 'Pending').length;
    const pendingRegistrations = registrations.filter(r => r.status === 'Pending').length;

    const actionLinks = [
        { href: "/dashboard/administration/shifts", icon: CalendarCog, title: "Manage Shifts", description: "View and edit the team schedule." },
        { href: "/dashboard/administration/time-off", icon: CalendarCheck, title: "Approve Time Off", description: "Review employee PTO requests." },
        { href: "/dashboard/administration/registrations", icon: UserPlus, title: "Approve Users", description: "Manage new user registrations." },
        { href: "/dashboard/administration/print", icon: Printer, title: "Print Schedule", description: "Export or email schedules." }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Administrator Dashboard</CardTitle>
                <CardDescription>
                    Welcome, Admin. Here you can manage schedules, approve requests, and print reports.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingRequests}</div>
                            <p className="text-xs text-muted-foreground">requests awaiting approval</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingRegistrations}</div>
                            <p className="text-xs text-muted-foreground">new users awaiting approval</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-headline">Quick Actions</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {actionLinks.map((link) => (
                            <Link href={link.href} key={link.href}>
                                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                             <div className="bg-primary/10 p-3 rounded-md">
                                                <link.icon className="h-6 w-6 text-primary" />
                                             </div>
                                             <div>
                                                <h4 className="font-semibold">{link.title}</h4>
                                                <p className="text-sm text-muted-foreground">{link.description}</p>
                                             </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </CardContent>
                                 </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
