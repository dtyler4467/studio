
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Truck, Warehouse, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function YardManagementOverviewPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Yard Management Overview" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trailers in Yard</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground">-5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Dwell Time</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 hours</div>
              <p className="text-xs text-muted-foreground">+0.2 from last week</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbound Today</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" style={{transform: 'scaleX(-1)'}} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
               <p className="text-xs text-muted-foreground">22 checked in</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outbound Today</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52</div>
               <p className="text-xs text-muted-foreground">31 checked out</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>
              Start common yard management tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
                <Link href="/dashboard/yard-management/check-in">
                    <Truck className="mr-2" /> Inbound/Outbound Processing
                </Link>
            </Button>
             <Button variant="secondary" asChild>
                <Link href="/dashboard/yard-management/history">
                    <BarChart className="mr-2" /> View Yard History
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
