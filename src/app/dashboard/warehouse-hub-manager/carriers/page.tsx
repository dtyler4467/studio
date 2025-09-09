import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default function CarriersPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Manage Carriers" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Truck />
                    Carrier Management
                </CardTitle>
                <CardDescription>
                    Add, view, and manage carrier information and contracts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Carrier management content coming soon.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
