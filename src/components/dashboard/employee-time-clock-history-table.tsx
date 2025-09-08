
"use client";

import * as React from "react";
import { useSchedule, TimeClockEvent } from "@/hooks/use-schedule";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
import { getSortedRowModel } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

type EmployeeTimeClockHistoryTableProps = {
  employeeId: string;
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
};

export function EmployeeTimeClockHistoryTable({
  employeeId,
}: EmployeeTimeClockHistoryTableProps) {
  const { timeClockEvents } = useSchedule();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const employeeEvents = React.useMemo(() => {
    return timeClockEvents
      .filter((e) => e.employeeId === employeeId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [timeClockEvents, employeeId]);

  const columns: ColumnDef<TimeClockEvent>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => <ClientFormattedDate date={row.original.timestamp} />,
      filterFn: (row, id, value: DateRange) => {
        const rowDate = new Date(row.getValue(id) as string);
        if (value.from && value.to) {
            return isWithinInterval(rowDate, { start: value.from, end: value.to });
        }
        return true;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as "in" | "out";
        return (
          <Badge
            variant={type === "in" ? "secondary" : "outline"}
            className="capitalize"
          >
            Clock {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as
          | "Pending"
          | "Approved"
          | "Denied";
        if (!status) return null;
        const variant = {
          Pending: "secondary",
          Approved: "default",
          Denied: "destructive",
        }[status] as "secondary" | "default" | "destructive";
        return (
          <Badge variant={variant} className={cn(status === "Approved" && "bg-green-600")}>
            {status}
          </Badge>
        );
      },
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => row.original.notes || 'N/A'
    }
  ];

  const table = useReactTable({
    data: employeeEvents,
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
    },
  });

  return (
    <div className="w-full">
        <div className="flex items-center py-4 gap-2">
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !table.getColumn("timestamp")?.getFilterValue() && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {(table.getColumn("timestamp")?.getFilterValue() as DateRange)?.from ? (
                    (table.getColumn("timestamp")?.getFilterValue() as DateRange)?.to ? (
                        <>
                        {format((table.getColumn("timestamp")?.getFilterValue() as DateRange).from!, "LLL dd, y")} -{" "}
                        {format((table.getColumn("timestamp")?.getFilterValue() as DateRange).to!, "LLL dd, y")}
                        </>
                    ) : (
                        format((table.getColumn("timestamp")?.getFilterValue() as DateRange).from!, "LLL dd, y")
                    )
                    ) : (
                    <span>Filter by date range...</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={(table.getColumn("timestamp")?.getFilterValue() as DateRange)?.from}
                    selected={table.getColumn("timestamp")?.getFilterValue() as DateRange}
                    onSelect={(range) => table.getColumn("timestamp")?.setFilterValue(range)}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            {table.getColumn("timestamp")?.getFilterValue() && (
                 <Button
                    variant="ghost"
                    onClick={() => table.getColumn("timestamp")?.setFilterValue(undefined)}
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
                  );
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
                  No time clock events found for this period.
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
  );
}
