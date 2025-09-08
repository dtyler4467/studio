
"use client";

import * as React from "react"
import { useSchedule, TimeClockEvent } from "@/hooks/use-schedule"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"
import { format } from "date-fns"

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
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { getSortedRowModel } from "@tanstack/react-table"
import { Skeleton } from "../ui/skeleton";

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(format(date, "PPP p"));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[150px]" />;
    }

    return <>{formattedDate}</>;
}


export function TimeClockAdminTable() {
    const { timeClockEvents, employees } = useSchedule()
    const { toast } = useToast()
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'timestamp', desc: true }])
    const [globalFilter, setGlobalFilter] = React.useState('')

    const getEmployeeName = (employeeId: string) => {
        return employees.find(e => e.id === employeeId)?.name || "Unknown";
    }

    const columns: ColumnDef<TimeClockEvent>[] = [
      {
        accessorKey: "employeeId",
        header: "Employee",
        cell: ({ row }) => getEmployeeName(row.original.employeeId),
      },
      {
        accessorKey: "timestamp",
        header: "Date & Time",
        cell: ({ row }) => <ClientFormattedDate date={new Date(row.original.timestamp)} />,
      },
       {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type;
            return <Badge variant={type === 'in' ? 'secondary' : 'outline'} className="capitalize">{type === 'in' ? 'Clock In' : 'Clock Out'}</Badge>
        }
      },
       {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => row.original.notes || 'N/A'
       },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Entry</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

    const table = useReactTable({
        data: timeClockEvents,
        columns,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            globalFilter,
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                placeholder="Search all entries..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
                />
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
