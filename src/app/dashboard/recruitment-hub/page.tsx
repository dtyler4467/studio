import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function RecruitmentHubPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Recruitment Hub" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Briefcase />
                    Recruitment Hub
                </CardTitle>
                <CardDescription>
                    Manage job postings, applications, and the hiring process.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Recruitment Hub content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
