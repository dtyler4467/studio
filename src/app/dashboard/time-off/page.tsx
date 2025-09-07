import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TimeOffPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Off" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Available PTO</CardTitle>
              <CardDescription>Your remaining paid time off balance.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">48 <span className="text-lg font-normal text-muted-foreground">hours</span></p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Request Time Off</CardTitle>
              <CardDescription>
                Submit a new request for paid time off. Requests are subject to manager approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-48">
                    <p className="text-muted-foreground">Time off request form coming soon.</p>
                </div>
            </CardContent>
          </Card>
        </div>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline">Request History</CardTitle>
            <CardDescription>
              View the status of your past and pending time off requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-64">
                <p className="text-muted-foreground">PTO request history coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
