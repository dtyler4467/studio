
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
import { ArrowUpDown, ChevronDown, Download, File as FileIcon } from "lucide-react"
import { format } from "date-fns"
import * as XLSX from "xlsx"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "../ui/skeleton"
import { useSchedule, ShareHistoryLog } from "@/hooks/use-schedule"
import { Badge } from "../ui/badge"

const ClientFormattedDate = ({ date }: { date: Date | null }) => {
    if (!date) {
        return <Skeleton className="h-4 w-[150px]" />;
    }
    return <>{format(date, "PPP p")}</>;
}


export function FileShareHistoryTable() {
    const { shareHistoryLogs } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'timestamp', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("");

    const exportToXlsx = () => {
        const dataToExport = table.getFilteredRowModel().rows.map(row => {
            const { fileName, sharedBy, sharedWith, timestamp } = row.original;
            return {
                "File Name": fileName,
                "Shared By": sharedBy,
                "Shared With": sharedWith.join(', '),
                "Timestamp": format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss"),
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ShareHistory");
        XLSX.writeFile(workbook, `ShareHistory_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        
        toast({
            title: "Export Successful",
            description: `${dataToExport.length} record(s) have been exported.`,
        });
    };

    const columns: ColumnDef<ShareHistoryLog>[] = [
      {
        accessorKey: "fileName",
        header: "File Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span>{row.original.fileName}</span>
            </div>
        )
      },
      {
        accessorKey: "sharedBy",
        header: "Shared By",
      },
      {
        accessorKey: "sharedWith",
        header: "Shared With",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.sharedWith.map(email => (
                    <Badge key={email} variant="secondary">{email}</Badge>
                ))}
            </div>
        )
      },
      {
        accessorKey: "timestamp",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date Shared <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <ClientFormattedDate date={row.original.timestamp} />
      },
    ]

  const table = useReactTable({
    data: shareHistoryLogs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by file name, user, or recipient..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-md"
        />
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={exportToXlsx}>
                <Download className="mr-2" /> Export
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
                        {column.id}
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
          {table.getFilteredRowModel().rows.length} row(s).
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
