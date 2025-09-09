import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Warehouse } from 'lucide-react';

export default function WarehouseHubManagerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Warehouse Hub Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Warehouse />
                Warehouse Hub Manager
            </CardTitle>
            <CardDescription>
              This is the central hub for managing all warehouse operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Warehouse Hub Manager content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
