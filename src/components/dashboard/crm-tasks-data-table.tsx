
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronDown, MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useSchedule, CrmTask } from "@/hooks/use-schedule"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

function AddTaskDialog({ onSave }: { onSave: (task: Omit<CrmTask, 'id' | 'status'>) => void }) {
    const { employees, currentUser } = useSchedule();
    const [isOpen, setIsOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<Omit<CrmTask, 'id' | 'status'>>({
        title: '',
        priority: 'Medium',
        dueDate: new Date(),
        taskType: 'Follow-up',
        assignedTo: currentUser?.id || '',
    });

    const handleSave = () => {
        onSave(formData);
        setIsOpen(false);
        setFormData({ title: '', priority: 'Medium', dueDate: new Date(), taskType: 'Follow-up', assignedTo: currentUser?.id || '' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !formData.dueDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.dueDate}
                                    onSelect={(date) => date && setFormData({...formData, dueDate: date})}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                             <Select value={formData.priority} onValueChange={(v: any) => setFormData({...formData, priority: v})}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Task Type</Label>
                             <Select value={formData.taskType} onValueChange={(v: any) => setFormData({...formData, taskType: v})}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Call">Call</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Meeting">Meeting</SelectItem>
                                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Assigned To</Label>
                             <Select value={formData.assignedTo} onValueChange={(v) => setFormData({...formData, assignedTo: v})}>
                                <SelectTrigger><SelectValue placeholder="Select user..."/></SelectTrigger>
                                <SelectContent>
                                    {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="associated">Associated With (Optional)</Label>
                        <Input id="associated" value={formData.associatedWith || ''} onChange={e => setFormData({...formData, associatedWith: e.target.value})} placeholder="e.g. Acme Inc., John Doe" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function CrmTasksDataTable() {
    const { crmTasks, addCrmTask, updateCrmTaskStatus, employees } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    
    const handleAddTask = (taskData: Omit<CrmTask, 'id' | 'status'>) => {
        addCrmTask(taskData);
        toast({ title: 'Task Created' });
    }

    const handleMarkComplete = (taskId: string) => {
        updateCrmTaskStatus(taskId, 'Completed');
        toast({ title: 'Task Completed' });
    }

    const columns: ColumnDef<CrmTask>[] = [
      {
        id: "select",
        cell: ({ row }) => (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMarkComplete(row.original.id)} disabled={row.original.status === 'Completed'}>
                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                    {row.original.status === 'Completed' && <Check className="h-3 w-3" />}
                </div>
            </Button>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className={cn(row.original.status === 'Completed' && 'text-muted-foreground line-through')}>
                <p className="font-semibold">{row.original.title}</p>
                {row.original.associatedWith && <p className="text-xs text-muted-foreground">{row.original.associatedWith}</p>}
            </div>
        )
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => employees.find(e => e.id === row.original.assignedTo)?.name || 'Unassigned'
      },
       {
        accessorKey: "dueDate",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => format(row.original.dueDate, "PPP"),
      },
       {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => <Badge variant={row.original.priority === 'High' ? 'destructive' : 'secondary'}>{row.original.priority}</Badge>
      },
       {
        accessorKey: "taskType",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.original.taskType}</Badge>
      },
      {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
      }
    ];

  const table = useReactTable({
    data: crmTasks.filter(t => t.status !== 'Completed'),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full">
        <div className="flex justify-between items-center py-4">
            <Input
                placeholder="Filter tasks..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
            <AddTaskDialog onSave={handleAddTask} />
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
