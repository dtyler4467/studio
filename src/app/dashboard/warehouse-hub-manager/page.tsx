
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Boxes, FileText, ShoppingCart, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function WarehouseHubManagerPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Warehouse Hub Manager" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="dashboard"><LayoutDashboard className="mr-2" />Dashboard</TabsTrigger>
            <TabsTrigger value="inventory"><Boxes className="mr-2" />Inventory</TabsTrigger>
            <TabsTrigger value="bol"><FileText className="mr-2" />Bill of Lading</TabsTrigger>
            <TabsTrigger value="procurement"><ShoppingCart className="mr-2" />Procurement</TabsTrigger>
            <TabsTrigger value="receiving"><ArrowDownToLine className="mr-2" />Receiving</TabsTrigger>
            <TabsTrigger value="shipping"><ArrowUpFromLine className="mr-2" />Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
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
          </TabsContent>
          
          <TabsContent value="inventory">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Inventory Management</CardTitle>
                <CardDescription>
                  Track stock levels, manage SKUs, and perform cycle counts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Inventory management table and tools coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bol">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Bill of Lading (BOL)</CardTitle>
                <CardDescription>
                  Create, view, and manage all Bills of Lading for shipments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">BOL creation and management system coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="procurement">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Procurement</CardTitle>
                <CardDescription>
                  Manage purchase orders, suppliers, and incoming materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Procurement and purchase order tools coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receiving">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Receiving</CardTitle>
                <CardDescription>
                    Process and check in incoming shipments against purchase orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Receiving dock management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Shipping</CardTitle>
                <CardDescription>
                    Prepare and manage outbound shipments, print labels, and coordinate with carriers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">Shipping and order fulfillment tools coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
