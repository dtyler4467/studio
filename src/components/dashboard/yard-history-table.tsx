
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
import { format } from "date-fns"
import { ArrowUpDown, ChevronDown } from "lucide-react"

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
import { Badge } from "../ui/badge"

type YardEvent = {
    id: string;
    transactionType: 'inbound' | 'outbound';
    trailerId: string;
    carrier: string;
    scac: string;
    driverName: string;
    loadNumber: string;
    assignmentType: "bobtail" | "empty" | "material" | "door_assignment" | "lane_assignment";
    assignmentValue?: string;
    timestamp: Date;
}

const initialData: YardEvent[] = [
    { id: 'EVT001', transactionType: 'inbound', trailerId: 'TR53123', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'John Doe', loadNumber: 'LD123', assignmentType: 'door_assignment', assignmentValue: 'D42', timestamp: new Date('2024-07-28T08:15:00Z') },
    { id: 'EVT002', transactionType: 'outbound', trailerId: 'TR48991', carrier: 'J.B. Hunt', scac: 'JBHT', driverName: 'Jane Smith', loadNumber: 'LD124', assignmentType: 'empty', timestamp: new Date('2024-07-28T09:30:00Z') },
    { id: 'EVT003', transactionType: 'inbound', trailerId: 'TR53456', carrier: 'Schneider', scac: 'SNDR', driverName: 'Mike Johnson', loadNumber: 'LD125', assignmentType: 'lane_assignment', assignmentValue: 'L12', timestamp: new Date('2024-07-27T14:00:00Z') },
    { id: 'EVT004', transactionType: 'outbound', trailerId: 'TR53123', carrier: 'Knight-Swift', scac: 'KNX', driverName: 'Emily Davis', loadNumber: 'LD126', assignmentType: 'material', timestamp: new Date('2024-07-27T16:45:00Z') },
    { id: 'EVT005', transactionType: 'inbound', trailerId: 'TR53789', carrier: 'Werner', scac: 'WERN', driverName: 'Chris Brown', loadNumber: 'LD127', assignmentType: 'bobtail', timestamp: new Date('2024-07-26T11:20:00Z') },
];


export function YardHistoryTable() {
    const [data] = React.useState<YardEvent[]>(initialData);

    const columns: ColumnDef<YardEvent>[] = [
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
        cell: ({ row }) => <div>{format(row.getValue("timestamp"), "Pp")}</div>,
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
        accessorKey: "loadNumber",
        header: "Load/BOL",
      },
      {
        accessorKey: "assignment",
        header: "Assignment",
        cell: ({ row }) => {
            const assignmentType = row.original.assignmentType.replace(/_/g, ' ');
            const assignmentValue = row.original.assignmentValue;
            return <div className="capitalize">{assignmentType}{assignmentValue ? `: ${assignmentValue}` : ''}</div>
        }
      },
    ]

  const [sorting, setSorting] = React.useState<SortingState>([ { id: 'timestamp', desc: true } ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
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
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by trailer ID..."
          value={(table.getColumn("trailerId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("trailerId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
