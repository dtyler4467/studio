

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
import { format, differenceInMinutes, formatDistanceStrict, isSameDay } from "date-fns"
import { useRouter } from "next/navigation"

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
import { MoreHorizontal, Pencil, Check, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { getSortedRowModel } from "@tanstack/react-table"
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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

    const columns: ColumnDef<TimeCardEntry>[] = [
      {
        accessorFn: (row) => row.employee.name,
        id: "employeeName",
        header: "Employee",
      },
      {
        id: 'clockIn',
        accessorKey: "clockIn.timestamp",
        header: "Clock In",
        cell: ({ row }) => <ClientFormattedDate date={row.original.clockIn.timestamp} />,
        filterFn: (row, id, value) => {
            const rowDate = new Date(row.getValue(id) as string);
            return isSameDay(rowDate, value);
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
            <div className="flex items-center py-4 gap-2">
                <Select
                    value={(table.getColumn('employeeName')?.getFilterValue() as string) ?? ''}
                    onValueChange={(value) => table.getColumn('employeeName')?.setFilterValue(value === 'all' ? '' : value)}
                >
                    <SelectTrigger className="w-[240px]">
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
                        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                            <span>{table.getColumn('clockIn')?.getFilterValue() ? format(table.getColumn('clockIn')?.getFilterValue() as Date, "PPP") : 'Filter by date...'}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={table.getColumn('clockIn')?.getFilterValue() as Date}
                            onSelect={(date) => table.getColumn('clockIn')?.setFilterValue(date)}
                            initialFocus
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
        </div>
    )
}
