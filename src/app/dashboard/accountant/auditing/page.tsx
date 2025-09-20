
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, FileScan, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

type AuditStatus = 'Planned' | 'In Progress' | 'Awaiting Review' | 'Completed' | 'Canceled';
type Audit = {
  id: string;
  title: string;
  area: string;
  auditorId: string;
  startDate: Date;
  endDate: Date;
  status: AuditStatus;
};

const initialAudits: Audit[] = [
  { id: 'AUD-001', title: 'Q3 Financial Statement Review', area: 'General Ledger', auditorId: 'USR004', startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 14)), status: 'In Progress' },
  { id: 'AUD-002', title: 'A/P Process Audit', area: 'Accounts Payable', auditorId: 'USR004', startDate: new Date(new Date().setDate(new Date().getDate() - 30)), endDate: new Date(new Date().setDate(new Date().getDate() - 15)), status: 'Completed' },
];

function AddAuditDialog({ onSave, employees }: { onSave: (audit: Omit<Audit, 'id' | 'status'>) => void, employees: Employee[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [area, setArea] = useState('');
    const [auditorId, setAuditorId] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const { toast } = useToast();

    const handleSave = () => {
        if (!title || !area || !auditorId || !dateRange?.from || !dateRange?.to) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
            return;
        }
        onSave({ title, area, auditorId, startDate: dateRange.from, endDate: dateRange.to });
        setIsOpen(false);
        setTitle(''); setArea(''); setAuditorId(''); setDateRange(undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/> New Audit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule New Audit</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="area" className="text-right">Audit Area</Label>
                        <Input id="area" value={area} onChange={e => setArea(e.target.value)} className="col-span-3" placeholder="e.g., Accounts Payable" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="auditor" className="text-right">Auditor</Label>
                        <Select value={auditorId} onValueChange={setAuditorId}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select auditor..." /></SelectTrigger>
                            <SelectContent>
                                {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Date Range</Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date range</span>)}</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Schedule Audit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function AuditingPage() {
    const [audits, setAudits] = useState<Audit[]>(initialAudits);
    const { toast } = useToast();
    const { employees } = useSchedule();
    
    const handleAddAudit = (auditData: Omit<Audit, 'id' | 'status'>) => {
        const newAudit: Audit = {
            ...auditData,
            id: `AUD-${Date.now()}`,
            status: 'Planned',
        };
        setAudits(prev => [newAudit, ...prev]);
        toast({ title: 'Audit Scheduled', description: `Audit "${newAudit.title}" has been scheduled.` });
    };

    const handleUpdateStatus = (id: string, status: AuditStatus) => {
        setAudits(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Auditing" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <FileScan />
                        Audit Management
                    </CardTitle>
                    <CardDescription>
                        Schedule, track, and manage internal and external financial audits.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline"><Upload className="mr-2"/> Import</Button>
                    <Button variant="outline"><Download className="mr-2"/> Export</Button>
                    <AddAuditDialog onSave={handleAddAudit} employees={employees} />
                </div>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Audit</TableHead>
                                <TableHead>Area</TableHead>
                                <TableHead>Auditor</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {audits.map(audit => {
                                const auditor = employees.find(e => e.id === audit.auditorId);
                                return (
                                <TableRow key={audit.id}>
                                    <TableCell className="font-medium">{audit.title}</TableCell>
                                    <TableCell>{audit.area}</TableCell>
                                    <TableCell>{auditor?.name || 'N/A'}</TableCell>
                                    <TableCell>{format(audit.startDate, 'P')} - {format(audit.endDate, 'P')}</TableCell>
                                    <TableCell>
                                        <Badge variant={audit.status === 'Completed' ? 'default' : 'secondary'} className={audit.status === 'Completed' ? 'bg-green-600' : ''}>{audit.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(audit.id, 'In Progress')}>In Progress</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(audit.id, 'Awaiting Review')}>Awaiting Review</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(audit.id, 'Completed')}>Completed</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View Report</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Cancel Audit</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
