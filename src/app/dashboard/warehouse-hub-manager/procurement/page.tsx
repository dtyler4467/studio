
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, FileText, MoreHorizontal, AlertCircle, ShoppingCart, FilePlus, Users2 } from 'lucide-react';

const purchaseOrders = [
    { poNumber: 'PO-2024-001', supplier: 'Global Fasteners Inc.', orderDate: '2024-07-15', expectedDate: '2024-08-01', status: 'Shipped', total: '$1,250.00' },
    { poNumber: 'PO-2024-002', supplier: 'Steel Supply Co.', orderDate: '2024-07-20', expectedDate: '2024-08-05', status: 'Processing', total: '$3,400.00' },
    { poNumber: 'PO-2024-003', supplier: 'Packaging Pros', orderDate: '2024-07-22', expectedDate: '2024-07-29', status: 'Delivered', total: '$750.00' },
    { poNumber: 'PO-2024-004', supplier: 'Industrial Hardware LLC', orderDate: '2024-07-25', expectedDate: '2024-08-10', status: 'Pending Approval', total: '$5,600.00' },
];

export default function ProcurementPage() {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Procurement" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Procurement & Purchase Orders</CardTitle>
                        <CardDescription>
                        Manage purchase orders, suppliers, and incoming materials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Open Purchase Orders</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Items to Order</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-destructive">2</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Spend (Month)</CardTitle>
                                    <span className="h-4 w-4 text-muted-foreground font-bold">$</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$10,250.00</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Input placeholder="Search PO# or supplier..." className="max-w-sm" />
                                <Button variant="outline">Search</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline"><FilePlus className="mr-2" /> New Purchase Order</Button>
                                <Button variant="outline"><Users2 className="mr-2" /> Manage Suppliers</Button>
                                <Button variant="outline"><FileDown className="mr-2" /> Export Data</Button>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PO Number</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Order Date</TableHead>
                                        <TableHead>Expected Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseOrders.map((po) => (
                                        <TableRow key={po.poNumber}>
                                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                                            <TableCell>{po.supplier}</TableCell>
                                            <TableCell>{po.orderDate}</TableCell>
                                            <TableCell>{po.expectedDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    po.status === 'Delivered' ? 'default' :
                                                    po.status === 'Shipped' ? 'secondary' : 'outline'
                                                } className={po.status === 'Delivered' ? 'bg-green-600' : ''}>
                                                    {po.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{po.total}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>PO Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Receive Items</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">Cancel PO</DropdownMenuItem>
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
