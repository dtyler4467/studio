

"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
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
import { ArrowUpDown, ChevronDown, Filter, X, Printer, Mail, MoreHorizontal, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useSchedule, YardEvent, YardEventHistory } from "@/hooks/use-schedule"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"


const filterableColumns = [
    { id: "trailerId", name: "Trailer ID" },
    { id: "sealNumber", name: "Seal Number"},
    { id: "scac", name: "SCAC" },
    { id: "driverName", name: "Driver" },
    { id: "clerkName", name: "Clerk" },
    { id: "transactionType", name: "Type" },
    { id: "assignmentType", name: "Assignment" },
    { id: "timestamp", name: "Date" },
    { id: "dwellDays", name: "Dwell Time" },
];

const ClientFormattedDate = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(format(date, "Pp"));
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[120px]" />;
    }

    return <span>{formattedDate}</span>;
}

const HistoryDialog = ({ event, isOpen, onOpenChange }: { event: YardEvent | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!event) return null;

    const sortedHistory = [...(event.history || [])].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>History for Trailer {event.trailerId}</DialogTitle>
                    <DialogDescription>
                        A chronological log of all status and assignment changes for this event.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96 pr-6">
                    <div className="space-y-4">
                        {[...sortedHistory, {
                            type: 'created',
                            change: `Event created as ${event.transactionType}`,
                            notes: `Assigned to ${event.assignmentType.replace(/_/g, ' ')}${event.assignmentValue ? `: ${event.assignmentValue}` : ''}`,
                            changedBy: event.clerkName,
                            timestamp: event.timestamp
                        }].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((historyItem, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-primary/10">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                    <div className="flex-1 w-px bg-border my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold capitalize">{historyItem.change}</p>
                                    <p className="text-sm text-muted-foreground">{historyItem.notes}</p>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        By {historyItem.changedBy} on <ClientFormattedDate date={new Date(historyItem.timestamp)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

const createPrintableHTML = (events: YardEvent[]) => {
    return `
      <html>
        <head>
          <title>Yard History Report</title>
          <style>
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { font-size: 24px; }
          </style>
        </head>
        <body>
          <h1>Yard History Report</h1>
          <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Trailer ID</th>
                <th>Seal #</th>
                <th>Carrier</th>
                <th>Driver</th>
                <th>Clerk</th>
                <th>Assignment</th>
                <th>Dwell (Days)</th>
              </tr>
            </thead>
            <tbody>
              ${events.map(event => `
                <tr>
                  <td>${format(event.timestamp, 'Pp')}</td>
                  <td style="text-transform: capitalize;">${event.transactionType}</td>
                  <td>${event.trailerId}</td>
                  <td>${event.sealNumber || 'N/A'}</td>
                  <td>${event.carrier}</td>
                  <td>${event.driverName}</td>
                  <td>${event.clerkName}</td>
                  <td style="text-transform: capitalize;">${event.assignmentType.replace(/_/g, ' ')}${event.assignmentValue ? `: ${event.assignmentValue}` : ''}</td>
                  <td>${event.dwellDays !== undefined ? event.dwellDays : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
};


export function YardHistoryTable() {
    const { yardEvents } = useSchedule();
    const router = useRouter();
    const { toast } = useToast();
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = React.useState(false);
    const [selectedEventForHistory, setSelectedEventForHistory] = React.useState<YardEvent | null>(null);
    
    const [sorting, setSorting] = React.useState<SortingState>([ { id: 'timestamp', desc: true } ])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const onFilterChange = (columnId: string, value: any) => {
        table.getColumn(columnId)?.setFilterValue(value);
    }
    
    const toggleFilter = (columnId: string) => {
        setActiveFilters(prev => {
            const newFilters = prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId];
            
            if (!newFilters.includes(columnId)) {
                onFilterChange(columnId, undefined);
            }
            
            return newFilters;
        });
    };

    const handlePrint = (selectedRows: YardEvent[]) => {
        if (selectedRows.length === 0) {
            toast({ variant: 'destructive', title: "Nothing to print", description: "Please select at least one record to print." });
            return;
        }
        const printableHTML = createPrintableHTML(selectedRows);
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(printableHTML);
        printWindow?.document.close();
        printWindow?.print();
    };

    const handleEmail = (selectedRows: YardEvent[]) => {
        if (selectedRows.length === 0) {
            toast({ variant: 'destructive', title: "Nothing to email", description: "Please select at least one record to email." });
            return;
        }
        const subject = "Yard History Report";
        const body = selectedRows.map(event => 
            `Date: ${format(event.timestamp, 'Pp')}\nType: ${event.transactionType}\nTrailer: ${event.trailerId}\nCarrier: ${event.carrier}\nDriver: ${event.driverName}\nClerk: ${event.clerkName}\n---`
        ).join('\n\n');
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const openHistoryDialog = (event: YardEvent) => {
        setSelectedEventForHistory(event);
        setIsHistoryDialogOpen(true);
    }
    

    const table = useReactTable({
        data: yardEvents,
        columns: getColumns(onFilterChange, openHistoryDialog),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
        },
    });
    
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);


  return (
    <>
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handlePrint(selectedRows)} disabled={selectedRows.length === 0}>
                <Printer className="mr-2 h-4 w-4" />
                Print Selected
            </Button>
            <Button variant="outline" onClick={() => handleEmail(selectedRows)} disabled={selectedRows.length === 0}>
                <Mail className="mr-2 h-4 w-4" />
                Email Selected
            </Button>
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                        key={cell.id}
                        onClick={(e) => {
                            if (cell.column.id !== 'select' && cell.column.id !== 'actions') {
                                router.push(`/dashboard/yard-management/documents/${row.original.id}`)
                            }
                            if (cell.column.id === 'actions') {
                                e.stopPropagation();
                            }
                        }}
                        className={cell.column.id !== 'select' ? 'cursor-pointer' : ''}
                    >
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
                  colSpan={getColumns(onFilterChange, openHistoryDialog).length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
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
    </div>
    <HistoryDialog event={selectedEventForHistory} isOpen={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen} />
    </>
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
        case 'dwellDays':
            return (
                <Select onValueChange={(value) => onFilterChange(columnId, value === 'all' ? undefined : parseInt(value))} defaultValue={filterValue ? String(filterValue) : 'all'}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Dwell Time</SelectItem>
                        <SelectItem value="0">0 Days</SelectItem>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="4">4 Days</SelectItem>
                        <SelectItem value="5">5+ Days</SelectItem>
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

const getColumns = (onFilterChange: (columnId: string, value: any) => void, onOpenHistory: (event: YardEvent) => void): ColumnDef<YardEvent>[] => [
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
        accessorFn: (row) => `${row.assignmentType}${row.assignmentValue || ''}`,
    },
    {
        accessorKey: "dwellDays",
        header: "Dwell (Days)",
        cell: ({ row }) => {
            const dwellDays = row.original.dwellDays;
            if (dwellDays === undefined) return <Badge variant="outline">In Yard</Badge>;
            return <span>{dwellDays}</span>;
        },
        filterFn: (row, id, value) => {
            const dwellDays = row.original.dwellDays;
            if (dwellDays === undefined) return false;
            if (value === 5) return dwellDays >= 5;
            return dwellDays === value;
        }
    },
     {
        id: "actions",
        cell: ({ row }) => {
            return (
                <Button variant="ghost" size="icon" onClick={() => onOpenHistory(row.original)}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            )
        }
    }
];

    
