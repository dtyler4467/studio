
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, Trash2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useSchedule, JobPosting } from "@/hooks/use-schedule"
import { Badge } from "../ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

export function JobPostingsTable() {
    const { jobPostings, applicants, updateJobPostingStatus } = useSchedule();
    const { toast } = useToast();
    const [jobToDelete, setJobToDelete] = React.useState<JobPosting | null>(null);

    const handleDeleteClick = (job: JobPosting) => {
        setJobToDelete(job);
    };

    const confirmDelete = () => {
        if (jobToDelete) {
            updateJobPostingStatus(jobToDelete.id, 'Closed');
            toast({ variant: 'destructive', title: 'Job Posting Closed', description: `The job posting for "${jobToDelete.title}" has been closed.` });
        }
        setJobToDelete(null);
    }
    
    const columns: ColumnDef<JobPosting>[] = [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div>
                <p className="font-semibold">{row.original.title}</p>
                <p className="text-xs text-muted-foreground">{row.original.location} - {row.original.type}</p>
            </div>
        )
      },
       {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={row.original.status === 'Open' ? 'default' : 'secondary'}>{row.original.status}</Badge>,
      },
       {
        id: "applicants",
        header: "Applicants",
        cell: ({ row }) => applicants.filter(a => a.applyingFor === row.original.id).length
       },
       {
        accessorKey: "datePosted",
        header: "Date Posted",
        cell: ({ row }) => format(row.original.datePosted, "PPP"),
       },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const job = row.original
    
          return (
             <AlertDialog>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Posting</DropdownMenuItem>
                    <DropdownMenuItem>View Applicants</DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(job)} onSelect={(e) => e.preventDefault()} disabled={job.status === 'Closed'}>
                            <Trash2 className="mr-2 h-4 w-4" /> Close Posting
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will close the job posting "{jobToDelete?.title}". You can reopen it later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setJobToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Yes, Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
          )
        },
      },
    ]

  const table = useReactTable({
    data: jobPostings,
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
                  No job postings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
