
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckSquare, Printer, UserPlus } from "lucide-react";
import { useSchedule } from "@/hooks/use-schedule";

export function AdminHomepage() {
    const { timeOffRequests, registrations } = useSchedule();
    const pendingRequests = timeOffRequests.filter(req => req.status === 'Pending').length;
    const pendingRegistrations = registrations.filter(r => r.status === 'Pending').length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Administrator Dashboard</CardTitle>
                <CardDescription>
                    Welcome, Admin. Here you can manage schedules, approve time off, and print reports.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="bg-primary/10 p-3 rounded-md">
                                        <Calendar className="h-6 w-6 text-primary" />
                                     </div>
                                     <div>
                                        <h4 className="font-semibold">Manage Shifts</h4>
                                        <p className="text-sm text-muted-foreground">View and edit the team schedule.</p>
                                     </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                         </Card>
                         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="bg-primary/10 p-3 rounded-md">
                                        <CheckSquare className="h-6 w-6 text-primary" />
                                     </div>
                                     <div>
                                        <h4 className="font-semibold">Approve Time Off</h4>
                                        <p className="text-sm text-muted-foreground">Review employee PTO requests.</p>
                                     </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                         </Card>
                         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="bg-primary/10 p-3 rounded-md">
                                        <UserPlus className="h-6 w-6 text-primary" />
                                     </div>
                                     <div>
                                        <h4 className="font-semibold">Approve Users</h4>
                                        <p className="text-sm text-muted-foreground">Manage new user registrations.</p>
                                     </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                         </Card>
                         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="bg-primary/10 p-3 rounded-md">
                                        <Printer className="h-6 w-6 text-primary" />
                                     </div>
                                     <div>
                                        <h4 className="font-semibold">Print Schedule</h4>
                                        <p className="text-sm text-muted-foreground">Export or email schedules.</p>
                                     </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                         </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
