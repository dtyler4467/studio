
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AuditingPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Auditing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Auditing</CardTitle>
                <CardDescription>
                    The process of examining a company's financial records and statements for accuracy and compliance with accounting standards.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Auditing content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
