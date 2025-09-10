
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default function FleetManagementPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Fleet Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Truck />
                    Fleet Management
                </CardTitle>
                <CardDescription>
                    Oversee your entire fleet, including vehicles, assignments, and vendors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Fleet Management content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
