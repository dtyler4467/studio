
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSchedule } from '@/hooks/use-schedule';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { differenceInMinutes, format, isSameDay, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { Clock, Hourglass, Timer, UserCheck } from 'lucide-react';

export default function TimeTrackerOverviewPage() {
    const { timeClockEvents, employees } = useSchedule();

    const timeCardEntries = useMemo(() => {
        const entriesMap = new Map<string, { clockIn: any, clockOut?: any }>();
        const sortedEvents = [...timeClockEvents].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sortedEvents.forEach(event => {
            const key = `${event.employeeId}-${format(new Date(event.timestamp), 'yyyy-MM-dd')}`;
            if (event.type === 'in') {
                entriesMap.set(key, { clockIn: event });
            } else if (event.type === 'out') {
                const existing = entriesMap.get(key);
                if (existing && !existing.clockOut) {
                    existing.clockOut = event;
                }
            }
        });

        const entries = Array.from(entriesMap.values()).map(({ clockIn, clockOut }) => {
            const employee = employees.find(e => e.id === clockIn.employeeId);
            let minutes = 0;
            if (clockOut) {
                minutes = differenceInMinutes(new Date(clockOut.timestamp), new Date(clockIn.timestamp));
            }
            return {
                employee,
                date: new Date(clockIn.timestamp),
                minutes,
                onTime: new Date(clockIn.timestamp).getHours() <= 9, // Example: on time if before 9 AM
            };
        });
        return entries;
    }, [timeClockEvents, employees]);
    
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const weeklyData = useMemo(() => {
        const data = Array(7).fill(0).map((_, i) => ({
            day: format(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i), 'EEE'),
            hours: 0,
        }));
        
        timeCardEntries.forEach(entry => {
            if (entry.date >= weekStart) {
                const dayIndex = entry.date.getDay() === 0 ? 6 : entry.date.getDay() - 1; // Mon-Sun
                if (dayIndex >= 0 && dayIndex < 7) {
                    data[dayIndex].hours += entry.minutes / 60;
                }
            }
        });
        return data.map(d => ({ ...d, hours: parseFloat(d.hours.toFixed(2))}));
    }, [timeCardEntries, weekStart]);

    const totalHoursThisWeek = weeklyData.reduce((acc, day) => acc + day.hours, 0);
    const onTimePercentage = timeCardEntries.length > 0 ? (timeCardEntries.filter(e => e.onTime).length / timeCardEntries.length) * 100 : 100;
    const avgShiftLength = timeCardEntries.length > 0 ? (timeCardEntries.reduce((acc, e) => acc + e.minutes, 0) / timeCardEntries.length) / 60 : 0;
    const overtimeHours = Math.max(0, totalHoursThisWeek - (employees.length * 40));

    const recentActivity = useMemo(() => {
         return [...timeClockEvents]
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .map(event => ({
                ...event,
                employee: employees.find(e => e.id === event.employeeId)
            }));
    }, [timeClockEvents, employees]);

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Time Clock Overview" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hours (This Week)</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Total hours clocked by all employees</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overtime Hours (Est.)</CardTitle>
                            <Hourglass className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">{overtimeHours.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Based on a 40-hour work week</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">On-Time Clock-Ins</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{onTimePercentage.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Percentage of on-time arrivals</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Shift Length</CardTitle>
                            <Timer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgShiftLength.toFixed(2)} hrs</div>
                            <p className="text-xs text-muted-foreground">Average duration of a single shift</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline">Weekly Hours</CardTitle>
                            <CardDescription>Total hours worked each day this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[300px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={weeklyData}>
                                        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}/>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline">Recent Activity</CardTitle>
                            <CardDescription>The latest clock-in and clock-out events.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead className="text-right">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {recentActivity.map(event => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">{event.employee?.name || 'Unknown'}</TableCell>
                                            <TableCell>
                                                <Badge variant={event.type === 'in' ? 'default' : 'secondary'}>
                                                    Clock {event.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">{format(new Date(event.timestamp), 'p')}</TableCell>
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
