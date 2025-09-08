
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSchedule, Appointment } from "@/hooks/use-schedule"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const AddAppointmentDialog = ({ onSave, isOpen, onOpenChange }: { onSave: (data: Omit<Appointment, 'id' | 'status'>) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const [formData, setFormData] = React.useState({
        type: 'Inbound' as 'Inbound' | 'Outbound',
        carrier: '',
        scac: '',
        bolNumber: '',
        poNumber: '',
        sealNumber: '',
        driverName: '',
        appointmentTime: new Date(),
        door: '',
    });

    const handleSave = () => {
        onSave(formData);
    }

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new appointment to the schedule.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={formData.type} onValueChange={(value: 'Inbound' | 'Outbound') => setFormData({...formData, type: value})}>
                             <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inbound">Inbound</SelectItem>
                                <SelectItem value="Outbound">Outbound</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="carrier" className="text-right">Carrier</Label>
                        <Input id="carrier" value={formData.carrier} onChange={(e) => setFormData({...formData, carrier: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scac" className="text-right">SCAC</Label>
                        <Input id="scac" value={formData.scac} onChange={(e) => setFormData({...formData, scac: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bol" className="text-right">BOL #</Label>
                        <Input id="bol" value={formData.bolNumber} onChange={(e) => setFormData({...formData, bolNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="po" className="text-right">PO #</Label>
                        <Input id="po" value={formData.poNumber} onChange={(e) => setFormData({...formData, poNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="seal" className="text-right">Seal #</Label>
                        <Input id="seal" value={formData.sealNumber} onChange={(e) => setFormData({...formData, sealNumber: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="driver" className="text-right">Driver Name</Label>
                        <Input id="driver" value={formData.driverName} onChange={(e) => setFormData({...formData, driverName: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="door" className="text-right">Door</Label>
                        <Input id="door" value={formData.door} onChange={(e) => setFormData({...formData, door: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "col-span-3 justify-start text-left font-normal",
                                    !formData.appointmentTime && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.appointmentTime ? format(formData.appointmentTime, "PPP p") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.appointmentTime}
                                    onSelect={(date) => date && setFormData({...formData, appointmentTime: date})}
                                    initialFocus
                                />
                                <div className="p-2 border-t border-border">
                                    <Input
                                        type="time"
                                        value={format(formData.appointmentTime, "HH:mm")}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':');
                                            const newDate = new Date(formData.appointmentTime);
                                            newDate.setHours(parseInt(hours, 10));
                                            newDate.setMinutes(parseInt(minutes, 10));
                                            setFormData({...formData, appointmentTime: newDate});
                                        }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" onClick={handleSave}>Save Appointment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function AppointmentDataTable() {
    const { appointments, addAppointment, updateAppointmentStatus } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([{id: 'appointmentTime', desc: false}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [isAddOpen, setAddOpen] = React.useState(false);


    const handleAddAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
        addAppointment(data);
        toast({ title: 'Appointment Scheduled', description: 'The new appointment has been added to the calendar.'});
        setAddOpen(false);
    }
    
    const handleStatusChange = (appointmentId: string, status: Appointment['status']) => {
        updateAppointmentStatus(appointmentId, status);
        toast({ title: 'Status Updated', description: `Appointment has been marked as ${status}.`});
    }

    const columns: ColumnDef<Appointment>[] = [
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
        accessorKey: "appointmentTime",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Appointment Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div>{format(row.getValue("appointmentTime"), "Pp")}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
             const status = row.getValue("status") as Appointment['status'];
             const variant = {
                 'Scheduled': 'secondary',
                 'Arrived': 'default',
                 'Departed': 'outline',
                 'Missed': 'destructive',
             }[status] as "secondary" | "default" | "outline" | "destructive";
             return <Badge variant={variant} className={cn(status === 'Arrived' && 'bg-green-600')}>{status}</Badge>
        }
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "carrier",
        header: "Carrier",
      },
      {
        accessorKey: "bolNumber",
        header: "BOL #",
      },
      {
        accessorKey: "poNumber",
        header: "PO #",
      },
      {
        accessorKey: "door",
        header: "Door",
      },
       {
        accessorKey: "driverName",
        header: "Driver",
      },
       {
        accessorKey: "sealNumber",
        header: "Seal #",
      },
       {
        accessorKey: "scac",
        header: "SCAC",
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const appointment = row.original
    
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
                <DropdownMenuItem
                  onClick={() => handleStatusChange(appointment.id, 'Arrived')}
                >
                  Mark as Arrived
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(appointment.id, 'Departed')}
                >
                  Mark as Departed
                </DropdownMenuItem>
                 <DropdownMenuItem
                  onClick={() => handleStatusChange(appointment.id, 'Missed')}
                  className="text-destructive"
                >
                  Mark as Missed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  const table = useReactTable({
    data: appointments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search SCAC, BOL, Carrier, Seal, Name, PO..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex gap-2">
             <Button onClick={() => setAddOpen(true)}>
                <PlusCircle className="mr-2" />
                New Appointment
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
      <AddAppointmentDialog onSave={handleAddAppointment} isOpen={isAddOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
