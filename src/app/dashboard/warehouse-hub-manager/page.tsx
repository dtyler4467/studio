
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function WarehouseHubManagerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Warehouse Hub Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Warehouse Dashboard</CardTitle>
            <CardDescription>
              An overview of key metrics, recent activity, and quick actions for the warehouse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                <p className="text-muted-foreground">Dashboard content coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
