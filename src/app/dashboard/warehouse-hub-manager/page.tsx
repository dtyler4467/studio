
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Boxes, FileText, ShoppingCart, ArrowDownToLine, ArrowUpFromLine, PlusCircle, Printer, MoreHorizontal, FileDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-primary col-span-full">{children}</h3>
);

const inventoryItems = [
    { sku: 'SKU12345', description: '1/2" Steel Bolts', location: 'Aisle 3, Bin 4', qty: 1250, reorderPoint: 500, status: 'In Stock' },
    { sku: 'SKU67890', description: '3/4" Nylon Washers', location: 'Aisle 5, Bin 2', qty: 450, reorderPoint: 500, status: 'Low Stock' },
    { sku: 'SKU54321', description: '2" Wood Screws', location: 'Aisle 1, Bin 1', qty: 3000, reorderPoint: 1000, status: 'In Stock' },
    { sku: 'SKU98765', description: 'M8 Hex Nuts', location: 'Aisle 3, Bin 5', qty: 0, reorderPoint: 200, status: 'Out of Stock' },
];

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
              <CardContent className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
                             <Boxes className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4,700</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Value of Inventory</CardTitle>
                             <span className="h-4 w-4 text-muted-foreground font-bold">$</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,345.67</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Items Low on Stock</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">1</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Search SKU or description..." className="max-w-sm" />
                        <Button variant="outline">Search</Button>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline"><PlusCircle className="mr-2" /> Add New Item</Button>
                        <Button variant="outline">Perform Cycle Count</Button>
                        <Button variant="outline"><FileDown className="mr-2" /> Export Inventory</Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Qty on Hand</TableHead>
                                <TableHead>Reorder Point</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryItems.map((item) => (
                                <TableRow key={item.sku}>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{item.qty.toLocaleString()}</TableCell>
                                    <TableCell>{item.reorderPoint.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.status === 'In Stock' ? 'default' :
                                            item.status === 'Low Stock' ? 'secondary' : 'destructive'
                                        } className={item.status === 'In Stock' ? 'bg-green-600' : ''}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                                <DropdownMenuItem>View History</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete Item</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                <CardTitle className="font-headline">Receiving Dock</CardTitle>
                <CardDescription>
                    Process incoming shipments. Find the PO, verify quantities, and receive items into inventory.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="po-search">Search by PO Number</Label>
                        <div className="flex gap-2">
                            <Input id="po-search" placeholder="Enter PO Number..." />
                            <Button>Find PO</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bol-search">BOL Number</Label>
                        <Input id="bol-search" placeholder="Enter BOL..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="carrier-receiving">Carrier</Label>
                        <Input id="carrier-receiving" placeholder="Enter Carrier Name..." />
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-semibold mb-4">Items to Receive</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">SKU</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[100px]">Expected</TableHead>
                                    <TableHead className="w-[100px]">Received</TableHead>
                                    <TableHead className="w-[100px]">Damaged</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Input defaultValue="SKU12345" />
                                    </TableCell>
                                    <TableCell className="font-medium">1/2" Steel Bolts</TableCell>
                                    <TableCell>50</TableCell>
                                    <TableCell>
                                        <Input type="number" defaultValue="50" />
                                    </TableCell>
                                     <TableCell>
                                        <Input type="number" defaultValue="0" />
                                    </TableCell>
                                    <TableCell>
                                        <Input placeholder="e.g. Box torn" />
                                    </TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell>
                                        <Input defaultValue="SKU67890" />
                                    </TableCell>
                                    <TableCell className="font-medium">3/4" Nylon Washers</TableCell>
                                    <TableCell>100</TableCell>
                                    <TableCell>
                                        <Input type="number" defaultValue="100" />
                                    </TableCell>
                                     <TableCell>
                                        <Input type="number" defaultValue="0" />
                                    </TableCell>
                                     <TableCell>
                                        <Input />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                     <Button variant="outline" size="sm" className="mt-4"><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                     <SectionTitle>Receiving Notes</SectionTitle>
                      <div className="space-y-2">
                        <Textarea placeholder="Note any discrepancies, damages, or other observations..." />
                    </div>
                </div>

              </CardContent>
               <CardFooter className="gap-2">
                    <Button size="lg">Receive Shipment</Button>
                    <Button variant="ghost">Clear Form</Button>
                </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Shipping / Order Fulfillment</CardTitle>
                <CardDescription>
                    Find an order to prepare and manage an outbound shipment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="so-search">Search by Sales Order #</Label>
                        <div className="flex gap-2">
                            <Input id="so-search" placeholder="Enter SO Number..." />
                            <Button>Find Order</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cust-po-search">Customer PO #</Label>
                        <Input id="cust-po-search" placeholder="Enter Customer PO..." />
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-semibold mb-4">Items to Ship</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">SKU</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[120px]">Location</TableHead>
                                    <TableHead className="w-[100px]">Ordered</TableHead>
                                    <TableHead className="w-[100px]">Picked</TableHead>
                                    <TableHead className="w-[100px]">Backorder</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">SKU12345</TableCell>
                                    <TableCell>1/2" Steel Bolts</TableCell>
                                    <TableCell>Aisle 3, Bin 4</TableCell>
                                    <TableCell>25</TableCell>
                                    <TableCell><Input type="number" defaultValue="25" /></TableCell>
                                    <TableCell>0</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">SKU67890</TableCell>
                                    <TableCell>3/4" Nylon Washers</TableCell>
                                    <TableCell>Aisle 5, Bin 2</TableCell>
                                    <TableCell>50</TableCell>
                                    <TableCell><Input type="number" defaultValue="50" /></TableCell>
                                    <TableCell>0</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                     <Button variant="outline" size="sm" className="mt-4"><PlusCircle className="mr-2 h-4 w-4" />Scan/Add Item</Button>
                </div>

                 <Separator />

                <div className="space-y-4">
                     <SectionTitle>Shipping Details</SectionTitle>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="shipping-carrier">Carrier</Label>
                             <Select>
                                <SelectTrigger id="shipping-carrier">
                                    <SelectValue placeholder="Select a carrier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ups">UPS</SelectItem>
                                    <SelectItem value="fedex">FedEx</SelectItem>
                                    <SelectItem value="usps">USPS</SelectItem>
                                    <SelectItem value="dhl">DHL</SelectItem>
                                    <SelectItem value="ltl">LTL Freight</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tracking-number">Tracking Number</Label>
                            <Input id="tracking-number" placeholder="Enter tracking #..." />
                        </div>
                    </div>
                </div>

              </CardContent>
              <CardFooter className="gap-2">
                    <Button size="lg">Confirm Shipment</Button>
                    <Button variant="outline"><Printer className="mr-2" />Print Packing Slip</Button>
                    <Button variant="outline"><Printer className="mr-2" />Print Shipping Label</Button>
                    <Button variant="ghost">Clear Form</Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
