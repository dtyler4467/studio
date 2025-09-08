
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
import { format, isSameDay } from "date-fns"
import { ArrowUpDown, ChevronDown, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Badge } from "../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { useRouter } from "next/navigation"
import { YardEvent } from "@/hooks/use-schedule"


const filterableColumns = [
    { id: "trailerId", name: "Trailer ID" },
    { id: "sealNumber", name: "Seal Number"},
    { id: "scac", name: "SCAC" },
    { id: "driverName", name: "Driver" },
    { id: "clerkName", name: "Clerk" },
    { id: "transactionType", name: "Type" },
    { id: "assignmentType", name: "Assignment" },
    { id: "timestamp", name: "Date" },
];

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(format(date, "Pp"));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[120px]" />;
    }

    return <div>{formattedDate}</div>;
}


export function YardHistoryTable() {
    const { yardEvents } = useSchedule();
    const router = useRouter();
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
    
    const [sorting, setSorting] = React.useState<SortingState>([ { id: 'timestamp', desc: true } ])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    const onFilterChange = (columnId: string, value: any) => {
        table.getColumn(columnId)?.setFilterValue(value);
    }
    
    const toggleFilter = (columnId: string) => {
        setActiveFilters(prev => {
            const newFilters = prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId];
            
            // Clear filter value when removing filter
            if (!newFilters.includes(columnId)) {
                onFilterChange(columnId, undefined);
            }
            
            return newFilters;
        });
    };

    const table = useReactTable({
        data: yardEvents,
        columns: getColumns(onFilterChange),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
        },
    });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex items-center gap-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterableColumns.map(col => (
                         <DropdownMenuCheckboxItem
                            key={col.id}
                            checked={activeFilters.includes(col.id)}
                            onCheckedChange={() => toggleFilter(col.id)}
                        >
                            {col.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {activeFilters.length > 0 && (
                <Button variant="ghost" onClick={() => setActiveFilters([])} size="sm">
                    Clear Filters
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>

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
                    // Create a more readable label from the column ID
                    const formattedLabel = column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {formattedLabel}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

       {activeFilters.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4 p-4 border-b">
                {activeFilters.sort((a,b) => filterableColumns.findIndex(c => c.id === a) - filterableColumns.findIndex(c => c.id === b)).map(filterId => (
                     <div key={filterId}>
                        <FilterInput columnId={filterId} onFilterChange={onFilterChange} table={table} />
                     </div>
                ))}
            </div>
        )}

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
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/yard-management/documents/${row.original.id}`)}
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
                  colSpan={getColumns(onFilterChange).length}
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
    </div>
  )
}

function FilterInput({ columnId, onFilterChange, table }: { columnId: string, onFilterChange: (id: string, val: any) => void, table: any }) {
    const column = filterableColumns.find(c => c.id === columnId);
    if (!column) return null;

    const { name } = column;
    const filterValue = table.getColumn(columnId)?.getFilterValue();

    switch (columnId) {
        case 'timestamp':
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                             <span>{filterValue ? format(filterValue as Date, "PPP") : `Select ${name}`}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={filterValue as Date}
                            onSelect={(date) => onFilterChange(columnId, date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            );
        case 'transactionType':
            return (
                <Select onValueChange={(value) => onFilterChange(columnId, value === 'all' ? undefined : value)} defaultValue={filterValue as string || 'all'}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                </Select>
            );
        case 'assignmentType':
            return (
                 <Select onValueChange={(value) => onFilterChange(columnId, value === 'all' ? undefined : value)} defaultValue={filterValue as string || 'all'}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Assignments</SelectItem>
                        <SelectItem value="bobtail">Bobtail</SelectItem>
                        <SelectItem value="empty">Empty</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="door_assignment">Door Assignment</SelectItem>
                        <SelectItem value="lane_assignment">Lane Assignment</SelectItem>
                    </SelectContent>
                </Select>
            );
        default:
            return (
                 <Input
                    placeholder={`Filter by ${name}...`}
                    value={(filterValue as string) ?? ""}
                    onChange={(event) => onFilterChange(columnId, event.target.value)}
                    className="max-w-sm"
                />
            );
    }
}

const getColumns = (onFilterChange: (columnId: string, value: any) => void): ColumnDef<YardEvent>[] => [
    {
        accessorKey: "timestamp",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date & Time
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <ClientFormattedDate date={row.getValue("timestamp")} />,
        filterFn: (row, id, value) => {
            return isSameDay(row.getValue(id), value);
        }
    },
    {
        accessorKey: "transactionType",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("transactionType") as string;
            return <Badge variant={type === 'inbound' ? 'secondary' : 'outline'} className="capitalize">{type}</Badge>;
        }
    },
    {
        accessorKey: "trailerId",
        header: "Trailer ID",
    },
     {
        accessorKey: "sealNumber",
        header: "Seal Number",
    },
    {
        accessorKey: "carrier",
        header: "Carrier",
    },
    {
        accessorKey: "scac",
        header: "SCAC",
    },
    {
        accessorKey: "driverName",
        header: "Driver",
    },
    {
        accessorKey: "clerkName",
        header: "Clerk",
    },
    {
        accessorKey: "loadNumber",
        header: "Load/BOL",
    },
    {
        accessorKey: "assignmentType",
        header: "Assignment",
        cell: ({ row }) => {
            const assignmentType = row.original.assignmentType.replace(/_/g, ' ');
            const assignmentValue = row.original.assignmentValue;
            return <div className="capitalize">{assignmentType}{assignmentValue ? `: ${assignmentValue}` : ''}</div>
        },
        accessorFn: (row) => `${row.assignmentType}${row.assignmentValue || ''}`, // for filtering
    },
];

import { useSchedule } from "@/hooks/use-schedule";

    
