
"use client"

import * as React from "react"
import { useSchedule, DeletionLog } from "@/hooks/use-schedule"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Undo2 } from "lucide-react"

const getDeletedItemDescription = (item: DeletionLog) => {
    switch (item.itemType) {
        case 'Shift':
            return `Shift for ${item.originalData.employeeName} on ${format(new Date(item.originalData.date), 'PPP')}`;
        case 'User':
            return `User: ${item.originalData.name} (${item.originalData.email})`;
        default:
            return `Item ID: ${item.deletedItemId}`;
    }
}

export function TrashDataTable() {
    const { deletionLogs, employees, restoreDeletedItem } = useSchedule()
    const { toast } = useToast()

    const handleRestore = (logId: string) => {
        restoreDeletedItem(logId);
        toast({
            title: "Item Restored",
            description: "The item has been successfully restored.",
        });
    }

    const columns: ColumnDef<DeletionLog>[] = [
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
        cell: ({ row }) => format(new Date(row.original.deletedAt), "PPP p"),
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
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="w-full">
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

