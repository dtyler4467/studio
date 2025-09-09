
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-primary col-span-full">{children}</h3>
);

export default function ReceivingPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Receiving" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
            </main>
        </div>
    );
}
