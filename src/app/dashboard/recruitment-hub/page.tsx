
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase, UserPlus, Clock, Target, PlusCircle } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { JobPostingsTable } from '@/components/dashboard/job-postings-table';
import { ApplicantKanbanBoard } from '@/components/dashboard/applicant-kanban-board';
import { Button } from '@/components/ui/button';
import { AddJobPostingDialog } from '@/components/dashboard/add-job-posting-dialog';
import { AddApplicantDialog } from '@/components/dashboard/add-applicant-dialog';

export default function RecruitmentHubPage() {
  const { jobPostings, applicants } = useSchedule();

  const openPositions = jobPostings.filter(p => p.status === 'Open').length;
  const newApplicantsThisWeek = applicants.filter(a => {
    const today = new Date();
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    return new Date(a.applicationDate) >= oneWeekAgo;
  }).length;
  
  // Mock data for average time to hire
  const avgTimeToHire = 28;

  const hiredCount = applicants.filter(a => a.status === 'Hired').length;


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Recruitment Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{openPositions}</div>
                    <p className="text-xs text-muted-foreground">Actively seeking candidates</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Applicants (Week)</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{newApplicantsThisWeek}</div>
                    <p className="text-xs text-muted-foreground">New candidates this week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgTimeToHire} days</div>
                    <p className="text-xs text-muted-foreground">From application to offer</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Hires (YTD)</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{hiredCount}</div>
                    <p className="text-xs text-muted-foreground">New team members this year</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Applicant Tracking</CardTitle>
                <CardDescription>
                    Manage candidates through your hiring pipeline. Drag and drop to update their status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ApplicantKanbanBoard />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Job Postings</CardTitle>
                    <CardDescription>
                        Create, view, and manage job openings for your company.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <AddApplicantDialog />
                    <AddJobPostingDialog />
                </div>
            </CardHeader>
            <CardContent>
                <JobPostingsTable />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
