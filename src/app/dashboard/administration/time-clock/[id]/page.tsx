
"use client";

import { useParams, notFound } from "next/navigation";
import { useSchedule, Employee } from "@/hooks/use-schedule";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeTimeClockHistoryTable } from "@/components/dashboard/employee-time-clock-history-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function EmployeeTimeClockHistoryPage() {
  const params = useParams();
  const { id } = params;
  const { getEmployeeById } = useSchedule();
  const [employee, setEmployee] = useState<Employee | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id === 'string') {
        setEmployee(getEmployeeById(id));
    }
  }, [id, getEmployeeById]);

  if (employee === undefined) {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Loading History..." />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (employee === null) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
        <Header pageTitle={`Time Clock History: ${employee.name}`} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="font-headline text-2xl">{employee.name}</CardTitle>
                            <CardDescription>
                                Review and search the complete time clock history for this employee.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <EmployeeTimeClockHistoryTable employeeId={employee.id} />
                </CardContent>
            </Card>
        </main>
    </div>
  );
}

