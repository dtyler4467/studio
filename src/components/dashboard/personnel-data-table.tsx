
"use client"

import * as React from "react"
import { useSchedule } from "@/hooks/use-schedule"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, ColumnFiltersState } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

type Employee = {
    id: string;
    name: string;
    email?: string;
    role: 'Admin' | 'Dispatcher' | 'Driver';
    personnelId?: string;
    phoneNumber?: string;
}

export function PersonnelDataTable() {
    const { employees, currentUser, updateEmployeeRole, deleteEmployee } = useSchedule();
    const { toast } = useToast();
    const router = useRouter();
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])


    const handleRoleChange = (employeeId: string, role: Employee['role']) => {
        if (currentUser?.id === employeeId && role !== 'Admin') {
            toast({
                variant: "destructive",
                title: "Action Forbidden",
                description: "You cannot change your own role from Admin.",
            });
            return;
        }
        updateEmployeeRole(employeeId, role);
        toast({
            title: "Role Updated",
            description: "The user's role has been successfully changed.",
        });
    };

    const handleDelete = (employee: Employee) => {
        if (currentUser?.id === employee.id) {
             toast({
                variant: "destructive",
                title: "Action Forbidden",
                description: "You cannot delete your own account.",
            });
            return;
        }
        deleteEmployee(employee.id, currentUser?.id || 'system');
        toast({
            variant: "destructive",
            title: "User Deleted",
            description: `${employee.name} has been moved to the trash.`,
        });
    };

    const columns: ColumnDef<Employee>[] = [
      {
        accessorKey: "personnelId",
        header: "Personnel ID #",
      },
      {
        accessorKey: "name",
        header: "Name",
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
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const employee = row.original;
            return (
                <Select
                    value={employee.role}
                    onValueChange={(value: Employee['role']) => handleRoleChange(employee.id, value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                        <SelectItem value="Driver">Driver</SelectItem>
                    </SelectContent>
                </Select>
            )
        }
      },
      {
        id: "documents",
        header: "Documents",
        cell: ({ row }) => {
            const employee = row.original;
            return (
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Viewing documents for ${employee.name}`)
                    }}
                 >
                    <FileText className="mr-2" />
                    View Docs
                 </Button>
            )
        }
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const employee = row.original;
            return (
                 <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => {e.stopPropagation(); navigator.clipboard.writeText(employee.email || '')}}>
                          Copy email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive flex items-center gap-2" disabled={currentUser?.id === employee.id} onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4" /> Delete User
                            </DropdownMenuItem>
                         </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and remove all their associated data from the system.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(employee)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
            )
        },
      },
    ]

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        columnFilters,
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
                  onClick={() => router.push(`/dashboard/administration/personnel/${row.original.id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={(e) => {
                        if (['actions', 'documents', 'role'].includes(cell.column.id)) {
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
