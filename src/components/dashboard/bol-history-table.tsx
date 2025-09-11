

"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useSchedule, BillOfLading } from "@/hooks/use-schedule"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export function BolHistoryTable() {
    const { bolHistory } = useSchedule()
    const [globalFilter, setGlobalFilter] = React.useState("")
    const router = useRouter()
    
    const columns: ColumnDef<BillOfLading>[] = [
        {
            accessorKey: "bolNumber",
            header: "BOL Number",
        },
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "origin",
            header: "Origin",
        },
        {
            accessorKey: "destination",
            header: "Destination",
        },
        {
            accessorKey: "deliveryDate",
            header: "Delivery Date",
            cell: ({ row }) => format(new Date(row.original.deliveryDate), "PPP"),
        },
    ]

    const table = useReactTable({
        data: bolHistory,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
    })

  return (
    <div className="w-full">
        <div className="flex items-center py-4">
            <Input
            placeholder="Search by BOL, customer, origin, destination..."
            value={globalFilter ?? ''}
            onChange={(event) =>
                setGlobalFilter(event.target.value)
            }
            className="max-w-sm"
            />
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
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/warehouse-hub-manager/bol/${row.original.id}`)}
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
                  No BOLs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
