
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, HandCoins, Hourglass, MoreHorizontal } from 'lucide-react';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const mockPayrollHistory = [
    { id: 'PAY-001', period: '2024-07-01 to 2024-07-15', runDate: '2024-07-20', amount: 56789.12, status: 'Paid' },
    { id: 'PAY-002', period: '2024-06-16 to 2024-06-30', runDate: '2024-07-05', amount: 55980.50, status: 'Paid' },
];

export default function PayrollPage() {
    const { employees, timeClockEvents } = useSchedule();

    const getWeekOvertime = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyHours = employees.reduce((acc, emp) => {
            const employeeEvents = timeClockEvents.filter(e => e.employeeId === emp.id && new Date(e.timestamp) >= oneWeekAgo);
            let totalMinutes = 0;
            for(let i = 0; i < employeeEvents.length; i+=2) {
                if(employeeEvents[i].type === 'in' && employeeEvents[i+1]?.type === 'out') {
                    totalMinutes += (new Date(employeeEvents[i+1].timestamp).getTime() - new Date(employeeEvents[i].timestamp).getTime()) / 60000;
                }
            }
            acc[emp.id] = totalMinutes / 60;
            return acc;
        }, {} as Record<string, number>);

        let totalOvertime = 0;
        for (const empId in weeklyHours) {
            const employee = employees.find(e => e.id === empId);
            if (employee?.payType === 'Hourly' && weeklyHours[empId] > 40) {
                totalOvertime += weeklyHours[empId] - 40;
            }
        }
        return totalOvertime;
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Payroll Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Payday</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{format(new Date(), 'MMM dd, yyyy')}</div>
                    <p className="text-xs text-muted-foreground">Bi-weekly pay cycle</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Payroll Total</CardTitle>
                    <HandCoins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$56,789.12</div>
                    <p className="text-xs text-muted-foreground">Paid on July 20, 2024</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Overtime (Week)</CardTitle>
                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{getWeekOvertime().toFixed(2)} hrs</div>
                    <p className="text-xs text-muted-foreground">Total across all hourly employees</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No pending payroll runs</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Process Payroll</CardTitle>
                <CardDescription>Start a new payroll run for the current pay period.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-muted rounded-lg">
                    <div>
                        <h3 className="font-semibold">Next Pay Period: {format(new Date(), 'MMM dd')} - {format(new Date(), 'MMM dd, yyyy')}</h3>
                        <p className="text-sm text-muted-foreground">Review timecards and click "Run Payroll" to begin processing.</p>
                    </div>
                    <Button size="lg" className="mt-4 sm:mt-0">Run Payroll</Button>
                </div>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Employee Compensation</CardTitle>
                    <CardDescription>Manage pay rates and types for all employees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map(emp => (
                                <TableRow key={emp.id}>
                                    <TableCell>
                                        <p className="font-medium">{emp.name}</p>
                                        <p className="text-xs text-muted-foreground">{emp.role}</p>
                                    </TableCell>
                                    <TableCell>{emp.payType || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        {emp.payType === 'Hourly' && emp.payRate ? `$${emp.payRate.toFixed(2)} / hr` : ''}
                                        {emp.payType === 'Salary' && emp.payRate ? `$${emp.payRate.toLocaleString()}` : ''}
                                        {!emp.payType && 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit Compensation</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Payroll History</CardTitle>
                    <CardDescription>A log of all previously processed payroll runs.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pay Period</TableHead>
                                <TableHead>Run Date</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayrollHistory.map(run => (
                                <TableRow key={run.id}>
                                    <TableCell className="font-medium">{run.period}</TableCell>
                                    <TableCell>{run.runDate}</TableCell>
                                    <TableCell className="text-right">{`$${run.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</TableCell>
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
