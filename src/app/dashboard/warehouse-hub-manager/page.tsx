
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Boxes, FileText, ShoppingCart, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-primary col-span-full">{children}</h3>
);

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
                    <CardTitle className="font-headline">Master Bill of Lading</CardTitle>
                    <CardDescription>
                    Create a new Bill of Lading. Fill in the details below and save or print.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 rounded-md border p-4">
                             <SectionTitle>Shipper / Consignor</SectionTitle>
                             <div className="space-y-2">
                                <Label htmlFor="shipper-name">Name</Label>
                                <Input id="shipper-name" placeholder="Enter shipper's name" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="shipper-address">Address</Label>
                                <Input id="shipper-address" placeholder="Enter shipper's address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shipper-city">City</Label>
                                    <Input id="shipper-city" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="shipper-state">State</Label>
                                    <Input id="shipper-state" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shipper-zip">Zip Code</Label>
                                    <Input id="shipper-zip" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="shipper-phone">Phone</Label>
                                    <Input id="shipper-phone" type="tel" />
                                </div>
                            </div>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                             <SectionTitle>Consignee</SectionTitle>
                              <div className="space-y-2">
                                <Label htmlFor="consignee-name">Name</Label>
                                <Input id="consignee-name" placeholder="Enter consignee's name" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="consignee-address">Address</Label>
                                <Input id="consignee-address" placeholder="Enter consignee's address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="consignee-city">City</Label>
                                    <Input id="consignee-city" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="consignee-state">State</Label>
                                    <Input id="consignee-state" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="consignee-zip">Zip Code</Label>
                                    <Input id="consignee-zip" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="consignee-phone">Phone</Label>
                                    <Input id="consignee-phone" type="tel" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <SectionTitle>Shipment & Carrier Details</SectionTitle>
                        <div className="grid md:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="bol-number">BOL Number</Label>
                                <Input id="bol-number" placeholder="Auto-generated or manual" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="carrier-name">Carrier Name</Label>
                                <Input id="carrier-name" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="trailer-number">Trailer Number</Label>
                                <Input id="trailer-number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seal-number">Seal Number</Label>
                                <Input id="seal-number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="po-number">P.O. Number</Label>
                                <Input id="po-number" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ref-number">Reference Number</Label>
                                <Input id="ref-number" />
                            </div>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <SectionTitle>Commodities</SectionTitle>
                        <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-end">
                            <div className="col-span-2 space-y-1">
                                <Label>Units</Label>
                                <Input type="number" placeholder="1" />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <Label>Pkg. Type</Label>
                                <Input placeholder="Pallet" />
                            </div>
                            <div className="col-span-1 flex items-center space-x-2 pb-2">
                                <Checkbox id="hm" />
                                <Label htmlFor="hm" className="text-xs">HM</Label>
                            </div>
                             <div className="col-span-4 space-y-1">
                                <Label>Description of Articles</Label>
                                <Input placeholder="e.g. Canned Goods" />
                            </div>
                             <div className="col-span-1 space-y-1">
                                <Label>Weight</Label>
                                <Input type="number" />
                            </div>
                             <div className="col-span-2 space-y-1">
                                <Label>Class</Label>
                                <Input />
                            </div>
                        </div>
                         <Button variant="outline" size="sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>Add Line</Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                         <SectionTitle>Notes & Special Instructions</SectionTitle>
                          <div className="space-y-2">
                            <Textarea placeholder="Enter any special instructions for the carrier or consignee..." />
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="gap-2">
                    <Button>Save as Template</Button>
                    <Button variant="secondary">Print BOL</Button>
                    <Button variant="ghost">Clear Form</Button>
                </CardFooter>
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
