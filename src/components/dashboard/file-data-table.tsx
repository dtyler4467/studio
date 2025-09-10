

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
import { ArrowUpDown, ChevronDown, Download, Edit, Folder, MoreHorizontal, File as FileIcon, Trash2, X, CalendarIcon, FileUp, Move } from "lucide-react"
import { format, isWithinInterval } from "date-fns"
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
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Skeleton } from "../ui/skeleton"

type File = {
    id: string;
    name: string;
    type: 'PDF' | 'Image' | 'Excel' | 'Word' | 'Other';
    size: number; // in bytes
    path: string;
    dateAdded: Date;
}

const mockFiles: File[] = [
    { id: 'FILE001', name: 'BOL_LD123.pdf', type: 'PDF', size: 1024 * 500, path: '/documents/bol/', dateAdded: new Date('2024-07-28T08:15:00Z') },
    { id: 'FILE002', name: 'Trailer_Damage.jpg', type: 'Image', size: 1024 * 1024 * 2, path: '/images/incidents/', dateAdded: new Date('2024-07-27T14:30:00Z') },
    { id: 'FILE003', name: 'Q3_Expense_Report.xlsx', type: 'Excel', size: 1024 * 150, path: '/reports/expenses/', dateAdded: new Date('2024-07-26T10:00:00Z') },
    { id: 'FILE004', name: 'Driver_Handbook_v3.pdf', type: 'PDF', size: 1024 * 1024 * 5, path: '/hr/documents/', dateAdded: new Date('2024-07-25T11:00:00Z') },
];

const getFileIcon = (type: File['type']) => {
    switch (type) {
        case 'PDF': return <FileIcon className="text-red-500" />;
        case 'Image': return <FileIcon className="text-blue-500" />;
        case 'Excel': return <FileIcon className="text-green-500" />;
        case 'Word': return <FileIcon className="text-blue-700" />;
        default: return <FileIcon />;
    }
}

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


export function FileDataTable() {
    const [data, setData] = React.useState(mockFiles);
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

    const filteredData = React.useMemo(() => {
        let filtered = data;
        if (dateRange?.from) {
            const toDate = dateRange.to || dateRange.from;
            filtered = filtered.filter(file => isWithinInterval(file.dateAdded, { start: dateRange.from!, end: toDate }));
        }
        if (globalFilter) {
            filtered = filtered.filter(file => file.name.toLowerCase().includes(globalFilter.toLowerCase()));
        }
        return filtered;
    }, [data, dateRange, globalFilter]);

    const columns: ColumnDef<File>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {getFileIcon(row.original.type)}
                <span>{row.original.name}</span>
            </div>
        )
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => `${(row.original.size / (1024 * 1024)).toFixed(2)} MB`
      },
      {
        accessorKey: "dateAdded",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date Added <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <ClientFormattedDate date={row.original.dateAdded} />
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const file = row.original
    
          return (
            <AlertDialog>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem><Download className="mr-2"/> Download</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="mr-2"/> Rename</DropdownMenuItem>
                    <DropdownMenuItem><Move className="mr-2"/> Move</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2"/> Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the file "{file.name}". This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        setData(data.filter(f => f.id !== file.id));
                        toast({ variant: 'destructive', title: 'File Deleted', description: `${file.name} has been deleted.` });
                    }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          )
        },
      },
    ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter files..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Filter by date...</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
        {(globalFilter || dateRange) && <Button variant="ghost" onClick={() => {setGlobalFilter(""); setDateRange(undefined)}}>Reset <X className="ml-2 h-4 w-4" /></Button>}
        <div className="ml-auto">
            <Button><FileUp className="mr-2"/> Upload File</Button>
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
    </div>
  )
}
