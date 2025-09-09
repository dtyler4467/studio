
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
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
  TrainingProgram,
  TrainingAssignmentStatus,
} from "@/hooks/use-schedule"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge"

export function TrainingManagementTable() {
  const {
    employees,
    trainingPrograms,
    trainingAssignments,
    assignTraining,
  } = useSchedule()
  const { toast } = useToast()

  const handleAssignTraining = (employeeId: string, programId: string) => {
    try {
      assignTraining(employeeId, programId)
      const employee = employees.find(e => e.id === employeeId)
      const program = trainingPrograms.find(p => p.id === programId)
      toast({
        title: "Training Assigned",
        description: `${program?.title} has been assigned to ${employee?.name}.`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message,
      })
    }
  }

  const getStatusVariant = (status: TrainingAssignmentStatus) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'Not Started': return 'outline';
        default: return 'outline';
    }
}

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Employee",
    },
    {
      id: "assignments",
      header: "Assigned Training",
      cell: ({ row }) => {
        const employeeId = row.original.id
        const assignmentsForEmployee = trainingAssignments.filter(
          (a) => a.employeeId === employeeId
        )
        const assignedProgramIds = assignmentsForEmployee.map(
          (a) => a.programId
        )
        
        const availablePrograms = trainingPrograms.filter((p) => !assignedProgramIds.includes(p.id));

        return (
          <div className="flex flex-wrap gap-2 items-center">
            {assignmentsForEmployee.map((assignment) => {
              const program = trainingPrograms.find(
                (p) => p.id === assignment.programId
              )
              return (
                <Badge key={assignment.id} variant={getStatusVariant(assignment.status)} className={assignment.status === 'Completed' ? 'bg-green-600' : ''}>
                  {program?.title || "Unknown Program"}
                </Badge>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <PlusCircle className="w-4 h-4" />
                  <span className="sr-only">Assign Training</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Assign a Program</DropdownMenuLabel>
                 {availablePrograms.length > 0 ? (
                    availablePrograms.map((program) => (
                    <DropdownMenuItem
                      key={program.id}
                      onClick={() => handleAssignTraining(employeeId, program.id)}
                    >
                      {program.title}
                    </DropdownMenuItem>
                  ))
                 ) : (
                    <DropdownMenuItem disabled>All programs assigned</DropdownMenuItem>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Progress Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
