

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle, Mail } from "lucide-react"
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
import { useSchedule, OfficeAppointment, Employee } from "@/hooks/use-schedule"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { Textarea } from "../ui/textarea"
import { MultiSelect, MultiSelectOption } from "../ui/multi-select"

const ClientFormattedDate = ({ date }: { date: Date | string }) => {
  const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormattedDate(format(new Date(date), "Pp"));
  }, [date]);

  if (!formattedDate) {
    return <Skeleton className="h-4 w-[150px]" />;
  }

  return <>{formattedDate}</>;
};

const AddAppointmentDialog = ({ onSave, isOpen, onOpenChange, employees }: { onSave: (data: Omit<OfficeAppointment, 'id' | 'status'>) => void, isOpen: boolean, onOpenChange: (open: boolean) => void, employees: MultiSelectOption[] }) => {
    const [formData, setFormData] = React.useState<Omit<OfficeAppointment, 'id' | 'status'>>({
        title: '',
        type: 'Standard',
        attendees: [],
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
        notes: '',
    });

    const handleSave = () => {
        onSave(formData);
        // Reset form state if needed
        setFormData({
            title: '', type: 'Standard', attendees: [],
            startTime: new Date(), endTime: new Date(new Date().getTime() + 60 * 60 * 1000), notes: ''
        });
    }
    
    const setDateTime = (date: Date, field: 'startTime' | 'endTime', time: string) => {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(date);
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
        setFormData({...formData, [field]: newDate });
    }

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                <DialogTitle>Schedule New Office Appointment</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new appointment. An email will be generated.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={formData.type} onValueChange={(value: OfficeAppointment['type']) => setFormData({...formData, type: value})}>
                             <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Meeting">Meeting</SelectItem>
                                <SelectItem value="Visitor">Visitor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="attendees" className="text-right">Attendees</Label>
                        <MultiSelect
                            options={employees}
                            selected={formData.attendees}
                            onChange={(selected) => setFormData({...formData, attendees: selected})}
                            className="col-span-3"
                            placeholder="Select attendees..."
                            allowOther
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Start Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("col-span-3 justify-start text-left font-normal")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(formData.startTime, "PPP p")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.startTime}
                                    onSelect={(date) => date && setFormData({...formData, startTime: date})}
                                    initialFocus
                                />
                                <div className="p-2 border-t border-border">
                                    <Input
                                        type="time"
                                        value={format(formData.startTime, "HH:mm")}
                                        onChange={(e) => setDateTime(formData.startTime, 'startTime', e.target.value)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">End Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("col-span-3 justify-start text-left font-normal")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(formData.endTime, "PPP p")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.endTime}
                                    onSelect={(date) => date && setFormData({...formData, endTime: date})}
                                    initialFocus
                                />
                                <div className="p-2 border-t border-border">
                                    <Input
                                        type="time"
                                        value={format(formData.endTime, "HH:mm")}
                                        onChange={(e) => setDateTime(formData.endTime, 'endTime', e.target.value)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                         <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                         <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="col-span-3" />
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

const EmailDialog = ({
    isOpen,
    onOpenChange,
    appointment,
    employees,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: OfficeAppointment | null;
    employees: Employee[];
}) => {
    const [recipients, setRecipients] = React.useState<string[]>([]);
    const employeeOptions: MultiSelectOption[] = React.useMemo(() => employees.map(e => ({ value: e.email || '', label: e.name })).filter(e => e.value), [employees]);

    React.useEffect(() => {
        if (appointment) {
            const attendeeEmails = appointment.attendees
                .map(attendeeName => employees.find(emp => emp.name === attendeeName)?.email)
                .filter((email): email is string => !!email);
            setRecipients(attendeeEmails);
        }
    }, [appointment, employees]);
    
    const handleSendEmail = () => {
        if (!appointment) return;

        const subject = `New Appointment: ${appointment.title}`;
        const body = `You have been invited to a new appointment:\n\n` +
                     `Title: ${appointment.title}\n` +
                     `Type: ${appointment.type}\n` +
                     `Start: ${format(appointment.startTime, 'Pp')}\n` +
                     `End: ${format(appointment.endTime, 'Pp')}\n\n` +
                     `Notes: ${appointment.notes || 'N/A'}`;
        
        window.location.href = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        onOpenChange(false);
    };

    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Email Appointment Confirmation</DialogTitle>
                    <DialogDescription>
                        Select recipients and send the email for "{appointment.title}".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center gap-1.5">
                        <Label htmlFor="recipients">Recipients</Label>
                         <MultiSelect
                            options={employeeOptions}
                            selected={recipients}
                            onChange={setRecipients}
                            className="col-span-3"
                            placeholder="Select or type email..."
                            allowOther
                        />
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Skip</Button>
                    <Button onClick={handleSendEmail} disabled={recipients.length === 0}>
                        <Mail className="mr-2" /> Send Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export function OfficeAppointmentDataTable() {
    const { officeAppointments, addOfficeAppointment, updateOfficeAppointmentStatus, employees } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([{id: 'startTime', desc: false}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [isAddOpen, setAddOpen] = React.useState(false);
    const [isEmailOpen, setEmailOpen] = React.useState(false);
    const [appointmentToEmail, setAppointmentToEmail] = React.useState<OfficeAppointment | null>(null);
    
    const employeeOptions: MultiSelectOption[] = React.useMemo(() => employees.map(e => ({ value: e.name, label: e.name })), [employees]);

    const handleAddAppointment = (data: Omit<OfficeAppointment, 'id' | 'status'>) => {
        const newAppointment = addOfficeAppointment(data);
        toast({ title: 'Appointment Scheduled', description: 'The new appointment has been added to the calendar.'});
        setAddOpen(false);
        setAppointmentToEmail(newAppointment);
        setEmailOpen(true);
    }
    
    const handleStatusChange = (appointmentId: string, status: OfficeAppointment['status']) => {
        updateOfficeAppointmentStatus(appointmentId, status);
        toast({ title: 'Status Updated', description: `Appointment has been marked as ${status}.`});
    }

    const columns: ColumnDef<OfficeAppointment>[] = [
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
        accessorKey: "startTime",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Start Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <ClientFormattedDate date={row.getValue("startTime")} />,
      },
      {
        accessorKey: "endTime",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              End Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <ClientFormattedDate date={row.getValue("endTime")} />,
      },
      {
        accessorKey: "title",
        header: "Title"
      },
      {
        accessorKey: "attendees",
        header: "Attendees",
        cell: ({ row }) => {
            const attendees = row.getValue("attendees") as string[];
            return <div className="flex flex-wrap gap-1">{attendees.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}</div>
        },
        filterFn: (row, id, value) => {
            const attendees = row.getValue(id) as string[];
            return attendees.some(a => a.toLowerCase().includes(value.toLowerCase()));
        }
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
             const status = row.getValue("status") as OfficeAppointment['status'];
             const variant = {
                 'Scheduled': 'secondary',
                 'Completed': 'default',
                 'Canceled': 'destructive',
             }[status] as "secondary" | "default" | "destructive";
             return <Badge variant={variant} className={cn(status === 'Completed' && 'bg-green-600')}>{status}</Badge>
        }
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
                  onClick={() => handleStatusChange(appointment.id, 'Completed')}
                >
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(appointment.id, 'Canceled')}
                  className="text-destructive"
                >
                  Cancel Appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  const table = useReactTable({
    data: officeAppointments,
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
      <div className="flex flex-wrap items-center py-4 gap-2">
        <Input
          placeholder="Search by title, attendee, type..."
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
      <AddAppointmentDialog onSave={handleAddAppointment} isOpen={isAddOpen} onOpenChange={setAddOpen} employees={employeeOptions} />
      <EmailDialog 
        isOpen={isEmailOpen}
        onOpenChange={setEmailOpen}
        appointment={appointmentToEmail}
        employees={employees}
      />
    </div>
  )
}
