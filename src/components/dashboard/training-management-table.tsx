
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useSchedule,
  Employee,
} from "@/hooks/use-schedule"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function TrainingManagementTable() {
  const { employees } = useSchedule()
  const [globalFilter, setGlobalFilter] = React.useState("")
  const { toast } = useToast()

  const handleAssign = (employeeName: string, program: string) => {
    toast({
      title: "Training Assigned",
      description: `${program} has been assigned to ${employeeName}.`
    })
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "personnelId",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      id: "assign",
      header: "Assign",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Assign...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Assign Training</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAssign(employee.name, "Onboarding")}>Onboarding</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssign(employee.name, "Application")}>Application</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssign(employee.name, "Annual Training")}>Annual Training</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssign(employee.name, "Exam")}>Exam</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssign(employee.name, "Library")}>Library</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data: employees,
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
            placeholder="Filter employees..."
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
    </div>
  )
}
