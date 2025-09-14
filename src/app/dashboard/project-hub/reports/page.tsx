
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Presentation, ClipboardCheck, CheckCircle, Clock } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const taskStatusData = [
  { name: "To Do", value: 12, fill: "hsl(var(--chart-1))" },
  { name: "In Progress", value: 8, fill: "hsl(var(--chart-2))" },
  { name: "Review", value: 4, fill: "hsl(var(--chart-3))" },
  { name: "Done", value: 25, fill: "hsl(var(--chart-4))" },
];

const completedTasksData = [
    { project: "Q3 Campaign", tasks: 15 },
    { project: "Website V2", tasks: 8 },
    { project: "Mobile App", tasks: 2 },
];


export default function ProjectReportsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Reports & Analytics" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <Presentation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Active projects this quarter</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">49</div>
                    <p className="text-xs text-muted-foreground">+12 since last week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Completion</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <p className="text-xs text-muted-foreground">Based on project deadlines</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">4</div>
                    <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Tasks Completed per Project</CardTitle>
                    <CardDescription>A summary of work completed for each project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <BarChart data={completedTasksData} layout="vertical">
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="project" type="category" tickLine={false} tickMargin={10} axisLine={false} width={80} />
                            <XAxis type="number" hide />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Task Status Distribution</CardTitle>
                    <CardDescription>Current breakdown of all tasks across projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
      </main>
    </div>
  );
}
