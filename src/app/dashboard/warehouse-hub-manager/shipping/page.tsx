
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Printer } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-primary col-span-full">{children}</h3>
);

export default function ShippingPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Shipping" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
            </main>
        </div>
    );
}
