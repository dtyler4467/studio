

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
import { ArrowUpDown, ChevronDown, Download, Edit, Folder, MoreHorizontal, File as FileIcon, Trash2, X, CalendarIcon, FileUp, Move, Share2, Upload } from "lucide-react"
import { format, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

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
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Skeleton } from "../ui/skeleton"
import { MultiSelect, MultiSelectOption } from "../ui/multi-select"
import { useSchedule, File } from "@/hooks/use-schedule"
import { useRouter } from "next/navigation"
import Image from "next/image"

const getFileIcon = (type: File['type']) => {
    switch (type) {
        case 'PDF': return <FileIcon className="text-red-500" />;
        case 'Image': return <FileIcon className="text-blue-500" />;
        case 'Excel': return <FileIcon className="text-green-500" />;
        case 'Word': return <FileIcon className="text-blue-700" />;
        default: return <FileIcon />;
    }
}

const ClientFormattedDate = ({ date }: { date: Date | null }) => {
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        if (date) {
            setFormattedDate(format(date, "PPP p"));
        }
    }, [date]);

    if (!formattedDate) {
        return <Skeleton className="h-4 w-[150px]" />;
    }
    return <>{formattedDate}</>;
}

const ShareDialog = ({ file, isOpen, onOpenChange }: { file: File | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { employees, logFileShare, currentUser } = useSchedule();
    const [recipients, setRecipients] = React.useState<string[]>([]);
    const employeeOptions: MultiSelectOption[] = React.useMemo(() => employees.map(e => ({ value: e.email || '', label: e.name })).filter(e => e.value), [employees]);
    
    const handleShare = () => {
        if (!file || !currentUser) return;

        logFileShare(file.name, currentUser.name, recipients);

        const subject = `File Shared: ${file.name}`;
        const body = `A file has been shared with you from the LogiFlow system.\n\nFile: ${file.name}\n\nThis is an automated message.`;
        
        window.location.href = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        onOpenChange(false);
        setRecipients([]);
    };
    
    if (!file) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share File: {file.name}</DialogTitle>
                    <DialogDescription>
                        Select recipients to share this file with. This will open your default email client.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="recipients">Recipients</Label>
                    <MultiSelect
                        options={employeeOptions}
                        selected={recipients}
                        onChange={setRecipients}
                        placeholder="Select or type email..."
                        allowOther
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleShare} disabled={recipients.length === 0}>
                        <Share2 className="mr-2" /> Share
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const FilePreviewDialog = ({ file, isOpen, onOpenChange }: { file: File | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!file) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{file.name}</DialogTitle>
                    <DialogDescription>{file.type} - {(file.size / (1024*1024)).toFixed(2)} MB</DialogDescription>
                </DialogHeader>
                <div className="p-4 border rounded-md bg-muted h-[70vh] flex items-center justify-center">
                    {file.type === 'Image' ? (
                        <Image src={'https://picsum.photos/seed/doc/800/1100'} alt={file.name} width={800} height={1100} className="max-h-full max-w-full object-contain" />
                    ) : (
                         <div className="text-center text-muted-foreground">
                            <FileIcon className="mx-auto h-24 w-24" />
                            <p className="mt-4">Preview not available for this file type.</p>
                            <p className="text-sm">You can download the file to view it.</p>
                        </div>
                    )}
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


type FileDataTableProps = {
    onRowClick?: (file: File) => void;
}

export function FileDataTable({ onRowClick }: FileDataTableProps) {
    const { files, deleteFile, currentUser, addFile, logFileShare } = useSchedule();
    const { toast } = useToast();
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isShareOpen, setShareOpen] = React.useState(false);
    const [fileToShare, setFileToShare] = React.useState<File | null>(null);
    const [fileToDelete, setFileToDelete] = React.useState<File | null>(null);

    const handleRowClick = (file: File) => {
        if (onRowClick) {
            onRowClick(file);
        } else {
            router.push(`/dashboard/administration/files/${file.id}`);
        }
    }

    const handleShareClick = (file: File) => {
        setFileToShare(file);
        setShareOpen(true);
    }

    const handleDeleteClick = (file: File) => {
        setFileToDelete(file);
    };

    const confirmDelete = () => {
        if (fileToDelete && currentUser) {
            deleteFile(fileToDelete.id, currentUser.id);
            toast({ variant: 'destructive', title: 'File Deleted', description: `${fileToDelete.name} has been moved to the trash.` });
        }
        setFileToDelete(null);
    }
    
     const exportToXlsx = () => {
        const dataToExport = table.getFilteredRowModel().rows.map(row => {
            const { name, type, size, path, dateAdded } = row.original;
            return {
                Name: name,
                Type: type,
                Size_MB: (size / (1024 * 1024)).toFixed(4),
                Path: path,
                "Date Added": format(new Date(dateAdded), "yyyy-MM-dd HH:mm:ss"),
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Files");
        XLSX.writeFile(workbook, `Files_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        
        toast({
            title: "Export Successful",
            description: `${dataToExport.length} file(s) have been exported.`,
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

                const newFiles: File[] = json.map((row: any, index: number) => {
                    const name = row.Name;
                    const type = ['PDF', 'Image', 'Excel', 'Word', 'Other'].includes(row.Type) ? row.Type : 'Other';

                    return {
                        id: `FILE-IMPORT-${Date.now()}-${index}`,
                        name: String(name),
                        type,
                        size: Number(row.Size_MB) * 1024 * 1024,
                        path: String(row.Path),
                        dateAdded: new Date(),
                    };
                });

                // In a real app you might have a bulk add function
                newFiles.forEach(addFile);

                toast({
                    title: "Import Successful",
                    description: `${newFiles.length} file record(s) imported.`,
                });

            } catch (error) {
                console.error("Failed to import Excel file:", error);
                toast({ variant: "destructive", title: "Import Failed" });
            } finally {
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                 }
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const newFile: Omit<File, 'id'> = {
            name: file.name,
            type: file.type.startsWith('image/') ? 'Image' : file.type === 'application/pdf' ? 'PDF' : 'Other',
            size: file.size,
            path: '/uploads/',
            dateAdded: new Date(),
        };

        addFile(newFile);
        toast({ title: "File Uploaded", description: `${file.name} has been added.` });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const filteredData = React.useMemo(() => {
        let filtered = files;
        if (dateRange?.from) {
            const toDate = dateRange.to || new Date();
            filtered = filtered.filter(file => isWithinInterval(file.dateAdded, { start: dateRange.from!, end: toDate }));
        }
        if (globalFilter) {
            filtered = filtered.filter(file => file.name.toLowerCase().includes(globalFilter.toLowerCase()));
        }
        return filtered;
    }, [files, dateRange, globalFilter]);

    const columns: ColumnDef<File>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {getFileIcon(row.original.type)}
                <span>{row.original.name}</span>
            </div>
        )
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => `${(row.original.size / (1024 * 1024)).toFixed(2)} MB`
      },
      {
        accessorKey: "dateAdded",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date Added <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <ClientFormattedDate date={row.original.dateAdded} />
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const file = row.original
    
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
                    <DropdownMenuItem><Download className="mr-2"/> Download</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleShareClick(file)}><Share2 className="mr-2"/> Share</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="mr-2"/> Rename</DropdownMenuItem>
                    <DropdownMenuItem><Move className="mr-2"/> Move</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(file)} onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2"/> Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will move the file "{fileToDelete?.name}" to the trash. You can restore it later.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          )
        },
      },
    ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 gap-2">
        <Input
          placeholder="Filter files..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-xs"
        />
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Filter by date...</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
        {(globalFilter || dateRange) && <Button variant="ghost" onClick={() => {setGlobalFilter(""); setDateRange(undefined)}}>Reset <X className="ml-2 h-4 w-4" /></Button>}
        <div className="ml-auto flex items-center gap-2">
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
            <Button variant="outline" onClick={exportToXlsx}>
                <Download className="mr-2" />
                Export
            </Button>
            <Button onClick={() => {
                const fileUploader = document.getElementById('file-upload-input') as HTMLInputElement;
                fileUploader?.click();
            }}>
                <FileUp className="mr-2"/> Upload File
            </Button>
             <Input id="file-upload-input" type="file" className="hidden" onChange={handleFileUpload}/>
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
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={(e) => {
                        if (cell.column.id === 'select' || cell.column.id === 'actions') {
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <ShareDialog file={fileToShare} isOpen={isShareOpen} onOpenChange={setShareOpen} />
    </div>
  )
}
