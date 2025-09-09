

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle, X, Download, Upload, Mail } from "lucide-react"
import { format, isWithinInterval, isValid, parse } from "date-fns"
import { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

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
import { useSchedule, Appointment, Employee } from "@/hooks/use-schedule"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { MultiSelect, MultiSelectOption } from "../ui/multi-select"

const ClientFormattedDate = ({ date }: { date: Date | string }) => {
  const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormattedDate(format(new Date(date), "PPP p"));
  }, [date]);

  if (!formattedDate) {
    return <Skeleton className="h-4 w-[150px]" />;
  }

  return <>{formattedDate}</>;
};

const AddAppointmentDialog = ({ onSave, isOpen, onOpenChange }: { onSave: (data: Omit<Appointment, 'id' | 'status'>) => void, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const [formData, setFormData] = React.useState({
        type: 'Inbound' as 'Inbound' | 'Outbound',
        carrier: '',
        scac: '',
        bolNumber: '',
        poNumber: '',
        sealNumber: '',
        driverName: '',
        driverPhoneNumber: '',
        driverLicenseNumber: '',
        driverLicenseState: '',
        appointmentTime: new Date(),
        door: '',
    });

    const handleSave = () => {
        onSave(formData);
    }

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new appointment to the schedule. An email will be generated.
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
                        <Label htmlFor="driverPhone" className="text-right">Driver Phone #</Label>
                        <Input id="driverPhone" value={formData.driverPhoneNumber} onChange={(e) => setFormData({...formData, driverPhoneNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="driverLicense" className="text-right">Driver License #</Label>
                        <Input id="driverLicense" value={formData.driverLicenseNumber} onChange={(e) => setFormData({...formData, driverLicenseNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="driverLicenseState" className="text-right">License State</Label>
                        <Input id="driverLicenseState" value={formData.driverLicenseState} onChange={(e) => setFormData({...formData, driverLicenseState: e.target.value})} className="col-span-3" />
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


const EmailDialog = ({
    isOpen,
    onOpenChange,
    appointment,
    employees,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: Appointment | null;
    employees: Employee[];
}) => {
    const [recipients, setRecipients] = React.useState<string[]>([]);
    const employeeOptions: MultiSelectOption[] = React.useMemo(() => employees.map(e => ({ value: e.email || '', label: e.name })).filter(e => e.value), [employees]);
    
    const handleSendEmail = () => {
        if (!appointment) return;

        const subject = `New ${appointment.type} Appointment: ${appointment.carrier} - ${appointment.bolNumber}`;
        const body = `A new gate appointment has been scheduled:\n\n` +
                     `Type: ${appointment.type}\n` +
                     `Carrier: ${appointment.carrier}\n` +
                     `Driver: ${appointment.driverName}\n` +
                     `BOL #: ${appointment.bolNumber}\n` +
                     `Time: ${format(appointment.appointmentTime, 'Pp')}\n` +
                     `Door: ${appointment.door || 'N/A'}\n\n` +
                     `Please be advised.`;
        
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
                        Select recipients to notify about appointment for "{appointment.carrier} - {appointment.bolNumber}".
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

export function AppointmentDataTable() {
    const { appointments, addAppointment, updateAppointmentStatus, employees } = useSchedule();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [sorting, setSorting] = React.useState<SortingState>([{id: 'appointmentTime', desc: false}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [isAddOpen, setAddOpen] = React.useState(false);
    const [isEmailOpen, setEmailOpen] = React.useState(false);
    const [appointmentToEmail, setAppointmentToEmail] = React.useState<Appointment | null>(null);

    const handleAddAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment = addAppointment(data);
        toast({ title: 'Appointment Scheduled', description: 'The new appointment has been added to the calendar.'});
        setAddOpen(false);
        setAppointmentToEmail(newAppointment);
        setEmailOpen(true);
    }
    
    const handleStatusChange = (appointmentId: string, status: Appointment['status']) => {
        updateAppointmentStatus(appointmentId, status);
        toast({ title: 'Status Updated', description: `Appointment has been marked as ${status}.`});
    }

    const exportToXlsx = () => {
        const dataToExport = table.getFilteredRowModel().rows.map(row => {
            const { id, status, type, carrier, scac, bolNumber, poNumber, sealNumber, driverName, driverPhoneNumber, driverLicenseNumber, driverLicenseState, appointmentTime, door } = row.original;
            return {
                ID: id,
                Status: status,
                Type: type,
                "Appointment Time": format(new Date(appointmentTime), "yyyy-MM-dd HH:mm:ss"),
                Carrier: carrier,
                SCAC: scac,
                "BOL #": bolNumber,
                "PO #": poNumber,
                "Seal #": sealNumber,
                "Driver Name": driverName,
                "Driver Phone #": driverPhoneNumber,
                "Driver License #": driverLicenseNumber,
                "License State": driverLicenseState,
                Door: door,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
        XLSX.writeFile(workbook, `Appointments_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        
        toast({
            title: "Export Successful",
            description: `${dataToExport.length} appointment(s) have been exported.`,
        });
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                json.forEach((row: any) => {
                    const appointmentTime = new Date(row["Appointment Time"]);
                    if (!isValid(appointmentTime)) {
                        throw new Error(`Invalid date format for row with Carrier ${row.Carrier}. Expected format like YYYY-MM-DD HH:MM:SS.`);
                    }

                    const newAppointment: Omit<Appointment, 'id' | 'status'> = {
                        type: row.Type === 'Inbound' ? 'Inbound' : 'Outbound',
                        carrier: String(row.Carrier),
                        scac: String(row.SCAC),
                        bolNumber: String(row["BOL #"]),
                        poNumber: String(row["PO #"]),
                        sealNumber: String(row["Seal #"]),
                        driverName: String(row["Driver Name"]),
                        driverPhoneNumber: row["Driver Phone #"] ? String(row["Driver Phone #"]) : undefined,
                        driverLicenseNumber: row["Driver License #"] ? String(row["Driver License #"]) : undefined,
                        driverLicenseState: row["License State"] ? String(row["License State"]) : undefined,
                        appointmentTime,
                        door: row.Door ? String(row.Door) : undefined,
                    };
                    addAppointment(newAppointment);
                });

                toast({
                    title: "Import Successful",
                    description: `${json.length} appointment(s) imported successfully.`,
                });

            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: error instanceof Error ? error.message : "An unknown error occurred during import.",
                });
            } finally {
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                 }
            }
        };
        reader.readAsBinaryString(file);
    };

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
        cell: ({ row }) => <ClientFormattedDate date={row.getValue("appointmentTime")} />,
        filterFn: (row, id, value: DateRange) => {
            const rowDate = new Date(row.getValue(id) as string);
            if (value.from && value.to) {
                return isWithinInterval(rowDate, { start: value.from, end: value.to });
            }
            return true;
        },
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
        accessorKey: "driverPhoneNumber",
        header: "Driver Phone #",
      },
       {
        accessorKey: "driverLicenseNumber",
        header: "Driver License #",
      },
       {
        accessorKey: "driverLicenseState",
        header: "License State",
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

  const dateRange = table.getColumn("appointmentTime")?.getFilterValue() as DateRange | undefined;

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'from' | 'to') => {
        const { value } = e.target;
        const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
        
        if (isValid(parsedDate)) {
            const currentRange = table.getColumn("appointmentTime")?.getFilterValue() as DateRange | undefined;
            const newRange = { from: currentRange?.from, to: currentRange?.to };

            if (field === 'from') {
                newRange.from = parsedDate;
            } else {
                newRange.to = parsedDate;
            }
            
            table.getColumn("appointmentTime")?.setFilterValue(newRange);
        }
    };


  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 gap-2">
        <Input
          placeholder="Search SCAC, BOL, Carrier, Seal, Name, PO..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
         <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                dateRange.to ? (
                    <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                    </>
                ) : (
                    format(dateRange.from, "LLL dd, y")
                )
                ) : (
                <span>Filter by date range...</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
             <div className="flex items-center space-x-2 p-4">
                <div className="grid gap-2">
                    <Label htmlFor="from" className="text-xs">From</Label>
                    <Input
                        id="from"
                        type="date"
                        value={dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleDateInputChange(e, 'from')}
                        className="w-full"
                    />
                </div>
                <div className="grid gap-2">
                     <Label htmlFor="to" className="text-xs">To</Label>
                    <Input
                        id="to"
                        type="date"
                        value={dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleDateInputChange(e, 'to')}
                        className="w-full"
                    />
                </div>
            </div>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => table.getColumn("appointmentTime")?.setFilterValue(range)}
                numberOfMonths={2}
            />
            </PopoverContent>
        </Popover>
        {dateRange && (
                <Button
                variant="ghost"
                onClick={() => table.getColumn("appointmentTime")?.setFilterValue(undefined)}
            >
                Reset
                <X className="ml-2 h-4 w-4" />
            </Button>
        )}
        <div className="ml-auto flex gap-2">
             <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileImport}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2" />
                Import
            </Button>
            <Button variant="outline" onClick={exportToXlsx}>
                <Download className="mr-2" />
                Export
            </Button>
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
       <EmailDialog 
        isOpen={isEmailOpen}
        onOpenChange={setEmailOpen}
        appointment={appointmentToEmail}
        employees={employees}
      />
    </div>
  )
}
