
"use client"

import * as React from "react"
import { useSchedule, YardEvent } from "@/hooks/use-schedule"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, ArrowLeftRight, Move } from "lucide-react"


export function LostAndFoundTable() {
    const { lostAndFound, parkingLanes, yardEvents, moveTrailer } = useSchedule();
    const { toast } = useToast();
    const router = useRouter();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<YardEvent | null>(null);
    const [moveToLane, setMoveToLane] = React.useState<string>("");

    const openMoveDialog = (event: YardEvent) => {
        setSelectedEvent(event);
        setIsMoveDialogOpen(true);
    };
    
    const handleProcessGateTransaction = (event: YardEvent) => {
        const query = new URLSearchParams({
            loadNumber: event.loadNumber,
            trailerId: event.trailerId,
            carrier: event.carrier,
            scac: event.scac,
            driver: event.driverName,
            sealNumber: event.sealNumber || '',
            transactionType: 'outbound'
        }).toString();

        router.push(`/dashboard/yard-management/check-in?${query}`);
    }

    const handleMove = () => {
        if (selectedEvent && moveToLane) {
            try {
                moveTrailer(selectedEvent.id, moveToLane, true);
                toast({ title: "Trailer Moved", description: `Trailer ${selectedEvent.trailerId} moved to lane ${moveToLane}.` });
                setIsMoveDialogOpen(false);
                setSelectedEvent(null);
                setMoveToLane("");
            } catch (error: any) {
                 toast({ variant: 'destructive', title: "Move Failed", description: error.message });
            }
        }
    };
    
    const availableLanes = React.useMemo(() => {
        const occupiedLanes = new Set(yardEvents.filter(e => e.assignmentType === 'lane_assignment').map(e => e.assignmentValue));
        return parkingLanes.filter(lane => !occupiedLanes.has(lane));
    }, [parkingLanes, yardEvents]);


    const columns: ColumnDef<YardEvent>[] = [
        {
            accessorKey: "trailerId",
            header: "Trailer ID",
        },
        {
            accessorKey: "carrier",
            header: "Carrier",
        },
        {
            accessorKey: "loadNumber",
            header: "Load/BOL",
        },
        {
            accessorKey: "timestamp",
            header: "Time Moved to Lost",
            cell: ({ row }) => format(new Date(row.original.timestamp), 'P p'),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const event = row.original;
                return (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openMoveDialog(event)}>
                                <Move className="mr-2 h-4 w-4" />
                                <span>Move to new Lane</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleProcessGateTransaction(event)}>
                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                                <span>Process Gate Transaction</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable({
        data: lostAndFound,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
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
                        No lost trailers.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
             <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Trailer {selectedEvent?.trailerId}</DialogTitle>
                        <DialogDescription>
                            Select an available parking lane to move the trailer to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lane" className="text-right">
                                Destination Lane
                            </Label>
                            <Select value={moveToLane} onValueChange={setMoveToLane}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a lane" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLanes.length > 0 ? (
                                        availableLanes.map(lane => (
                                            <SelectItem key={lane} value={lane}>{lane}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="" disabled>No available lanes</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleMove} disabled={!moveToLane}>Move Trailer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
