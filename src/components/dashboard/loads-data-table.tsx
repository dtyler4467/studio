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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type Load = {
  id: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  rate: number
  status: "Available" | "Assigned" | "In-Transit" | "Delivered" | "Pending" | "Deleted"
  assignedTo?: string;
  carrier?: string;
  scac?: string;
  dispatcher?: string;
}

const initialData: Load[] = [
    { id: "LD001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", pickupDate: "2024-08-01", deliveryDate: "2024-08-02", rate: 1200, status: "Available" },
    { id: "LD002", origin: "Chicago, IL", destination: "New York, NY", pickupDate: "2024-08-03", deliveryDate: "2024-08-05", rate: 2500, status: "Available" },
    { id: "LD003", origin: "Dallas, TX", destination: "Atlanta, GA", pickupDate: "2024-08-05", deliveryDate: "2024-08-07", rate: 1800, status: "Pending", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD004", origin: "Seattle, WA", destination: "Denver, CO", pickupDate: "2024-08-06", deliveryDate: "2024-08-08", rate: 2200, status: "In-Transit", assignedTo: "Mike Smith", carrier: "Knight-Swift", scac: "KNX", dispatcher: "Dispatcher Name" },
    { id: "LD005", origin: "Miami, FL", destination: "Houston, TX", pickupDate: "2024-08-08", deliveryDate: "2024-08-10", rate: 2000, status: "Delivered", assignedTo: "Jane Doe", carrier: "Swift Logistics", scac: "SWFT", dispatcher: "Dispatcher Name" },
    { id: "LD006", origin: "Boston, MA", destination: "Washington, DC", pickupDate: "2024-08-10", deliveryDate: "2024-08-11", rate: 900, status: "Deleted" },
]

const drivers = [
    { id: "USR001", name: "John Doe" },
    { id: "USR002", name: "Jane Doe" },
    { id: "USR003", name: "Mike Smith" },
    { id: "USR004", name: "Emily Jones" },
]

type LoadsDataTableProps = {
    isEditable?: boolean;
};

export function LoadsDataTable({ isEditable = false }: LoadsDataTableProps) {
    const [data, setData] = React.useState<Load[]>(initialData);
    const [isAddLoadOpen, setAddLoadOpen] = React.useState(false);
    const [isAssignLoadOpen, setAssignLoadOpen] = React.useState(false);
    const [selectedLoad, setSelectedLoad] = React.useState<Load | null>(null);
    const [selectedDriver, setSelectedDriver] = React.useState<string>("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const { toast } = useToast();

    const deleteLoad = (id: string) => {
        setData(currentData => currentData.map(load => load.id === id ? { ...load, status: 'Deleted' } : load));
        toast({
            title: "Load Marked as Deleted",
            description: `Load ${id} has been marked as deleted.`,
        });
    };

    const acceptLoad = (load: Load) => {
        // In a real app, the driver name would come from the authenticated user.
        const driverName = "John Doe"; 
        setData(currentData =>
          currentData.map(l =>
            l.id === load.id
              ? { ...l, status: 'Pending', assignedTo: driverName }
              : l
          )
        );
        toast({
            title: "Load Accepted!",
            description: `You have accepted Load ${load.id}. It is now in your pending loads.`,
        });
    };

    const handleOpenAssignDialog = (load: Load) => {
        setSelectedLoad(load);
        setSelectedDriver("");
        setAssignLoadOpen(true);
    };

    const handleAssignLoad = () => {
        if (!selectedLoad || !selectedDriver) return;
        
        // In a real app, you'd get the dispatcher's name from the authenticated user session.
        const dispatcherName = "Dispatcher Name";

        setData(currentData =>
          currentData.map(load =>
            load.id === selectedLoad.id
              ? { ...load, status: 'Pending', assignedTo: drivers.find(d => d.id === selectedDriver)?.name, dispatcher: dispatcherName }
              : load
          )
        );
        
        const assignedDriverName = drivers.find(d => d.id === selectedDriver)?.name;
        toast({
            title: "Load Assigned!",
            description: (
              <div>
                <p>Load <strong>{selectedLoad.id}</strong> assigned to <strong>{assignedDriverName}</strong> by {dispatcherName}.</p>
                <p className="text-xs mt-2">
                  Carrier: {selectedLoad.carrier || 'N/A'}, SCAC: {selectedLoad.scac || 'N/A'}<br/>
                  {selectedLoad.origin} to {selectedLoad.destination}<br />
                  Pickup: {selectedLoad.pickupDate}
                </p>
              </div>
            ),
        });

        setAssignLoadOpen(false);
        setSelectedLoad(null);
        setSelectedDriver("");
    };

    const addLoad = (newLoad: Omit<Load, 'id' | 'status'>) => {
        const id = `LD${(data.length + 101).toString()}`;
        setData(currentData => [{ ...newLoad, id, status: 'Available' }, ...currentData]);
        setAddLoadOpen(false);
        toast({
            title: "Load Added",
            description: `New load ${id} has been created.`,
        });
    };

    const columns: ColumnDef<Load>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
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
        header: "Load ID",
      },
      {
        accessorKey: "origin",
        header: "Origin",
      },
      {
        accessorKey: "destination",
        header: "Destination",
      },
      {
        accessorKey: "rate",
        header: ({ column }) => {
          return (
            <div className="text-right">
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Rate
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="text-right">${row.getValue<number>("rate").toLocaleString()}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "carrier",
        header: "Carrier",
        cell: ({ row }) => row.getValue("carrier") || "N/A"
      },
      {
        accessorKey: "scac",
        header: "SCAC",
        cell: ({ row }) => row.getValue("scac") || "N/A"
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => row.getValue("assignedTo") || "N/A"
      },
      {
        accessorKey: "dispatcher",
        header: "Dispatcher",
        cell: ({ row }) => row.getValue("dispatcher") || "N/A"
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const load = row.original
            
            if (isEditable) {
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(load.id)}>
                          Copy load ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenAssignDialog(load)} disabled={load.status !== 'Available'}>
                            Assign Load
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteLoad(load.id)} disabled={load.status === 'Deleted'}>
                            Delete Load
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                )
            }

            return (
                <Button
                    onClick={() => acceptLoad(load)}
                    disabled={load.status !== 'Available'}
                    size="sm"
                >
                    Accept Load
                </Button>
            )
        },
      },
    ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      dispatcher: isEditable, 
      assignedTo: isEditable,
    })
  const [rowSelection, setRowSelection] = React.useState({})

  const filteredData = React.useMemo(() => {
    if (statusFilter === 'all') {
        return data.filter(load => isEditable || (load.status !== 'Deleted'));
    }
    const statusMap = {
        available: ['Available'],
        pending: ['Assigned', 'In-Transit', 'Pending'],
        completed: ['Delivered'],
        deleted: ['Deleted'],
    };
    const targetStatuses = statusMap[statusFilter as keyof typeof statusMap] || [];
    return data.filter(load => targetStatuses.includes(load.status) && (isEditable || load.status !== 'Deleted'));
  }, [data, statusFilter, isEditable]);

  const table = useReactTable({
    data: filteredData,
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
         <div className="flex items-center justify-between pb-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="overflow-x-auto">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    {isEditable && <TabsTrigger value="deleted">Deleted</TabsTrigger>}
                </TabsList>
            </Tabs>
        </div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by origin..."
          value={(table.getColumn("origin")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("origin")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
            {isEditable && (
                <Dialog open={isAddLoadOpen} onOpenChange={setAddLoadOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Load</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add New Load</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new load.
                        </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const newLoad = {
                            origin: formData.get("origin") as string,
                            destination: formData.get("destination") as string,
                            pickupDate: formData.get("pickupDate") as string,
                            deliveryDate: formData.get("deliveryDate") as string,
                            rate: Number(formData.get("rate")),
                            carrier: formData.get("carrier") as string,
                            scac: formData.get("scac") as string,
                            };
                            addLoad(newLoad);
                        }}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="origin" className="text-right">Origin</Label>
                                    <Input id="origin" name="origin" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="destination" className="text-right">Destination</Label>
                                    <Input id="destination" name="destination" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="pickupDate" className="text-right">Pickup Date</Label>
                                    <Input id="pickupDate" name="pickupDate" type="date" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="deliveryDate" className="text-right">Delivery Date</Label>
                                    <Input id="deliveryDate" name="deliveryDate" type="date" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="rate" className="text-right">Rate ($)</Label>
                                    <Input id="rate" name="rate" type="number" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="carrier" className="text-right">Carrier</Label>
                                    <Input id="carrier" name="carrier" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="scac" className="text-right">SCAC</Label>
                                    <Input id="scac" name="scac" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setAddLoadOpen(false)}>Cancel</Button>
                                <Button type="submit">Add Load</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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
                        {column.id.replace(/([A-Z])/g, ' $1')}
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
       {/* Assign Load Dialog */}
       <Dialog open={isAssignLoadOpen} onOpenChange={setAssignLoadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Load: {selectedLoad?.id}</DialogTitle>
            <DialogDescription>
              Select a driver to assign this load to. The driver will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Driver
              </Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAssignLoadOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAssignLoad} disabled={!selectedDriver}>
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
