
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
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Upload } from "lucide-react"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { useRouter } from "next/navigation"

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
import { useSchedule, ExpenseReport } from "@/hooks/use-schedule"

const categories: ExpenseReport['category'][] = ["Food", "Fuel", "Utilities", "Insurance", "Supplies", "Repairs", "Accidents", "Payroll", "Lease", "Other"];
const validStatuses: ExpenseReport['status'][] = ["Pending", "Approved", "Denied"];

const filterableColumns = [
    { id: 'employeeName', name: 'Employee' },
    { id: 'description', name: 'Description' },
    { id: 'category', name: 'Category' },
    { id: 'status', name: 'Status' },
];

export function ExpenseReportDataTable() {
    const { expenseReports, setExpenseReports } = useSchedule();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [filterBy, setFilterBy] = React.useState<string>('employeeName');

    const handleStatusChange = (id: string, status: ExpenseReport['status']) => {
        setExpenseReports(currentData => currentData.map(expense => expense.id === id ? { ...expense, status } : expense));
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

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                const newExpenses: ExpenseReport[] = json.map((row: any) => {
                    // Basic validation and type coercion
                    const category = categories.includes(row.Category) ? row.Category : "Other";
                    const status = validStatuses.includes(row.Status) ? row.Status : "Pending";
                    const amount = parseFloat(row.Amount);
                    
                    if (isNaN(amount)) {
                        throw new Error(`Invalid amount for row with ID ${row.ID}`);
                    }

                    // Handle Excel date serial number format
                    let date = row.Date;
                    if (typeof date === 'number') {
                        // Excel stores dates as serial numbers since 1900 or 1904.
                        // This formula converts it to a JS Date.
                        const jsDate = new Date(Math.round((date - 25569) * 86400 * 1000));
                        date = format(jsDate, 'yyyy-MM-dd');
                    } else if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                        // Attempt to parse other common date formats or throw error
                         throw new Error(`Invalid date format for row with ID ${row.ID}. Expected YYYY-MM-DD.`);
                    }

                    return {
                        id: String(row.ID),
                        employeeName: String(row['Employee Name']),
                        date,
                        description: String(row.Description),
                        category,
                        amount,
                        status,
                    };
                }).filter(expense => expense.id && expense.employeeName); // Filter out empty rows

                setExpenseReports(currentData => [...currentData, ...newExpenses]);

                toast({
                    title: "Import Successful",
                    description: `${newExpenses.length} expense(s) imported successfully.`,
                });

            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: error instanceof Error ? error.message : "An unknown error occurred during import.",
                });
            } finally {
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                 }
            }
        };
        reader.readAsBinaryString(file);
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
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
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
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/administration/expense-report/${expense.id}`)}>
                        View Details
                    </DropdownMenuItem>
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
    data: expenseReports,
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

  const handleFilterChange = (value: string) => {
    // Reset other filters when changing the filter column
    table.getAllColumns().forEach(column => {
        if(column.getCanFilter() && column.id !== filterBy) {
            column.setFilterValue('');
        }
    });
    table.getColumn(filterBy)?.setFilterValue(value);
  }

  const FilterComponent = () => {
    const filterValue = (table.getColumn(filterBy)?.getFilterValue() as string) ?? "";
    switch (filterBy) {
        case 'category':
            return (
                <Select
                    value={filterValue}
                    onValueChange={(value) => {
                        handleFilterChange(value === 'all' ? '' : value);
                    }}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case 'status':
            return (
                 <Select
                    value={filterValue}
                    onValueChange={(value) => {
                        handleFilterChange(value === 'all' ? '' : value);
                    }}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {validStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        default:
            return (
                <Input
                  placeholder={`Filter by ${filterableColumns.find(f => f.id === filterBy)?.name.toLowerCase()}...`}
                  value={filterValue}
                  onChange={(event) => handleFilterChange(event.target.value)}
                  className="max-w-sm"
                />
            );
    }
  }


  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <div className="flex items-center gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                    {filterableColumns.map(col => (
                        <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FilterComponent />
        </div>
        
        <div className="ml-auto flex gap-2">
            <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileImport}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2" />
                Import
            </Button>
            <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2" />
                Export
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
                  onClick={() => router.push(`/dashboard/administration/expense-report/${row.original.id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={(e) => {
                        if (cell.column.id === 'actions' || cell.column.id === 'select') {
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
