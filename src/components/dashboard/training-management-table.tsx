
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { DocumentUpload } from "./document-upload"
import { Label } from "../ui/label"
import { Upload } from "lucide-react"

const trainingPrograms = [
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'application', label: 'Application' },
    { id: 'annual', label: 'Annual Training' },
    { id: 'exam', label: 'Exam' },
    { id: 'library', label: 'Library' },
    { id: 'benefits', label: 'Benefits Guide' },
    { id: '401k', label: '401K' },
    { id: 'handbook', label: 'Handbook' },
];


const AssignTaskDropdown = ({ employee }: { employee: Employee }) => {
    const { toast } = useToast();
    const [selectedPrograms, setSelectedPrograms] = React.useState<string[]>([]);
    const [isUploadDialogOpen, setUploadDialogOpen] = React.useState(false);
    const [customTaskName, setCustomTaskName] = React.useState("");
    const [documentUri, setDocumentUri] = React.useState<string | null>(null);

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
                description: 'Please select at least one task to assign.'
            });
            return;
        }
        
        const programLabels = selectedPrograms.map(id => trainingPrograms.find(p => p.id === id)?.label).join(', ');

        toast({
            title: 'Task Assigned!',
            description: `${programLabels} assigned to ${employee.name}.`
        });
        setSelectedPrograms([]);
    };

    const handleUploadTask = () => {
        if (!customTaskName) {
            toast({ variant: 'destructive', title: 'Task Name Required', description: 'Please provide a name for the custom task.' });
            return;
        }
         if (!documentUri) {
            toast({ variant: 'destructive', title: 'Document Required', description: 'Please upload or capture a document for the task.' });
            return;
        }
        toast({
            title: 'Custom Task Assigned!',
            description: `Task "${customTaskName}" has been assigned to ${employee.name}.`
        });
        setUploadDialogOpen(false);
        setCustomTaskName("");
        setDocumentUri(null);
    }
    
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Assign...</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuLabel>Assign Standard Task</DropdownMenuLabel>
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
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Task...
                 </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Custom Task</DialogTitle>
                        <DialogDescription>
                            Upload a document or use the camera to create and assign a new task to {employee.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                             <Label htmlFor="task-name">Task Name</Label>
                             <Input 
                                id="task-name" 
                                value={customTaskName} 
                                onChange={(e) => setCustomTaskName(e.target.value)}
                                placeholder="e.g., Signed BOL for Load #123"
                             />
                        </div>
                        <div className="space-y-2">
                            <Label>Document</Label>
                            <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadTask}>Assign Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
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
      header: "Assign Task",
      cell: ({ row }) => {
        const employee = row.original;
        return <AssignTaskDropdown employee={employee} />
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
