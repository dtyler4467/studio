
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "../ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const trainingPrograms = [
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'application', label: 'Application' },
    { id: 'annual', label: 'Annual Training' },
    { id: 'exam', label: 'Exam' },
    { id: 'library', label: 'Library' },
];


const AssignTrainingDropdown = ({ employee }: { employee: Employee }) => {
    const { toast } = useToast();
    const [selectedPrograms, setSelectedPrograms] = React.useState<string[]>([]);

    const handleSelect = (programId: string) => {
        setSelectedPrograms(prev => 
            prev.includes(programId) 
            ? prev.filter(id => id !== programId)
            : [...prev, programId]
        );
    }
    
    const handleConfirmAssignment = () => {
        if (selectedPrograms.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Selection',
                description: 'Please select at least one training program to assign.'
            });
            return;
        }
        
        const programLabels = selectedPrograms.map(id => trainingPrograms.find(p => p.id === id)?.label).join(', ');

        toast({
            title: 'Training Assigned!',
            description: `${programLabels} assigned to ${employee.name}.`
        });
        setSelectedPrograms([]);
    };
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Assign...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Assign Training</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {trainingPrograms.map(program => (
                  <DropdownMenuCheckboxItem
                    key={program.id}
                    checked={selectedPrograms.includes(program.id)}
                    onSelect={(e) => {
                        e.preventDefault();
                        handleSelect(program.id);
                    }}
                  >
                      {program.label}
                  </DropdownMenuCheckboxItem>
              ))}
               {selectedPrograms.length > 0 && (
                   <>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onSelect={handleConfirmAssignment}>
                        Confirm Assignment ({selectedPrograms.length})
                    </DropdownMenuItem>
                   </>
               )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function TrainingManagementTable() {
  const { employees } = useSchedule()
  const [globalFilter, setGlobalFilter] = React.useState("")
  
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
        return <AssignTrainingDropdown employee={employee} />
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
