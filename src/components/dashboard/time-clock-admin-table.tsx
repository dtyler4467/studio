

"use client";

import * as React from "react"
import { useSchedule, TimeClockEvent, Employee } from "@/hooks/use-schedule"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { format, differenceInMinutes, formatDistanceStrict, isSameDay, isWithinInterval } from "date-fns"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { MoreHorizontal, Pencil, Check, X, Download, CalendarIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { getSortedRowModel } from "@tanstack/react-table"
import { Skeleton } from "../ui/skeleton"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"

type TimeCardEntry = {
    employee: Employee;
    clockIn: TimeClockEvent;
    clockOut?: TimeClockEvent;
    hours: string;
    status: 'Pending' | 'Approved' | 'Denied';
};


const ClientFormattedDate = ({ date }: { date: Date | string }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(format(new Date(date), "PPP p"));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[150px]" />;
    }

    return <>{formattedDate}</>;
}


export function TimeClockAdminTable() {
    const { timeClockEvents, employees, updateTimeClockStatus } = useSchedule()
    const { toast } = useToast()
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'clockIn', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
    const [exportDateRange, setExportDateRange] = React.useState<DateRange | undefined>();
    const [exportType, setExportType] = React.useState<'approved' | 'not-approved' | null>(null);


    const timeCardEntries = React.useMemo(() => {
        const entries: TimeCardEntry[] = [];
        const sortedEvents = [...timeClockEvents].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        employees.forEach(employee => {
            const employeeEvents = sortedEvents.filter(e => e.employeeId === employee.id);
            for (let i = 0; i < employeeEvents.length; i++) {
                if (employeeEvents[i].type === 'in') {
                    const clockIn = employeeEvents[i];
                    const clockOut = employeeEvents[i+1]?.type === 'out' ? employeeEvents[i+1] : undefined;
                    
                    let hours = 'In Progress';
                    if (clockOut) {
                         const start = new Date(clockIn.timestamp);
                         const end = new Date(clockOut.timestamp);
                         const diffMinutes = differenceInMinutes(end, start);
                         const totalHours = Math.floor(diffMinutes / 60);
                         const remainingMinutes = diffMinutes % 60;
                         hours = `${totalHours}h ${remainingMinutes}m`;
                    }

                    entries.push({
                        employee,
                        clockIn,
                        clockOut,
                        hours,
                        status: clockIn.status || 'Pending'
                    })

                    if (clockOut) {
                         i++;
                    }
                }
            }
        });

        return entries.sort((a,b) => new Date(b.clockIn.timestamp).getTime() - new Date(a.clockIn.timestamp).getTime());

    }, [timeClockEvents, employees]);

    const handleStatusChange = (clockInId: string, status: 'Approved' | 'Denied') => {
        updateTimeClockStatus(clockInId, status);
        toast({
            title: `Time Card ${status}`,
            description: `The time entry has been marked as ${status.toLowerCase()}.`
        })
    }
    
     const handleExport = (statusFilter: 'approved' | 'not-approved', dateRange?: DateRange) => {
        if (!dateRange?.from || !dateRange?.to) {
             toast({
                variant: 'destructive',
                title: 'Date Range Required',
                description: 'Please select a start and end date for the export.',
            });
            return;
        }

        const filteredData = timeCardEntries.filter(entry => {
            const entryDate = new Date(entry.clockIn.timestamp);
            const isInRange = isWithinInterval(entryDate, { start: dateRange.from!, end: dateRange.to! });
            
            if (!isInRange) return false;

            if (statusFilter === 'approved') return entry.status === 'Approved';
            return entry.status !== 'Approved';
        });

        if (filteredData.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data to Export',
                description: `There are no ${statusFilter.replace('-', ' ')} time card entries in the selected date range.`,
            });
            return;
        }

        const dataToExport = filteredData.map(entry => ({
            'Employee ID': entry.employee.personnelId,
            'Employee Name': entry.employee.name,
            'Work Location': entry.employee.workLocation || 'N/A',
            'Clock In': format(new Date(entry.clockIn.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            'Clock Out': entry.clockOut ? format(new Date(entry.clockOut.timestamp), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
            'Hours': entry.hours,
            'Status': entry.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Time Clock Report");

        XLSX.writeFile(workbook, `Time_Clock_Report_${statusFilter}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

        toast({
            title: 'Export Successful',
            description: `Successfully exported ${filteredData.length} entries.`,
        });
        
        // Close dialog after export
        setIsExportDialogOpen(false);
    };

    const openExportDialog = (type: 'approved' | 'not-approved') => {
        setExportType(type);
        setExportDateRange(undefined);
        setIsExportDialogOpen(true);
    };


    const columns: ColumnDef<TimeCardEntry>[] = [
      {
        accessorFn: (row) => row.employee.name,
        id: "employeeName",
        header: "Employee",
        cell: ({ row }) => (
            <div>
                <span className="font-medium">{row.original.employee.name}</span>
                <div className="text-sm text-muted-foreground">{row.original.employee.personnelId}</div>
            </div>
        )
      },
      {
        id: 'workLocation',
        header: "Work Location",
        accessorFn: (row) => row.employee.workLocation,
      },
      {
        id: 'clockIn',
        accessorKey: "clockIn.timestamp",
        header: "Clock In",
        cell: ({ row }) => <ClientFormattedDate date={row.original.clockIn.timestamp} />,
        filterFn: (row, id, value: DateRange) => {
            const rowDate = new Date(row.getValue(id) as string);
            if (value.from && value.to) {
                return isWithinInterval(rowDate, { start: value.from, end: value.to });
            }
            return true;
        },
      },
       {
        id: 'clockOut',
        accessorKey: "clockOut.timestamp",
        header: "Clock Out",
        cell: ({ row }) => row.original.clockOut ? <ClientFormattedDate date={row.original.clockOut.timestamp} /> : <Badge variant="secondary">In Progress</Badge>
      },
      {
          accessorKey: "hours",
          header: "Hours"
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as TimeCardEntry['status'];
             const variant = {
                "Pending": "secondary",
                "Approved": "default",
                "Denied": "destructive"
            }[status] as "secondary" | "default" | "destructive";

            return <Badge variant={variant} className={cn(status === 'Approved' && 'bg-green-600')}>{status}</Badge>
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
            const entry = row.original;
            const isComplete = !!entry.clockOut;
            return (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuItem disabled={!isComplete} onClick={() => handleStatusChange(entry.clockIn.id, 'Approved')}>
                            <Check className="mr-2" /> Approve
                        </DropdownMenuItem>
                         <DropdownMenuItem disabled={!isComplete} className="text-destructive" onClick={() => handleStatusChange(entry.clockIn.id, 'Denied')}>
                            <X className="mr-2" /> Deny
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Pencil className="mr-2" /> Edit Entry
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
      },
    ]

    const table = useReactTable({
        data: timeCardEntries,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center flex-wrap py-4 gap-2">
                <Select
                    value={(table.getColumn('employeeName')?.getFilterValue() as string) ?? ''}
                    onValueChange={(value) => table.getColumn('employeeName')?.setFilterValue(value === 'all' ? '' : value)}
                >
                    <SelectTrigger className="w-full sm:w-[240px]">
                        <SelectValue placeholder="Filter by employee..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
                        !table.getColumn("clockIn")?.getFilterValue() && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {(table.getColumn("clockIn")?.getFilterValue() as DateRange)?.from ? (
                        (table.getColumn("clockIn")?.getFilterValue() as DateRange)?.to ? (
                            <>
                            {format((table.getColumn("clockIn")?.getFilterValue() as DateRange).from!, "LLL dd, y")} -{" "}
                            {format((table.getColumn("clockIn")?.getFilterValue() as DateRange).to!, "LLL dd, y")}
                            </>
                        ) : (
                            format((table.getColumn("clockIn")?.getFilterValue() as DateRange).from!, "LLL dd, y")
                        )
                        ) : (
                        <span>Filter by date...</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={(table.getColumn("clockIn")?.getFilterValue() as DateRange)?.from}
                        selected={table.getColumn("clockIn")?.getFilterValue() as DateRange}
                        onSelect={(range) => table.getColumn("clockIn")?.setFilterValue(range)}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                 {(table.getColumn('employeeName')?.getFilterValue() || table.getColumn('clockIn')?.getFilterValue()) && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                 )}
                 <div className="flex-grow"></div>
                 <div className="flex gap-2">
                     <Button variant="outline" onClick={() => openExportDialog('approved')}>
                        <Download className="mr-2" /> Export Approved
                    </Button>
                     <Button variant="outline" onClick={() => openExportDialog('not-approved')}>
                        <Download className="mr-2" /> Export Not Approved
                    </Button>
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
                            key={row.original.clockIn.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="cursor-pointer"
                            onClick={() => router.push(`/dashboard/administration/time-clock/${row.original.employee.id}`)}
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} onClick={(e) => {
                                if (cell.column.id === 'actions') {
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
                        No time clock entries found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
             <div className="flex items-center justify-end space-x-2 py-4">
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

            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Export Date Range</DialogTitle>
                        <DialogDescription>
                            Please select a date range for the time clock report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !exportDateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {exportDateRange?.from ? (
                                exportDateRange.to ? (
                                    <>
                                    {format(exportDateRange.from, "LLL dd, y")} -{" "}
                                    {format(exportDateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(exportDateRange.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date range</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={exportDateRange?.from}
                                selected={exportDateRange}
                                onSelect={setExportDateRange}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={() => handleExport(exportType!, exportDateRange)}
                            disabled={!exportDateRange?.from || !exportDateRange?.to}
                        >
                            <Download className="mr-2" />
                            Export Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
