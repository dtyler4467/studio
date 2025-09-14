
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { View, Package, ListTodo, Clock, Users, ArrowRight } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProjectHubOverviewPage() {
    const { projects, tasks, employees } = useSchedule();

    const activeProjects = projects.length;
    const tasksInProgress = tasks.filter(t => t.status === 'In Progress').length;
    const upcomingDeadlines = projects.filter(p => p.dueDate && p.dueDate > new Date()).length;

    const recentActivity = tasks.slice(0, 5).map(task => {
        const employee = employees.find(e => e.id === task.assigneeId);
        return {
            ...task,
            employeeName: employee?.name || 'Unknown',
        };
    });
    
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Hub Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeProjects}</div>
                    <p className="text-xs text-muted-foreground">Currently ongoing projects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tasksInProgress}</div>
                    <p className="text-xs text-muted-foreground">Tasks currently being worked on</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingDeadlines}</div>
                    <p className="text-xs text-muted-foreground">Projects with deadlines this quarter</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <h2 className="text-2xl font-bold font-headline tracking-tight">Projects</h2>
                 {projects.map(project => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id);
                    const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
                    const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

                    return (
                        <Link href="/dashboard/project-hub/tasks" key={project.id}>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{project.name}</span>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} />
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex -space-x-2">
                                                {project.team.map(memberId => {
                                                    const member = employees.find(e => e.id === memberId);
                                                    return (
                                                        <Avatar key={memberId} className="border-2 border-background">
                                                            <AvatarFallback>{member?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                    )
                                                })}
                                            </div>
                                            {project.dueDate && <Badge variant="outline">Due: {format(project.dueDate, 'MMM dd')}</Badge>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                 })}
            </div>
             <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Recent Activity</CardTitle>
                        <CardDescription>Latest task updates across all projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {recentActivity.map(task => (
                                <div key={task.id} className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback className="text-xs">{task.employeeName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold">{task.employeeName}</span> updated a task: 
                                            <span className="font-medium text-primary ml-1">"{task.title}"</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(tasks.find(t=>t.id === task.id)!.dueDate || new Date(), { addSuffix: true })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
