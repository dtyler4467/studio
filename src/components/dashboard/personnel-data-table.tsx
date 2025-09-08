

"use client"

import * as React from "react"
import { useSchedule, Employee } from "@/hooks/use-schedule"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, FileText, Pencil, PlusCircle, KeyRound, Upload, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { format } from "date-fns"

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"

const validRoles: Employee['role'][] = ["Admin", "Dispatcher", "Driver", "Employee", "Forklift", "Laborer", "Manager", "Visitor", "Vendor"];

const AddEmployeeDialog = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (newEmployee: Omit<Employee, 'id' | 'personnelId'>) => void }) => {
    const [newEmployee, setNewEmployee] = React.useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: 'Driver' as Employee['role']
    });

    const handleSave = () => {
        if (newEmployee.name && newEmployee.email) {
            onSave(newEmployee);
            onOpenChange(false);
            setNewEmployee({ name: '', email: '', phoneNumber: '', role: 'Driver' }); // Reset form
        }
    };

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Personnel</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new employee.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input id="phone" value={newEmployee.phoneNumber} onChange={e => setNewEmployee({...newEmployee, phoneNumber: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={newEmployee.role} onValueChange={(value: Employee['role']) => setNewEmployee({...newEmployee, role: value})}>
                             <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {validRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Add Employee</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const EditEmployeeDialog = ({ employee, isOpen, onOpenChange, onSave }: { employee: Employee | null, isOpen: boolean, onOpenChange: (open: boolean) => void, onSave: (updatedEmployee: Employee) => void }) => {
    const [editedEmployee, setEditedEmployee] = React.useState<Employee | null>(employee);

    React.useEffect(() => {
        setEditedEmployee(employee);
    }, [employee]);

    const handleSave = () => {
        if (editedEmployee) {
            onSave(editedEmployee);
            onOpenChange(false);
        }
    };

    if (!isOpen || !editedEmployee) return null;

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Personnel: {employee?.name}</DialogTitle>
                    <DialogDescription>
                        Make changes to the employee's details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={editedEmployee.name} onChange={e => setEditedEmployee({...editedEmployee, name: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={editedEmployee.email} onChange={e => setEditedEmployee({...editedEmployee, email: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input id="phone" value={editedEmployee.phoneNumber} onChange={e => setEditedEmployee({...editedEmployee, phoneNumber: e.target.value})} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function PersonnelDataTable() {
    const { employees, currentUser, updateEmployeeRole, updateEmployee, deleteEmployee, addEmployee, bulkAddEmployees } = useSchedule();
    const { toast } = useToast();
    const router = useRouter();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleOpenEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEditOpen(true);
    };

    const handleSaveEmployee = (updatedEmployee: Employee) => {
        updateEmployee(updatedEmployee);
        toast({
            title: "Employee Updated",
            description: `${updatedEmployee.name}'s details have been updated.`,
        });
    };
    
    const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'personnelId'>) => {
        addEmployee(newEmployee);
        toast({
            title: "Employee Added",
            description: `${newEmployee.name} has been added to personnel.`,
        });
    }

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
    
    const handlePasswordReset = (employee: Employee) => {
        toast({
            title: "Password Reset Sent",
            description: `A password reset link has been sent to ${employee.email}.`,
        })
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

    const exportToCsv = () => {
        const headers = ["Personnel ID", "Name", "Email", "Phone Number", "Role"];
        const rows = table.getRowModel().rows.map(row => row.original).map(emp => [
            emp.personnelId,
            `"${emp.name}"`,
            emp.email,
            emp.phoneNumber,
            emp.role
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `personnel_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "The personnel data has been exported to a CSV file.",
        });
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                const newEmployees: Omit<Employee, 'id' | 'personnelId'>[] = json.map((row: any) => {
                    const name = String(row['Name']);
                    const email = String(row['Email']);
                    const role = String(row['Role']) as Employee['role'];
                    const phoneNumber = String(row['Phone Number']);

                    if (!name || !email) {
                        throw new Error(`Row is missing required fields (Name, Email).`);
                    }

                    if (!validRoles.includes(role)) {
                         throw new Error(`Invalid role '${role}' for user ${name}. Valid roles are: ${validRoles.join(', ')}.`);
                    }

                    return { name, email, phoneNumber, role };
                });

                bulkAddEmployees(newEmployees);

                toast({
                    title: "Import Successful",
                    description: `${newEmployees.length} employee(s) imported successfully.`,
                });

            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: error instanceof Error ? error.message : "An unknown error occurred during import.",
                });
            } finally {
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                 }
            }
        };
        reader.readAsBinaryString(file);
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
                        {validRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenEdit(employee)} className="flex items-center gap-2">
                           <Pencil className="w-4 h-4" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePasswordReset(employee)} className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Reset Password
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => router.push(`/dashboard/administration/personnel/${employee.id}`)} className="flex items-center gap-2">
                           <FileText className="w-4 h-4" /> View Full File
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
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        globalFilter,
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by ID, name, email, or role..."
          value={globalFilter ?? ""}
          onChange={(event) =>
            setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
             <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileImport}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2" />
                Import
            </Button>
            <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2" />
                Export
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
                <PlusCircle className="mr-2" />
                Add Personnel
            </Button>
        </div>
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
                        if (['actions', 'role'].includes(cell.column.id)) {
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
       <EditEmployeeDialog 
            employee={selectedEmployee}
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSaveEmployee}
        />
        <AddEmployeeDialog
            isOpen={isAddOpen}
            onOpenChange={setIsAddOpen}
            onSave={handleAddEmployee}
        />
    </div>
  )
}

    