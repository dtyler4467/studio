

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
import { Button } from "../ui/button"
import { ArrowLeftRight, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export function BolHistoryTable() {
    const { bolHistory } = useSchedule()
    const [globalFilter, setGlobalFilter] = React.useState("")
    const router = useRouter()

    const handleProcessTransaction = (bol: BillOfLading, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click navigation
        const query = new URLSearchParams({
            loadNumber: bol.bolNumber,
            carrier: bol.carrier,
        }).toString();
        router.push(`/dashboard/yard-management/check-in?${query}`);
    }
    
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
            cell: ({ row }) => {
                const dateString = row.original.deliveryDate;
                // Add time to treat it as local to avoid timezone shift
                const date = new Date(`${dateString}T00:00:00`);
                return format(date, "PPP");
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={(e) => handleProcessTransaction(row.original, e)}>
                            <ArrowLeftRight className="mr-2 h-4 w-4" />
                            Process Gate Transaction
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
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
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Search by BOL, customer, origin, destination..."
            value={globalFilter ?? ''}
            onChange={(event) =>
                setGlobalFilter(event.target.value)
            }
            className="max-w-sm"
            />
             <Button variant="outline" asChild>
                <Link href="/dashboard/yard-management/search">
                    Back to Search
                </Link>
            </Button>
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
