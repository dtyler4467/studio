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
import { useToast } from "@/hooks/use-toast"

type Load = {
  id: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  rate: number
  status: "Available" | "Assigned" | "In-Transit" | "Delivered"
  assignedTo?: string;
}

const initialData: Load[] = [
    { id: "LD001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", pickupDate: "2024-08-01", deliveryDate: "2024-08-02", rate: 1200, status: "Available" },
    { id: "LD002", origin: "Chicago, IL", destination: "New York, NY", pickupDate: "2024-08-03", deliveryDate: "2024-08-05", rate: 2500, status: "Available" },
    { id: "LD003", origin: "Dallas, TX", destination: "Atlanta, GA", pickupDate: "2024-08-05", deliveryDate: "2024-08-07", rate: 1800, status: "Assigned", assignedTo: "Jane Doe" },
    { id: "LD004", origin: "Seattle, WA", destination: "Denver, CO", pickupDate: "2024-08-06", deliveryDate: "2024-08-08", rate: 2200, status: "In-Transit", assignedTo: "Mike Smith" },
    { id: "LD005", origin: "Miami, FL", destination: "Houston, TX", pickupDate: "2024-08-08", deliveryDate: "2024-08-10", rate: 2000, status: "Delivered", assignedTo: "Jane Doe" },
]

const drivers = [
    { id: "USR001", name: "John Doe" },
    { id: "USR002", name: "Jane Doe" },
    { id: "USR003", name: "Mike Smith" },
    { id: "USR004", name: "Emily Jones" },
]


export function LoadsDataTable() {
    const [data, setData] = React.useState<Load[]>(initialData);
    const [isAddLoadOpen, setAddLoadOpen] = React.useState(false);
    const [isAssignLoadOpen, setAssignLoadOpen] = React.useState(false);
    const [selectedLoad, setSelectedLoad] = React.useState<Load | null>(null);
    const [selectedDriver, setSelectedDriver] = React.useState<string>("");
    const { toast } = useToast();

    const deleteLoad = (id: string) => {
        setData(currentData => currentData.filter(load => load.id !== id));
        toast({
            title: "Load Deleted",
            description: `Load ${id} has been removed.`,
          });
    };

    const handleOpenAssignDialog = (load: Load) => {
        setSelectedLoad(load);
        setSelectedDriver("");
        setAssignLoadOpen(true);
    };

    const handleAssignLoad = () => {
        if (!selectedLoad || !selectedDriver) return;
        
        setData(currentData =>
          currentData.map(load =>
            load.id === selectedLoad.id
              ? { ...load, status: 'Assigned', assignedTo: drivers.find(d => d.id === selectedDriver)?.name }
              : load
          )
        );
        
        toast({
            title: "Load Assigned!",
            description: (
              <div>
                <p>Load <strong>{selectedLoad.id}</strong> assigned to <strong>{drivers.find(d => d.id === selectedDriver)?.name}</strong>.</p>
                <p className="text-xs mt-2">
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
        setData(currentData => [...currentData, { ...newLoad, id, status: 'Available' }]);
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
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => row.getValue("assignedTo") || "N/A"
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const load = row.original
    
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
                <DropdownMenuItem className="text-destructive" onClick={() => deleteLoad(load.id)}>
                    Delete Load
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setAddLoadOpen(false)}>Cancel</Button>
                            <Button type="submit">Add Load</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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

    