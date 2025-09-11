

"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle, Download, Trash2, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
  } from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSchedule, Customer } from "@/hooks/use-schedule"

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(format(date, "PPP"));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[90px]" />;
    }

    return <div>{formattedDate}</div>;
}


const AddCustomerDialog = ({ onSave, onOpenChange, isOpen }: { onSave: (customer: Omit<Customer, 'id' | 'dateAdded'>) => void, onOpenChange: (open: boolean) => void, isOpen: boolean }) => {
    const [formData, setFormData] = React.useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Active" as Customer['status'],
        items: [] as string[],
        destination: "",
    });
    const [currentItem, setCurrentItem] = React.useState("");

    const handleAddItem = () => {
        if (currentItem.trim() && !formData.items.includes(currentItem.trim())) {
            setFormData(f => ({ ...f, items: [...f.items, currentItem.trim()] }));
            setCurrentItem("");
        }
    };

    const handleRemoveItem = (itemToRemove: string) => {
        setFormData(f => ({ ...f, items: f.items.filter(item => item !== itemToRemove) }));
    };

    const handleSave = () => {
        onSave(formData);
        setFormData({ name: "", company: "", email: "", phone: "", status: "Active", items: [], destination: "" });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-right">Company</Label>
                        <Input id="company" value={formData.company} onChange={e => setFormData(f => ({...f, company: e.target.value}))} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData(f => ({...f, phone: e.target.value}))} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="destination" className="text-right">Destination</Label>
                        <Input id="destination" value={formData.destination} onChange={e => setFormData(f => ({...f, destination: e.target.value}))} className="col-span-3" placeholder="e.g. Los Angeles, CA" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="item" className="text-right pt-2">Default Items</Label>
                        <div className="col-span-3 space-y-2">
                             <div className="flex gap-2">
                                <Input 
                                    id="item" 
                                    value={currentItem} 
                                    onChange={(e) => setCurrentItem(e.target.value)}
                                    placeholder="e.g., Pallets"
                                />
                                <Button type="button" size="icon" variant="outline" onClick={handleAddItem}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.items.map(item => (
                                    <Badge key={item} variant="secondary">
                                        {item}
                                        <button onClick={() => handleRemoveItem(item)} className="ml-1.5 p-0.5 rounded-full hover:bg-background">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Add Customer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function CustomerDataTable() {
    const { customers, addCustomer, updateCustomerStatus } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isAddOpen, setAddOpen] = React.useState(false);

    const handleAddCustomer = (customer: Omit<Customer, 'id' | 'dateAdded'>) => {
        addCustomer(customer);
        setAddOpen(false);
        toast({ title: "Customer Added", description: `${customer.name} has been added.` });
    };
    
    const handleStatusChange = (customerId: string, status: Customer['status']) => {
        updateCustomerStatus(customerId, status);
        toast({ title: "Status Updated", description: "Customer status has been changed."});
    };


    const exportToCsv = () => {
        const headers = ["ID", "Name", "Company", "Email", "Phone", "Status", "Date Added"];
        const rows = table.getRowModel().rows.map(row => row.original).map(customer => [
            customer.id,
            `"${customer.name}"`,
            `"${customer.company}"`,
            customer.email,
            customer.phone,
            customer.status,
            format(customer.dateAdded, "yyyy-MM-dd")
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "The customer data has been exported to a CSV file.",
        });
    };

    const columns: ColumnDef<Customer>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: "Customer ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "company",
        header: "Company",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <Select
                    value={customer.status}
                    onValueChange={(value: Customer['status']) => handleStatusChange(customer.id, value)}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            )
        }
      },
      {
        accessorKey: "dateAdded",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Added
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <ClientFormattedDate date={row.getValue("dateAdded")} />,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const customer = row.original
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
                  Copy Customer ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Customer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by name, company, or email..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={() => setAddOpen(true)}>
                <PlusCircle className="mr-2" /> Add Customer
            </Button>
            <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2" /> Export
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('[role="combobox"]')) {
                          e.stopPropagation();
                      }
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={(e) => {
                        if (cell.column.id === 'status' || cell.column.id === 'actions' || cell.column.id === 'select') {
                            e.stopPropagation();
                        }
                    }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <AddCustomerDialog onSave={handleAddCustomer} isOpen={isAddOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
