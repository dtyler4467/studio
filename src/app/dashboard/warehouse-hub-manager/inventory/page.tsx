
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, FileText, MoreHorizontal, PlusCircle, AlertCircle, AlertTriangle, Boxes } from 'lucide-react';

const inventoryItems = [
    { sku: 'SKU12345', description: '1/2" Steel Bolts', location: 'Aisle 3, Bin 4', qty: 1250, reorderPoint: 500, status: 'In Stock' },
    { sku: 'SKU67890', description: '3/4" Nylon Washers', location: 'Aisle 5, Bin 2', qty: 450, reorderPoint: 500, status: 'Low Stock' },
    { sku: 'SKU54321', description: '2" Wood Screws', location: 'Aisle 1, Bin 1', qty: 3000, reorderPoint: 1000, status: 'In Stock' },
    { sku: 'SKU98765', description: 'M8 Hex Nuts', location: 'Aisle 3, Bin 5', qty: 0, reorderPoint: 200, status: 'Out of Stock' },
];

export default function InventoryPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Inventory Management" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
            </main>
        </div>
    );
}
