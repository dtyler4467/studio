
"use client";

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useSchedule, QualityHold } from "@/hooks/use-schedule"
import { format } from "date-fns"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { MoreHorizontal, ShieldCheck, ShieldX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

export function QualityHoldTable() {
  const { qualityHolds, inventoryItems, releaseFromHold, scrapItem } = useSchedule();
  const { toast } = useToast();
  const [itemToScrap, setItemToScrap] = React.useState<QualityHold | null>(null);

  const handleRelease = (holdId: string) => {
    releaseFromHold(holdId);
    toast({ title: 'Item Released', description: 'The item has been released back to inventory.' });
  }

  const handleScrap = () => {
    if (itemToScrap) {
      scrapItem(itemToScrap.id);
      toast({ variant: 'destructive', title: 'Item Scrapped', description: 'The item has been marked as scrapped and removed from inventory.' });
      setItemToScrap(null);
    }
  }

  const columns: ColumnDef<QualityHold>[] = [
    {
      id: 'item',
      header: 'Item',
      cell: ({ row }) => {
        const item = inventoryItems.find(i => i.sku === row.original.itemId);
        return (
          <div>
            <p className="font-medium">{item?.sku}</p>
            <p className="text-sm text-muted-foreground">{item?.description}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
    },
    {
      accessorKey: 'holdDate',
      header: 'Date Placed',
      cell: ({ row }) => format(new Date(row.original.holdDate), "PPP"),
    },
    {
      accessorKey: 'placedBy',
      header: 'Placed By',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.status === 'On Hold' ? 'destructive' : 'default'}>{row.original.status}</Badge>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const hold = row.original
        if (hold.status === 'Released' || hold.status === 'Scrapped') {
          return null;
        }

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
                <DropdownMenuItem onClick={() => handleRelease(hold.id)}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Release from Hold
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); setItemToScrap(hold); }}>
                       <ShieldX className="mr-2 h-4 w-4" /> Mark as Scrapped
                    </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to scrap this item?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently mark the item as scrapped and it will be removed from inventory counts.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToScrap(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleScrap}>Yes, Scrap Item</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    },
  ]

  const table = useReactTable({
    data: qualityHolds,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No items are currently on quality hold.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
