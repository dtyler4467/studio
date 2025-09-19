
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
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, PlusCircle } from "lucide-react"
import { format, getQuarter, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"

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
import { Badge } from "../ui/badge"
import { DatePickerWithRange } from "../ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';
type InvoiceType = 'Incoming' | 'Outgoing';

type Invoice = {
    id: string;
    customer: string;
    date: Date;
    dueDate: Date;
    amount: number;
    status: InvoiceStatus;
    type: InvoiceType;
};

const initialData: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Inc.', date: new Date(new Date().setDate(new Date().getDate() - 5)), dueDate: new Date(new Date().setDate(new Date().getDate() + 25)), amount: 1250.00, status: 'Paid', type: 'Outgoing' },
  { id: 'INV-002', customer: 'Globex Corp.', date: new Date(new Date().setDate(new Date().getDate() - 10)), dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), amount: 800.00, status: 'Overdue', type: 'Outgoing' },
  { id: 'INV-003', customer: 'Stark Industries', date: new Date(new Date().setDate(new Date().getDate() - 2)), dueDate: new Date(new Date().setDate(new Date().getDate() + 28)), amount: 2500.00, status: 'Pending', type: 'Outgoing' },
  { id: 'INV-IN-001', customer: 'Global Fasteners', date: new Date(new Date().setDate(new Date().getDate() - 8)), dueDate: new Date(new Date().setDate(new Date().getDate() + 22)), amount: -345.50, status: 'Pending', type: 'Incoming' },
];

export function InvoiceDataTable() {
  const [data, setData] = React.useState<Invoice[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [quarterFilter, setQuarterFilter] = React.useState<string>("all")

  const columns: ColumnDef<Invoice>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    },
    {
      accessorKey: "id",
      header: "Invoice #",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "date",
      header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date <ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
      cell: ({ row }) => format(row.original.date, "PPP"),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => format(row.original.dueDate, "PPP"),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <Button variant="ghost" className="w-full justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Amount <ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
      cell: ({ row }) => {
        const amount = row.original.amount;
        return <div className={cn("text-right font-medium", amount > 0 ? "" : "text-destructive")}>{amount > 0 ? `$${amount.toLocaleString()}`: `-$${Math.abs(amount).toLocaleString()}`}</div>
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Paid' ? 'default' : status === 'Overdue' ? 'destructive' : 'secondary'} className={cn(status === 'Paid' && 'bg-green-600')}>{status}</Badge>
      }
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View Invoice</DropdownMenuItem>
            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  React.useEffect(() => {
    const filters = [];
    if(statusFilter !== 'all') filters.push({ id: 'status', value: statusFilter });
    if(typeFilter !== 'all') filters.push({ id: 'type', value: typeFilter });
    if (dateRange?.from) {
        const range = { from: dateRange.from, to: dateRange.to || dateRange.from };
        filters.push({ id: 'date', value: range });
    }
     if (quarterFilter !== 'all') {
        filters.push({ id: 'date', value: parseInt(quarterFilter) });
    }
    setColumnFilters(filters);
  }, [statusFilter, typeFilter, dateRange, quarterFilter]);

  React.useEffect(() => {
    table.getColumn('date')?.setFilterFn((row, columnId, filterValue) => {
        if (typeof filterValue === 'number') { // Quarter filter
            const rowDate = new Date(row.getValue(columnId));
            return getQuarter(rowDate) === filterValue;
        }
        if (typeof filterValue === 'object' && filterValue !== null && 'from' in filterValue) { // DateRange filter
            const { from, to } = filterValue as DateRange;
            const rowDate = new Date(row.getValue(columnId));
            return isWithinInterval(rowDate, { start: from!, end: to || from! });
        }
        return true;
    });
  }, [table]);


  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 py-4">
        <Input
          placeholder="Search by ID or customer..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-xs"
        />
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter status..." /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter type..." /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Incoming">Incoming</SelectItem>
                <SelectItem value="Outgoing">Outgoing</SelectItem>
            </SelectContent>
        </Select>
        <Select value={quarterFilter} onValueChange={setQuarterFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by quarter..." /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                <SelectItem value="1">Q1</SelectItem>
                <SelectItem value="2">Q2</SelectItem>
                <SelectItem value="3">Q3</SelectItem>
                <SelectItem value="4">Q4</SelectItem>
            </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
            <Button variant="outline"><Download className="mr-2" /> Export</Button>
            <Button><PlusCircle className="mr-2"/> Create Invoice</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
