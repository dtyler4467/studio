
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function InvestigationPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="HR Investigations" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">HR Investigations</CardTitle>
                <CardDescription>
                    Manage and document internal investigations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Investigations content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
