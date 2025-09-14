
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { useSchedule, CrmContact } from "@/hooks/use-schedule"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { format } from "date-fns"

function AddContactDialog({ onSave }: { onSave: (contact: Omit<CrmContact, 'id' | 'dateAdded'>) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<Omit<CrmContact, 'id' | 'dateAdded'>>({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'Lead',
    });

    const handleSave = () => {
        onSave(formData);
        setIsOpen(false);
        setFormData({ name: '', email: '', phone: '', company: '', status: 'Lead' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Contact</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Contact</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lead">Lead</SelectItem>
                                <SelectItem value="Contact">Contact</SelectItem>
                                <SelectItem value="Customer">Customer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Contact</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function CrmContactsDataTable() {
    const { crmContacts, addCrmContact } = useSchedule();
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    
    const handleAddContact = (contactData: Omit<CrmContact, 'id' | 'dateAdded'>) => {
        addCrmContact(contactData);
        toast({ title: 'Contact Added' });
    }

    const columns: ColumnDef<CrmContact>[] = [
      {
        accessorKey: "name",
        header: "Name",
      },
       {
        accessorKey: "company",
        header: "Company",
      },
       {
        accessorKey: "email",
        header: "Email",
      },
       {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={row.original.status === 'Lead' ? 'secondary' : row.original.status === 'Customer' ? 'default' : 'outline'}>{row.original.status}</Badge>
      },
      {
        accessorKey: "dateAdded",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date Added <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => format(row.original.dateAdded, "PPP"),
      },
      {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal /></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
      }
    ];

  const table = useReactTable({
    data: crmContacts,
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
                placeholder="Filter contacts..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
            <AddContactDialog onSave={handleAddContact} />
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
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

    