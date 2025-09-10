
"use client"

import * as React from "react"
import { useSchedule, DeletionLog } from "@/hooks/use-schedule"
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
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
import { Undo2, Trash2 } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Checkbox } from "../ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

const getDeletedItemDescription = (item: DeletionLog) => {
    switch (item.itemType) {
        case 'Shift':
            // Add time to treat it as local to avoid timezone shift from the string
            return `Shift for ${item.originalData.employeeName} on ${format(new Date(`${item.originalData.date}T00:00:00`), 'PPP')}`;
        case 'User':
            return `User: ${item.originalData.name} (${item.originalData.email})`;
        case 'File':
            return `File: ${item.originalData.name}`;
        default:
            return `Item ID: ${item.deletedItemId}`;
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

export function TrashDataTable() {
    const { deletionLogs, employees, restoreDeletedItem, permanentlyDeleteItem } = useSchedule()
    const { toast } = useToast()
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    const handleRestore = (logId: string) => {
        restoreDeletedItem(logId);
        toast({
            title: "Item Restored",
            description: "The item has been successfully restored.",
        });
    }

    const handlePermanentDelete = (logIds: string[]) => {
        logIds.forEach(id => permanentlyDeleteItem(id));
        toast({
            variant: "destructive",
            title: "Items Permanently Deleted",
            description: `${logIds.length} item(s) have been permanently deleted.`,
        });
        table.resetRowSelection();
    }


    const columns: ColumnDef<DeletionLog>[] = [
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
        accessorKey: "itemType",
        header: "Item Type",
        cell: ({ row }) => <Badge variant="secondary">{row.original.itemType}</Badge>,
      },
      {
        id: 'description',
        header: "Description",
        cell: ({ row }) => getDeletedItemDescription(row.original),
      },
      {
        accessorKey: "deletedAt",
        header: "Date Deleted",
        cell: ({ row }) => <ClientFormattedDate date={new Date(row.original.deletedAt)} />,
      },
      {
        accessorKey: "deletedBy",
        header: "Deleted By",
        cell: ({ row }) => employees.find(e => e.id === row.original.deletedBy)?.name || 'Unknown User'
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <Button variant="outline" size="sm" onClick={() => handleRestore(row.original.id)}>
              <Undo2 className="mr-2 h-4 w-4" />
              Restore
            </Button>
          )
        },
      },
    ]

    const table = useReactTable({
        data: deletionLogs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        }
    })

    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={selectedIds.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected ({selectedIds.length})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the selected item(s) from the server.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handlePermanentDelete(selectedIds)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                        The trash is empty.
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
