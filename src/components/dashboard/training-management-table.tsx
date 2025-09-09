
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
  TrainingAssignment,
} from "@/hooks/use-schedule"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "../ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { DocumentUpload } from "./document-upload"
import { Label } from "../ui/label"
import { Upload, Circle } from "lucide-react"
import { Progress } from "../ui/progress"
import { cn } from "@/lib/utils"

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


const AssignTaskDropdown = ({ employee, onAssign }: { employee: Employee, onAssign: (programIds: string[]) => void }) => {
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
        onAssign(selectedPrograms);
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
        // This is a mock assignment for custom tasks
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
                <Button variant="outline" size="sm">Assign Task</Button>
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
  const { employees, trainingAssignments, assignTraining, trainingPrograms } = useSchedule()
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const employee = row.original;
        const assignments = trainingAssignments.filter(a => a.employeeId === employee.id);
        const completedCount = assignments.filter(a => a.status === 'Completed').length;
        const percentage = assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0;
        
        return (
            <div>
                <p className="font-medium">{employee.name}</p>
                <div className="text-xs text-muted-foreground mt-1">
                    {assignments.length > 0 ? (
                        <div className="space-y-1">
                             <p>{completedCount} of {assignments.length} tasks completed</p>
                             <Progress value={percentage} className="h-1" />
                        </div>
                    ) : (
                        <p>No tasks assigned</p>
                    )}
                </div>
            </div>
        )
      }
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
        id: "status",
        header: () => (
            <div className="flex flex-col items-center gap-1">
                <Circle className="h-3 w-3" />
                <span>Status</span>
            </div>
        ),
        cell: ({ row }) => {
             const employee = row.original;
             const assignments = trainingAssignments.filter(a => a.employeeId === employee.id);
             if (assignments.length === 0) {
                 return <div className="flex justify-center"><Circle className="h-4 w-4 text-slate-400 fill-slate-400" /></div>;
             }
             const allCompleted = assignments.every(a => a.status === 'Completed');
             if (allCompleted) {
                 return <div className="flex justify-center"><Circle className="h-4 w-4 text-green-500 fill-green-500" /></div>;
             }
             const anyInProgress = assignments.some(a => a.status === 'In Progress');
             if (anyInProgress) {
                 return <div className="flex justify-center"><Circle className="h-4 w-4 text-yellow-500 fill-yellow-500" /></div>;
             }
             return <div className="flex justify-center"><Circle className="h-4 w-4 text-red-500 fill-red-500" /></div>;
        }
    },
    {
      id: "tasks",
      header: "Assigned Tasks",
      cell: ({ row }) => {
        const employee = row.original;
        const assignments = trainingAssignments.filter(a => a.employeeId === employee.id);
        if (assignments.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>
        }
        return (
            <div className="flex flex-col text-xs">
                {assignments.map(assignment => {
                    const program = trainingPrograms.flatMap(p => p.modules).find(m => m.id === assignment.moduleId);
                    return <span key={assignment.id}>{program?.title || assignment.moduleId}</span>
                })}
            </div>
        )
      }
    },
    {
      id: "assign",
      header: "Assign Task",
      cell: ({ row }) => {
        const employee = row.original;
        const handleAssign = (programIds: string[]) => {
            programIds.forEach(id => assignTraining(employee.id, id));
        };
        return <AssignTaskDropdown employee={employee} onAssign={handleAssign} />
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
