
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
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type ExpenseReport = {
  id: string
  employeeName: string
  date: string
  description: string
  category: "Food" | "Fuel" | "Utilities" | "Insurance" | "Supplies" | "Repairs" | "Accidents" | "Payroll" | "Lease" | "Other"
  amount: number
  status: "Pending" | "Approved" | "Denied"
}

const mockData: ExpenseReport[] = [
    { id: "EXP001", employeeName: "John Doe", date: "2024-07-25", description: "Fuel stop in Nevada", category: "Fuel", amount: 150.75, status: "Approved" },
    { id: "EXP002", employeeName: "Jane Doe", date: "2024-07-26", description: "Hotel stay in Denver", category: "Other", amount: 120.00, status: "Approved" },
    { id: "EXP003", employeeName: "Mike Smith", date: "2024-07-27", description: "Dinner with client", category: "Food", amount: 85.50, status: "Pending" },
    { id: "EXP004", employeeName: "John Doe", date: "2024-07-28", description: "Oil change and tire rotation", category: "Repairs", amount: 220.00, status: "Pending" },
    { id: "EXP005", employeeName: "Emily Jones", date: "2024-07-29", description: "Tolls and parking", category: "Other", amount: 45.25, status: "Denied" },
    { id: "EXP006", employeeName: "Admin", date: "2024-07-30", description: "Monthly vehicle lease", category: "Lease", amount: 550.00, status: "Approved" },
    { id: "EXP007", employeeName: "Jane Doe", date: "2024-07-30", description: "Office supplies", category: "Supplies", amount: 75.00, status: "Pending" },
    { id: "EXP008", employeeName: "HR", date: "2024-07-31", description: "Monthly payroll", category: "Payroll", amount: 15000.00, status: "Approved" },
];

const categories: ExpenseReport['category'][] = ["Food", "Fuel", "Utilities", "Insurance", "Supplies", "Repairs", "Accidents", "Payroll", "Lease", "Other"];

export function ExpenseReportDataTable() {
    const [data, setData] = React.useState<ExpenseReport[]>(mockData);
    const { toast } = useToast();

    const handleStatusChange = (id: string, status: ExpenseReport['status']) => {
        setData(currentData => currentData.map(expense => expense.id === id ? { ...expense, status } : expense));
        toast({
            title: `Expense ${status}`,
            description: `Expense report ${id} has been marked as ${status.toLowerCase()}.`,
        });
    };
    
    const exportToCsv = () => {
        const headers = ["ID", "Employee Name", "Date", "Description", "Category", "Amount", "Status"];
        const rows = table.getRowModel().rows.map(row => row.original).map(expense => [
            expense.id,
            `"${expense.employeeName}"`,
            expense.date,
            `"${expense.description}"`,
            expense.category,
            expense.amount,
            expense.status
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `expense_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "The expense report data has been exported to a CSV file.",
        });
    };

    const columns: ColumnDef<ExpenseReport>[] = [
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
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "employeeName",
        header: "Employee",
      },
       {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const dateString = row.getValue("date") as string;
            // Add time to treat it as local to avoid timezone shift
            return format(new Date(`${dateString}T00:00:00`), "PPP");
        }
      },
      {
        accessorKey: "description",
        header: "Description",
      },
       {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <div className="text-right">
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="text-right">${row.getValue<number>("amount").toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as ExpenseReport['status'];
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
        enableHiding: false,
        cell: ({ row }) => {
            const expense = row.original;
            return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange(expense.id, "Approved")}>
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(expense.id, "Denied")}>
                      Deny
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )
        },
      },
    ];


  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by employee name..."
          value={(table.getColumn("employeeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("employeeName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
            value={(table.getColumn('category')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => {
                if (value === 'all') {
                    table.getColumn('category')?.setFilterValue(undefined);
                } else {
                    table.getColumn('category')?.setFilterValue(value);
                }
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2" />
                Export to CSV
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
                         {column.id.replace(/([A-Z])/g, ' $1').trim()}
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

  